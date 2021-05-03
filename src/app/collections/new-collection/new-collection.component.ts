import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Collection } from '../collection';
import { CollectionService } from '../collection.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.css']
})
export class NewCollectionComponent implements OnInit {

  collectionForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    cloud: [false]
  });

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private collectionService: CollectionService,
    private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
   let movieCollection = new Collection('',
      this.collectionForm.get('name').value,
      this.authService.user.name,
      this.collectionForm.get('cloud').value,
      false);
    console.log('attempting to add movie collection: ', movieCollection)
    this.collectionService.addMovieCollection(movieCollection).subscribe(
      movieCollection => console.log('added movie collection: ', movieCollection),
      error => console.log('error occurred: ', error),
      () => console.log('Completed')
    );
  }
}
