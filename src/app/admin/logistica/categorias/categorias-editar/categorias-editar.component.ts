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
import { Categoria } from 'src/app/shared/interfaces/logistica';

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
        console.log(this.datoCategoria);
        this.form.get('nombre')?.setValue(this.datoCategoria[0]['cat_nombre']);
        this.form.get('descripcion')?.setValue(this.datoCategoria[0]['cat_descripcion']);
      },
      error: (errorData) => {
        console.error('Error al obtener los datos del usuario: ', errorData);
      },
      complete: () => {
        console.log('DATOS OBTENIDOS EXITOSAMENTE');
      },
    });
  }

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
  });
  get f() {
    return this.form.controls;
  }

  actualizarCategoria(cat: any) {
    console.log(cat);
  }
}
