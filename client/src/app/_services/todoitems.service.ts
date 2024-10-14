import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../../_models/user';
import { ToDoItem } from '../../_models/todoitem';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoitemsService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  itemsForCurrentUser = signal<ToDoItem[]>([]);

  createNewToDoItem(model: Partial<ToDoItem>): Observable<ToDoItem> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });
    
    return this.http.post<ToDoItem>(this.baseUrl + 'account/add-todoitem', model, { headers });
  }

  deleteToDoItem(todoItemId: number){
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    return this.http.delete<ToDoItem>(`${this.baseUrl}account/delete-todoitem/${todoItemId}`, {headers});
  }

  getItemsForUser(): Observable<ToDoItem[]> {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    return this.http.get<ToDoItem[]>(this.baseUrl + 'account/getitemsforuser', { headers });
  }

  completeItem(todoItemId: number) {
    const headers = { Authorization: `Bearer ${this.getToken()}` };
    return this.http.put<ToDoItem>(`${this.baseUrl}account/itemcomplete/${todoItemId}`, {headers})
  }
  
  private getToken(): string {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user: User = JSON.parse(userJson);
      return user.token;  // Assuming the token is stored in the User model
    }
    return '';
  }
  
}
