import { Component,ViewChild, Input, SimpleChanges, OnChanges, QueryList, ViewChildren } from '@angular/core';
import { Location } from '../../models/location';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
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

  constructor(private mapService:MapService,private mapsLoader: GoogleMapsLoaderService,private router: Router) {}
  @ViewChild(GoogleMap) googleMapComponent!: GoogleMap;
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
  map:any;
  selectedMarkers: google.maps.LatLngLiteral[] = [];
  distanceInKm: number | null = null;
  directionsRenderer!: google.maps.DirectionsRenderer;
  showDistance = false;
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
    this.showDistance = false; // Set default to hide distance
    
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
    if (!this.infoWindow) {
      console.error('infoWindow is not initialized');
      return; // Prevent errors if infoWindow is undefined
    }
  
    const marker = this.mapMarkers.get(index);
    if (marker) {
      this.selectedLocation = location;
      this.infoWindow.open(marker);
    }
  }
  
  onMarkerClick(location: any) {
    const selected = { lat: location.lat, lng: location.lng };
  
    if (this.selectedMarkers.length === 2) {
      // Reset selection if 2 already selected
      this.selectedMarkers = [selected];
      this.distanceInKm = 0;
      this.clearRoute();
    } else {
      this.selectedMarkers.push(selected);
    }
  
    if (this.selectedMarkers.length === 2) {
      this.calculateDistance();
      this.drawRoute();
    }
  }
  
  calculateDistance() {
    if (this.selectedMarkers.length < 2) return;  // Ensure there are two markers
  
    const [start, end] = this.selectedMarkers;
    const from = new google.maps.LatLng(start.lat, start.lng);
    const to = new google.maps.LatLng(end.lat, end.lng);
    const distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);
    this.distanceInKm = +(distance / 1000).toFixed(2); // meters to km
  }
  
  drawRoute() {
    if (this.selectedMarkers.length < 2) return;  // Ensure there are two markers
  
    const directionsService = new google.maps.DirectionsService();
    
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null); // Clear the previous route
    }
  
    // Initialize DirectionsRenderer
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer?.setMap(this.googleMapComponent?.googleMap || null);
  
    const [origin, destination] = this.selectedMarkers;
  
    directionsService.route({
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      // Log the result and status to debug
      console.log('Directions Service Result:', result);
      console.log('Directions Service Status:', status);
  
      if (status === google.maps.DirectionsStatus.OK && result && result.routes && result.routes.length > 0) {
        // Ensure result has valid route data
        console.log('Directions result has valid routes:', result.routes);
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Directions request failed due to', status);
      }
    });
  }
  
  
  

  clearRoute() {
    if (this.directionsRenderer) {
       // When toggled off, reset selected markers, distance, and clear the route
       this.selectedMarkers = []; // Clear selected markers
       this.distanceInKm = null; // Clear distance
       this.showDistance=false;
       this.directionsRenderer.setDirections(null);
        this.directionsRenderer.setMap(null); // Removes the route from the map
    }
}

  isSelectedMarker(loc: { lat: number; lng: number }): boolean {
    return this.selectedMarkers.some(sel => sel.lat === loc.lat && sel.lng === loc.lng);
  }

  getMarkerIcon(loc: { lat: number; lng: number }): string {
    return this.isSelectedMarker(loc)
      ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  }
  
  toggleShowDistance() {
    this.showDistance = !this.showDistance;

    if (this.showDistance) {
        // When showing distance, calculate and draw the route
        if (this.selectedMarkers.length === 2) {
            this.calculateDistance();
            this.drawRoute();
        }
    } 
}

  
}
