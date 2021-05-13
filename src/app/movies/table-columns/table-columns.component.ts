import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-table-columns',
  templateUrl: './table-columns.component.html',
  styleUrls: ['./table-columns.component.css']
})
export class TableColumnsComponent implements OnInit {

  displayAttributes: string[] = [];
  unusedAttributes: string[] = [];
  selectedUnusedAttribute: string;

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.movieService.getTableColumnPreferences().subscribe(displayAttributes => {
      this.displayAttributes = displayAttributes;
      this.movieService.getAttributeKeysForDefaultCollection().subscribe(attributeKeys => {
        this.unusedAttributes = attributeKeys.filter(attributeKey => !this.displayAttributes.includes(attributeKey));
        if (this.unusedAttributes.length > 0) {
          this.selectedUnusedAttribute = this.unusedAttributes[0];
        }
      });
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    this.movieService.reorderTableColumnPreference(event.previousIndex, event.currentIndex).subscribe(() => {
      moveItemInArray(this.displayAttributes, event.previousIndex, event.currentIndex);
    });
  }

  removeAttribute(attributeName: string) {
    const idx = this.displayAttributes.indexOf(attributeName);
    this.movieService.deleteTableColumnPreference(idx).subscribe(() => {
      this.displayAttributes = this.displayAttributes.filter((value, fidx) => fidx != idx);
      this.unusedAttributes.push(attributeName);
      this.unusedAttributes.sort();
      this.selectedUnusedAttribute = this.unusedAttributes[0];
    });
  }

  addAttribute() {
    const addAttribute = this.selectedUnusedAttribute;
    this.movieService.addTableColumnPreference(addAttribute).subscribe(() => {
      this.displayAttributes.push(addAttribute);
      this.unusedAttributes = this.unusedAttributes.filter(value => value != addAttribute);
      if (this.unusedAttributes.length > 0) {
        this.selectedUnusedAttribute = this.unusedAttributes[0];
      } else {
        this.selectedUnusedAttribute = undefined;
      }
    });
  }
}
