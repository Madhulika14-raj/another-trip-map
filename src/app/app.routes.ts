import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'booking',
    loadComponent: () => import('./components/booking-page/booking-page.component').then(m => m.BookingPageComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/map/map.component').then(m => m.MapComponent),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
