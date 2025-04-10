
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Location } from '@angular/common';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss'
})
export class BookingPageComponent {
  bookingData = {
    name: '',
    email: '',
    date: '',
    comments: ''
  };
  constructor(private location: Location) {}
  
  ngOnInit(){
    console.log('navigated to booking page');
  }

  submitBooking() {
    console.log('Booking submitted:', this.bookingData);
    alert('Booking submitted! Check console for details.');
    this.bookingData = { name: '', email: '', date: '', comments: '' };     // resetting the form here

  }

  goBack(): void {
    this.location.back();
  }
}

