import { Component,ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Location } from '../../models/location';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MapService } from '../../services/map-service.service';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { CommonModule } from '@angular/common';

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
  filteredLocations: any[] = [];
  selectedLocation: Location | null = null;
  categories: string[] = ['Hotel', 'Restaurant'];  // Example default values

  constructor(private mapService:MapService,private mapsLoader: GoogleMapsLoaderService) {}
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  @Input() filter: { query: string; categories: string[] } = { query: '', categories: [] };
  ngOnInit() {
    this.mapsLoader.load().then(() => {
      // Google Maps is loaded, safe to use
      this.apiLoaded = true;
      this.mapService.getLocations().subscribe((data) => {
      data=[
        {
          "name": "Hilton Hotel",
          "description": "Luxury hotel in city center",
          "lat": 53.3501,
          "lng": -6.2602,
          "category": "Hotel"
        },
        {
          "name": "Trinity College",
          "description": "Historical university and tourist attraction",
          "lat": 53.3438,
          "lng": -6.2546,
          "category": "Tourist Spot"
        }
      ]
      
        
        this.locations = data;
        this.filteredLocations = data;
        console.log("markers>>>",this.locations)

      });
    }).catch(err => {
      console.error('Failed to load Google Maps', err);
    });
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.applyFilters();
    }
  }

  applyFilters(): void {
    const { query, categories } = this.filter;

    this.filteredLocations = this.locations.filter(loc => {
      const matchesQuery = !query || loc.name.toLowerCase().includes(query);
      const matchesCategory = categories.length === 0 || categories.includes(loc.category);
      console.log("matchesCategory",matchesCategory);
      console.log("matchesQuery",matchesQuery)
      return matchesQuery && matchesCategory;
    });
  }

  openInfoWindow(marker: MapMarker, location: any): void {
    this.selectedLocation = location;
    this.infoWindow.open(marker);
  }

  popupAlert(test:any){
    console.log("clicked",test);
  }
}
