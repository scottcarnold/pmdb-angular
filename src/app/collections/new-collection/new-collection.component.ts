import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-collection',
  templateUrl: './new-collection.component.html',
  styleUrls: ['./new-collection.component.css']
})
export class NewCollectionComponent implements OnInit {

  collectionForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(100)]],
    desc: ['', [Validators.required, Validators.maxLength(100)]],
    cloud: [false]
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(): void {

  }
}
