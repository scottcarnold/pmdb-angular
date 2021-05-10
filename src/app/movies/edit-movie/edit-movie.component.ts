import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MovieService } from '../movie.service';
import { CollectionService } from '../../collections/collection.service';
import { CollectionInfo } from '../../collections/collection-info';
import { Subscription } from 'rxjs';

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

  constructor(private formBuilder: FormBuilder,
    private movieService: MovieService,
    private collectionService: CollectionService) { }

  ngOnInit(): void {
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

  addAttribute(): void {
    this.updateUnusedAttributeKeys();
    let newAttribute = this.formBuilder.group({
      key: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      value: ['', [Validators.maxLength(400)]]
    });
    this.attributesArray.push(newAttribute);
  }

  removeAttribute(idx: number): void {
    this.attributesArray.removeAt(idx);
    this.updateUnusedAttributeKeys();
  }

  onSubmit() {
    console.log('form: ', this.movieForm);
  }
}
