import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { CategoriaService } from 'src/app/shared/services/logistica/categoria/categoria.service';
interface data {
  value: string;
}

@Component({
  selector: 'app-productos-nuevo',
  templateUrl: './productos-nuevo.component.html',
  styleUrls: ['./productos-nuevo.component.scss'],
})
export class ProductosNuevoComponent implements OnInit {
  public ruta = rutas;
  public selectedValue?: string;
  public selectedValue2?: string;

  constructor(
    public productoService: ProductoService,
    public categoriaService: CategoriaService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }
  
  options: any[] = [];
  ngOnInit(): void {
    this.categoriaService.getCategoriasAll().subscribe((data: any) => {
      this.options = data;
    });
  }

  selectedList1: data[] = [
    { value: 'Seleccione' },
    { value: '1' },
    { value: '2' },
    { value: '3' },
  ];

  selectedList2: data[] = [
    { value: 'Selecciona una categoria' },
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' },
  ];

  form = this.fb.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', Validators.required],
    medida: ['', Validators.required],
    categoria: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  registrarProducto() {
    if (this.form.valid) {
      const datos = this.form.value;

      this.productoService.postProducto(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
        },
        error: (errorData) => {
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          this.router.navigate(['/logistica/producto']);
        },
      });
    }
  }
}
