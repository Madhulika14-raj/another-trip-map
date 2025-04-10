import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-left-side-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './left-side-bar.component.html',
  styleUrl: './left-side-bar.component.scss'
})
export class LeftSideBarComponent {
  searchTerm = '';
  selectedCategories: string[] = [];
  minPrice = 0;
  maxPrice = 1000;
  minRating = 0;
  categories = ['Hotel', 'Restaurant', 'Tourist Spot'];
  @Output() filtersChanged = new EventEmitter<any>();

 ngOnInit(){
 }
  applyFilters() {
    this.filtersChanged.emit({
      searchTerm: this.searchTerm.toLowerCase(),
      categories: this.selectedCategories,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minRating: this.minRating
    });
  }

  toggleCategory(category: string, event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.checked !== undefined) {
      if (target.checked) {
        this.selectedCategories.push(category);
      } else {
        this.selectedCategories = this.selectedCategories.filter(c => c !== category);
      }
      this.applyFilters();
    }
  }
}
