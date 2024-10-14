import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

@Injectable({
    providedIn: 'root'
})
export class authenticationGuard implements CanActivate {
    constructor(private accountService: AccountService, private router: Router) {}

    canActivate(): boolean {
        if (this.accountService.currentUser()) {
            return true; // User is authenticated
        }
        this.router.navigate(['/login']); // Redirect to login
        return false; // User is not authenticated
    }
}
