import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {

  attributesArray = this.formBuilder.array([]);
  movieForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    collectionId: [''],
    attributes: this.attributesArray
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  addAttribute(): void {
    let newAttribute = this.formBuilder.group({
      key: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      value: ['', [Validators.maxLength(400)]]
    });
    this.attributesArray.push(newAttribute);
  }

  removeAttribute(idx: number): void {
    this.attributesArray.removeAt(idx);
  }

  onSubmit() {
    console.log('form: ', this.movieForm);
  }
}
