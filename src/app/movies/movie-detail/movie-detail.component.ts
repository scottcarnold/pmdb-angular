import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Movie } from '../movie';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

  movie: Movie;

  constructor(private route: ActivatedRoute, private movieService: MovieService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let movieId = params.get('id');
      this.movieService.getMovie(movieId).subscribe(movie => this.movie = movie);
    });
  }

}
