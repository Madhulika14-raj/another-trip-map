import { Component,ViewChild, Input, SimpleChanges, OnChanges, QueryList, ViewChildren } from '@angular/core';
import { Location } from '../../models/location';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MapService } from '../../services/map-service.service';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule,CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnChanges{
  zoom = 12;
  apiLoaded:boolean=false;
  center: google.maps.LatLngLiteral = { lat: 53.349805, lng: -6.26031 }; // Dublin center
  locations: Location[] = [];
  filteredLocations: Location[] = [];
  selectedLocation: Location | null = null;
  categories: string[] = ['Hotel', 'Restaurant'];  // Example default values

  constructor(private mapService:MapService,private mapsLoader: GoogleMapsLoaderService,private router: Router) {}
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChildren(MapMarker) mapMarkers!: QueryList<MapMarker>;
  @Input() filters: {
    searchTerm: string;
    categories: string[];
    minPrice: number;
    maxPrice: number;
    minRating: number;
  } = {
    searchTerm: '',
    categories: [],
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0
  };

  ngOnInit() {
    this.mapsLoader.load().then(() => {
      this.apiLoaded = true;       // Google Maps is loaded, safe to use
      this.mapService.getLocations().subscribe((data) => {      
       this.locations = data;
       this.filteredLocations = data;
      });
    }).catch(err => {
      console.error('Failed to load Google Maps', err);
    });
    
  }


  selectLocation(location: Location) {
    this.selectedLocation = location;
    if (this.infoWindow) {
      this.infoWindow.open();
    }
  }
  handleAction(location: Location) { 
    this.router.navigate(['/booking']); // Navigate to the booking page
  }

  onFiltersChanged(filters: any) {
    this.filters = filters;
    this.applyFilters();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.applyFilters();
    }
  }

  applyFilters() {
    this.filteredLocations = this.locations.filter(loc => {
      const matchesCategory = this.filters.categories.length === 0 || this.filters.categories.includes(loc.category);
      const matchesSearch = loc.name.toLowerCase().includes(this.filters.searchTerm) || loc.category.toLowerCase().includes(this.filters.searchTerm);
      const matchesPrice = loc.price >= this.filters.minPrice && loc.price <= this.filters.maxPrice;
      const matchesRating = loc.rating >= this.filters.minRating;
  
      return matchesCategory && matchesSearch && matchesPrice && matchesRating;
    });
  }


  openInfoWindow(index: number, location: Location) {
    const marker = this.mapMarkers.get(index);
    if (marker) {
      this.selectedLocation = location;
      this.infoWindow.open(marker);
    }
  }
}
