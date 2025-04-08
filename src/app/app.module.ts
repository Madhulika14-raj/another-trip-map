

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';  // standalone component
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
//Decorator that marks this class as an Angular Module.
@NgModule({
  imports: [
    BrowserModule,
    AppComponent,
    GoogleMapsModule ,
    HttpClientModule     //Other Angular modules to be used in this module.
  ],
  bootstrap: [] 
})
export class AppModule { }