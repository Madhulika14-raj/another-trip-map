import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MapService {
  constructor(private http: HttpClient) {}

  getLocations(): Observable<any> {
    return this.http.get("assets/locations.json");
}
}