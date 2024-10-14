import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../../_models/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);  // Signal to store current user

  constructor() {
    this.loadUserFromLocalStorage();  // Load user on service initialization
  }

  // Login method
  login(model: any) {
    return this.http.post<User>(`${this.baseUrl}account/login`, model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  // Register method
  register(model: any) {
    return this.http.post<User>(`${this.baseUrl}account/register`, model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  // Set the current user and save it to localStorage
  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));  // Save user in localStorage
    this.currentUser.set(user);  // Set signal
  }

  // Logout method to clear localStorage and signal
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  // Load user from localStorage on service startup
  private loadUserFromLocalStorage() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user: User = JSON.parse(userJson);
      this.currentUser.set(user);  // Restore user from localStorage
    }
  }
}
