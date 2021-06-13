import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../service/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  loading = false;

  serverMessage: string;

  constructor(private fb: FormBuilder, private loginService : LoginServiceService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get userName() {
    return this.form.get('userName');
  }
  get password() {
    return this.form.get('password');
  }

  async onSubmit() {
    this.loading = true;

    const userName = this.userName.value;
    const password = this.password.value;

    let credentials = {username: userName, password: password};

    try {
      this.loginService.authenticate(credentials, () => {
        this.router.navigateByUrl('/');
    });
    return false;
    } catch (err) {
      this.serverMessage = err;
    }

    this.loading = false;
  }
}
