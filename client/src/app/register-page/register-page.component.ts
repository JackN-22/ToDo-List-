import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  accountService = inject(AccountService);
  router = inject(Router);
  toastr = inject(ToastrService)
  http = inject(HttpClient);
  model: any = {};
  
  register() {
    return this.accountService.register(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/home')
        this.toastr.success("Successfully registered")
      },
      error: error => console.log(error.error)
    })
  }
}
