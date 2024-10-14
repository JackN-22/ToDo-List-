import { Component, inject, model, OnInit } from '@angular/core';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { AccountService } from '../../_services/account.service';
import { TodoitemsService } from '../../_services/todoitems.service';
import { ToDoItem } from '../../../_models/todoitem';
import { CommonModule } from '@angular/common';
import { TimeagoFormatter, TimeagoModule } from 'ngx-timeago';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TemplateItemsComponent } from "../../items/template-items/template-items.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MdbDropdownModule,
    MdbCollapseModule,
    CommonModule,
    TimeagoModule,
    FormsModule,
    TemplateItemsComponent
],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  toDoItems: ToDoItem[] = []; // Property to hold the fetched items
  accountService = inject(AccountService);
  toDoItemService = inject(TodoitemsService);
  model: any = {};
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    console.log(this.accountService.currentUser()); // Log the current user object
    this.loadItemsForUser(); // Load items on initialization
  }


  loadItemsForUser() {
    this.toDoItemService.getItemsForUser().subscribe({
      next: (items) => {
        this.toDoItems = items;
        console.log(items) // Store fetched items in the component property
      },
      error: (err) => {
        console.error('Error fetching to-do items', err); // Log any errors
      }
    });
  }

  createItems() {

    if (!this.model.name){
      this.toastr.error("Name field is required...");
      return;
    } else if (!this.model.dueDate || new Date(this.model.dueDate) < new Date()) {
      this.toastr.error("Due Date must be in the future...");
      return;
    }

    this.toDoItemService.createNewToDoItem(this.model).subscribe({
      next: (newItem) => {
        this.toDoItems = [...this.toDoItems, newItem];
        this.toastr.success('New item added');
      },
      error: error => this.toastr.error(error.error)
    });
  }
  
  
}
