import { Component } from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { SidebarComponent } from './components/sidebar/sidebar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent,HttpClientModule,GoogleMapsModule,SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  uniqueCategories = ['Hotel', 'Restaurant', 'Tourist Spot'];
  filterData = { query: '', categories: [] as string[] };

  handleFilter(event: { query: string, categories: string[] }) {
    this.filterData = event;
  }
}

