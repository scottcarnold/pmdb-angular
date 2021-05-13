import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-table-columns',
  templateUrl: './table-columns.component.html',
  styleUrls: ['./table-columns.component.css']
})
export class TableColumnsComponent implements OnInit {

  displayAttributes = [];

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.movieService.getTableColumnPreferences().subscribe(displayAttributes => {
      this.displayAttributes = displayAttributes;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayAttributes, event.previousIndex, event.currentIndex);
  }
}
