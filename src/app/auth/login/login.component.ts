import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthloginService } from '../services/authlogin.service';

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
          //console.log(userData);
          if (userData == 'no hay resultados') {
            alert('Usuario o contraseña no reconocida');
          } else {
            this.datosAPI = userData[0];
            if (encryptedPassword == this.datosAPI['user_clave']) {
              this.authloginService.loginexitoso(
                this.datosAPI['user_id'],
                this.datosAPI['user_name'],
                this.datosAPI['user_nombre'],
                this.datosAPI['user_correo'],
                this.datosAPI['rol_id'],
                this.datosAPI['sucursal_id'],
                this.datosAPI['user_estado']
              );
            }
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
