import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from 'src/app/shared/services/categoria/categoria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias-nuevo',
  templateUrl: './categorias-nuevo.component.html',
  styleUrls: ['./categorias-nuevo.component.scss'],
})
export class CategoriasNuevoComponent {
  public ruta = rutas;
  datos = {};

  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }
  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  registrarCategoria() {
    //console.log(this.form.value);
    //console.log(this.form.value.nombre);
    if (this.form.value) {
      this.datos = this.form.value;
      //console.log(this.datos);
      this.categoriaService.postCategoria(this.form.value).subscribe(
        (response) => {
          console.log('Respuesta de la API:', response);
          // Puedes manejar la respuesta de la API aquí
        },
        (error) => {
          console.error('Error al enviar la solicitud POST:', error);
          // Puedes mostrar un mensaje de error al usuario o realizar otras acciones de manejo de errores aquí
        }
      );
      this.form.reset();
      this.router.navigate(['/farmacia/categoria']);
    }
  }
}
