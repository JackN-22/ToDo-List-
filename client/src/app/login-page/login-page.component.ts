import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule, FormsModule, RouterLink, ToastrModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  model: any = {};
  isLoggedIn: boolean = false;

  login() {

    // let key = "Username";
    // let username = 

    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/home'),
        this.toastr.success('Successfully logged in')
        this.isLoggedIn = true;
        // localStorage.setItem(name, ddd)
      },
      error: error => this.toastr.error(error)
    })
  }
}
