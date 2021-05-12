import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { CollectionInfo } from 'src/app/collections/collection-info';
import { CollectionService } from 'src/app/collections/collection.service';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

  collectionInfo: CollectionInfo;
  movie: Movie;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private collectionService: CollectionService,
    private messageService: MessageService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let movieId = params.get('id');
      this.movieService.getMovie(movieId).subscribe(movie => {
        this.movie = movie;
        this.collectionService.getDefaultMovieCollection().subscribe(collectionInfo =>
          this.collectionInfo = collectionInfo
        );
      })
    });
  }

  deleteMovie(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        action: 'Delete',
        confirmQuestion: 'Are you sure you wish to delete this movie from the collection?'
      }
    });
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.movieService.deleteMovie(this.movie.id).subscribe(
          () => {
            this.messageService.info('Movie deleted from collection.');
            this.router.navigateByUrl('/movies');
          }
        )
      }
    });
  }

}
