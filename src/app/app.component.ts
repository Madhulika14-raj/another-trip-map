import { Component } from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { LeftSideBarComponent } from './components/left-side-bar/left-side-bar.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent,GoogleMapsModule,LeftSideBarComponent,RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  selectedCategories: string[] = [];
  constructor(private router: Router) {}
  onFilterChanged(categories: string[]) {
    this.selectedCategories = categories;
  }

  get isBookingRoute(): boolean {
    return this.router.url.includes('/booking');
  }
}




