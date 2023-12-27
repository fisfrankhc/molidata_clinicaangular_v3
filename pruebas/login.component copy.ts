import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthloginService } from '../src/app/auth/services/authlogin.service';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginError: string = '';
  public passwordClass = false;

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  get f() {
    return this.loginForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authloginService: AuthloginService
  ) {}
  datosAPI: any;

  ngOnInit(): void {}

  loginFormSubmit() {
    const datauser = this.loginForm.value['username'];
    const pass = this.loginForm.value['password'];

    if (datauser && pass) {
      const encryptedPassword = CryptoJS.MD5(pass).toString();

      this.authloginService.getUserData(datauser).subscribe(
        (userData: any) => {
          this.datosAPI = userData[0];
          if (encryptedPassword == this.datosAPI['user_clave']) {
            this.authloginService.login();
          }
        },
        (error) => {
          console.error('Error al obtener los datos del usuario', error);
        }
      );
    }
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}
