import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '../../models/location';
import { GoogleMapsModule } from '@angular/google-maps';
@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  zoom = 12;
  center: google.maps.LatLngLiteral = { lat: 53.349805, lng: -6.26031 }; // Dublin center
  markers: Location[] = [];
  selectedMarker: Location | null = null;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Location[]>('assets/locations.json')
      .subscribe(data => this.markers = data);
  }

  onMarkerClick(marker: Location) {
    this.selectedMarker = marker;
  }
}
