import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs';
import { MovieService } from '../movie.service';
import { CollectionService } from '../../collections/collection.service';
import { CollectionInfo } from '../../collections/collection-info';
import { Movie } from '../movie';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit, OnDestroy {

  attributesArray = this.formBuilder.array([]);
  movieForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    collectionId: [''],
    attributes: this.attributesArray
  });
  attributeKeys: string[] = [];
  unusedAttributeKeys: string[] = [];
  defaultCollection$: Subscription;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private movieService: MovieService,
    private collectionService: CollectionService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let movieId = params.get('id');
      if (movieId != null && movieId != undefined) {
        this.loadMovie(movieId);
      }
    });

    // to catch default collection changes...
    this.defaultCollection$ = this.collectionService.defaultCollectionChangeEvent.subscribe(collectionInfo => {
      this.updateForDefaultCollection(collectionInfo);
    });

    // to handle initial default collection...
    this.collectionService.getDefaultMovieCollection().subscribe(collectionInfo => {
      this.updateForDefaultCollection(collectionInfo);
    });
  }

  ngOnDestroy(): void {
    this.defaultCollection$.unsubscribe();
  }

  private formToMovie(): Movie {
    let attributes: Map<string, string> = new Map();
    this.attributesArray.controls.forEach(element => {
      attributes.set(element.get('key').value, element.get('value').value);
    });
    return new Movie(
      this.movieForm.get('id').value,
      this.movieForm.get('name').value,
      this.movieForm.get('collectionId').value,
      attributes
    );
  }

  private updateForDefaultCollection(collectionInfo: CollectionInfo) {
    if (collectionInfo === null || collectionInfo === undefined) {
      this.attributeKeys = [];
      this.unusedAttributeKeys = [];
    } else {
      this.movieService.getAttributeKeysForCollection(collectionInfo.collection.id).subscribe(attributeKeys => {
        this.attributeKeys = attributeKeys;
        this.updateUnusedAttributeKeys();
      });
    }
  }

  private updateUnusedAttributeKeys() {
    this.unusedAttributeKeys = [];
    let usedAttributeKeys = new Set();
    this.attributesArray.controls.forEach(element => {
      usedAttributeKeys.add(element.get('key').value);
    });
    this.attributeKeys.forEach(key => {
      if (!usedAttributeKeys.has(key)) {
        this.unusedAttributeKeys.push(key);
      }
    });
  }

  private loadMovie(movieId: string) {
    this.loading = true;
    this.movieService.getMovie(movieId).subscribe(movie => {
      this.movieForm.patchValue(movie);
      this.attributesArray.clear();
      movie.attributes.forEach((value, key) => {
        this.addAttribute(key, value);
      });
      this.updateUnusedAttributeKeys();
      this.loading = false;
    });
  }

  addNewAttribute(): void {
    this.updateUnusedAttributeKeys();
    this.addAttribute('', '');
  }

  private addAttribute(key: string, value: string): void {
    let newAttribute = this.formBuilder.group({
      key: [key, [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      value: [value, [Validators.maxLength(400)]]
    });
    this.attributesArray.push(newAttribute);
  }

  removeAttribute(idx: number): void {
    this.attributesArray.removeAt(idx);
    this.updateUnusedAttributeKeys();
  }

  onSubmit() {
    let movie = this.formToMovie();
    if (movie.id === null || movie.id === undefined || movie.id.length === 0) {
      this.movieService.addMovie(movie).subscribe(movie => {
        this.messageService.info('Movie added to collection.');
        this.router.navigateByUrl('/movies');
      });
    } else {
      this.movieService.updateMovie(movie).subscribe(success => {
        this.messageService.info('Movie saved.');
        this.router.navigate(['/movieDetail/', movie.id]);
      });
    }
  }
}
