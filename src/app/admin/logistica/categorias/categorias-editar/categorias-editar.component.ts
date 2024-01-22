import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-categorias-editar',
  templateUrl: './categorias-editar.component.html',
  styleUrls: ['./categorias-editar.component.scss'],
})
export class CategoriasEditarComponent implements OnInit {
  catId: number | null = null;
  public ruta = rutas;

  constructor(
    private route: ActivatedRoute,
    public categoriaService: CategoriaService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const catIdParam = params.get('cat_id');
      if (catIdParam !== null) {
        this.catId = +catIdParam; // Convierte el valor en un número si es necesario
      }
    });
    this.categoriaDetalle(this.catId);
  }
  datoCategoria: any;

  categoriaDetalle(catId: any) {
    console.log(catId);
    this.categoriaService.getCategoria(catId).subscribe({
      next: (data) => {
        this.datoCategoria = data;
        //console.log(this.datoCategoria);
        this.form.get('id')?.setValue(this.datoCategoria[0]['cat_id']);
        this.form.get('nombre')?.setValue(this.datoCategoria[0]['cat_nombre']);
        this.form
          .get('descripcion')
          ?.setValue(this.datoCategoria[0]['cat_descripcion']);
      },
      error: (errorData) => {
        console.error('Error al obtener los datos del usuario: ', errorData);
      },
      complete: () => {
        //console.log('DATOS OBTENIDOS EXITOSAMENTE');
      },
    });
  }

  form = this.fb.group({
    id: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
  });
  get f() {
    return this.form.controls;
  }
  transformarAMayusculasNombre(event: any) {
    const valor = event.target.value;
    this.form
      .get('nombre')
      ?.setValue(valor.toUpperCase(), { emitEvent: false });
  }
  transformarAMayusculasDescripcion(event: any) {
    const valor = event.target.value;
    this.form
      .get('descripcion')
      ?.setValue(valor.toUpperCase(), { emitEvent: false });
  }

  actualizarCategoria() {
    if (this.form.valid) {
      const datos = this.form.value;
      //console.log(datos);
      this.categoriaService.updatedCategoria(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
        },
        error: (errorData) => {
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          //this.router.navigate(['/logistica/categoria']);
          this.router.navigate([rutas.logistica_categoria]);
        },
      });
    }
  }
}
