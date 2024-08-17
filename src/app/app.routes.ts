import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CanchaReservaComponent } from './cancha-reserva/cancha-reserva.component';
import { SedeComponent } from './sede/sede.component';
import { ReservaComponent } from './reserva/reserva.component';
  // Asegúrate de que este componente esté importado

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // Redirige a la página de login por defecto
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cancha-reserva', component: CanchaReservaComponent },
  { path: 'sede', component: SedeComponent },
  { path: 'reservar', component: ReservaComponent },  // Ruta para el componente de reservas
  { path: '**', redirectTo: 'login' }  // Ruta comodín para manejar rutas no existentes
];