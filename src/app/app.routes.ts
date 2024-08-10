import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CanchaReservaComponent } from './cancha-reserva/cancha-reserva.component';
import { SedeComponent } from './sede/sede.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cancha-reserva', component: CanchaReservaComponent },
  {path: 'sede', component: SedeComponent}
];
