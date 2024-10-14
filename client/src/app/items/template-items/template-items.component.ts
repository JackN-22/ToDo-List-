import { ChangeDetectorRef, Component, inject, Input, OnInit, TemplateRef } from '@angular/core';
import { ToDoItem } from '../../../_models/todoitem';
import { TimeagoModule } from 'ngx-timeago';
import { TodoitemsService } from '../../_services/todoitems.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-template-items',
  standalone: true,
  imports: [TimeagoModule, CommonModule],
  templateUrl: './template-items.component.html',
  styleUrls: ['./template-items.component.css']
})
export class TemplateItemsComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef) {}

  @Input() toDoItems: ToDoItem[] = [];
  activeTab: string = 'all';
  toDoListService = inject(TodoitemsService);
  toastr = inject(ToastrService);
  http = inject(HttpClient);
  private modalService = inject(BsModalService);
  modalRef?: BsModalRef; 
  itemToDelete?: number; 

  ngOnInit(): void {
    this.getToDoItems();
  }

  // Below method to open the confirm dialog. 
  // Class 'modal-sm' is from bootstrap
  // TemplateRef is from Angular and it's used for ng-template within HTML.
  
  openDeleteModal(todoItemId: number, template: TemplateRef<any>) {
    this.itemToDelete = todoItemId;  
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' }); 
  }
 
  confirmDelete() {
    if (this.itemToDelete !== undefined) {
      this.toDoItems = this.toDoItems.filter(item => item.todoItemId !== this.itemToDelete);
      this.deleteItem(this.itemToDelete);
    }
    this.modalRef?.hide(); 
  }

  declineDelete() {
    this.modalRef?.hide(); 
  }

  deleteItem(todoItemId: number) {
    this.toDoListService.deleteToDoItem(todoItemId).subscribe({
      next: () => {
        this.toDoItems = this.toDoItems.filter(item => item.todoItemId !== todoItemId);
        window.location.reload() // May need to remove this once the site is live within Azure
        this.toastr.success("Item deleted successfully");
      },
      error: (error) => {
        this.toastr.error("Failed to delete the item");
      }
    });
  }

  completeItem(todoItemId: number) {
    this.toDoListService.completeItem(todoItemId).subscribe({
        next: () => {
            const index = this.toDoItems.findIndex(item => item.todoItemId === todoItemId);
            if (index > -1) {
                this.toDoItems[index].dateCompleted = new Date();
                this.toDoItems[index].completed = true;
                this.toastr.success("Item marked as completed");
            }
        },
        error: (error) => {
            this.toastr.error(error.error || "Failed to mark item as complete");
        }
    });
}


  getToDoItems() {
    this.toDoListService.getItemsForUser().subscribe(items => {
      this.toDoItems = items;
    });
  }

  // Below method used in the HTML for the (click) to define the filter.

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Belove method to use the filtered tabs. 
  // activeTab is used to define each tab.
  // Then a filter method to make sure the items are filtered out going off the type of tab. 

  filteredTasks(): ToDoItem[] {
    if (this.activeTab === 'completed') {
      return this.toDoItems.filter(item => item.dateCompleted !== null);
    } else if (this.activeTab === 'incomplete') {
      return this.toDoItems.filter(item => item.dateCompleted === null);
    } else {
      return this.toDoItems;
    }
  }
  
}
