import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CollectionService } from 'src/app/collections/collection.service';
import { MessageService } from 'src/app/shared/message.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private collectionService: CollectionService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let attemptCount = params['attemptCount'];
      if (attemptCount === undefined) {
        this.messageService.clear();
      } else {
        this.messageService.warn('Incorrect username or password.');
      }
    })
  }

  onSubmit(): void {
    this.authService.authenticate(
      this.loginForm.get('username').value,
      this.loginForm.get('password').value,
      () => {
        if (this.authService.isUserAuthenticated()) {
          this.messageService.clear();
          this.collectionService.getDefaultMovieCollection().subscribe(
            collectionInfo => {
              if (collectionInfo === null || collectionInfo === undefined) {
                this.router.navigate(['/collections']);
              } else {
                this.router.navigate(['/movies']);
              }
            }
          );
        } else {
          this.messageService.warn('Incorrect username or password.');
        }
      });
  }
}
