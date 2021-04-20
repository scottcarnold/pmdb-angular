import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  greeting = '';

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.authenticate(
      this.loginForm.get('username').value,
      this.loginForm.get('password').value,
      () => {
        if (this.authService.authenticated) {
          this.greeting = 'authenticated';
        } else {
          this.greeting = 'NOT authenticated';
        }
      });
  }
}
