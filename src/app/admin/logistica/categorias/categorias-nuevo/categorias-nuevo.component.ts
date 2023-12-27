import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CategoriaService } from 'src/app/shared/services/logistica/categoria/categoria.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias-nuevo',
  templateUrl: './categorias-nuevo.component.html',
  styleUrls: ['./categorias-nuevo.component.scss'],
})
export class CategoriasNuevoComponent {
  public ruta = rutas;
  //datos = {};

  /* form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
  }); */

  form = this.fb.group({
    // Define aquí las propiedades que coincidan con la clase Categoria
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    // Otras propiedades...
  });

  get f() {
    return this.form.controls;
  }
  constructor(
    public categoriaService: CategoriaService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  registrarCategoria() {
    //console.log(this.form.value);
    //console.log(this.form.value.nombre);
    if (this.form.valid) {
      const datos = this.form.value;
      /* const dato1 = this.form.value.nombre;
      const dato2 = this.form.value.descripcion; */
      //console.log(this.form.value);

      this.categoriaService.postCategoria(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
        },
        error: (errorData) => {
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          this.router.navigate(['/logistica/categoria']);
        },
      });
    }
  }
}
