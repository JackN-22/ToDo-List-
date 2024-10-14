import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { HomePageComponent } from './home-page/home-page/home-page.component';
import { authenticationGuard } from './_guards/authentication.guard';

export const routes: Routes = [
    { path: 'login', component: LoginPageComponent },    // No auth required
    { path: 'register', component: RegisterPageComponent },  // No auth required
    {
        path: 'home',
        canActivate: [authenticationGuard],  // Protect this route with the guard
        component: HomePageComponent
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },  // Default redirect to home
];
