/* import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Output() filterChanged = new EventEmitter<string>();

  setFilter(type: string) {
    this.filterChanged.emit(type);
  }
  
}



 */

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  imports:[FormsModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() categories: string[] = [];
  @Output() filterChanged = new EventEmitter<{ query: string, categories: string[] }>();

  searchQuery: string = '';
  selectedCategories: string[] = [];

  onSearchChange() {
    this.emitFilter();
  }

  onFilterChange() {
    this.emitFilter();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategories = [];
    this.emitFilter();
  }

  private emitFilter() {
    this.filterChanged.emit({
      query: this.searchQuery.trim().toLowerCase(),
      categories: this.selectedCategories
    });
  }
}
