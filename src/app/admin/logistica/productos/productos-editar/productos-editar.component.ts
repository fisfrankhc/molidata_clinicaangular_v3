import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { rutas } from 'src/app/shared/routes/rutas';
import { CategoriaService } from 'src/app/shared/services/logistica/categoria/categoria.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
interface data {
  value: string;
}

@Component({
  selector: 'app-productos-editar',
  templateUrl: './productos-editar.component.html',
  styleUrls: ['./productos-editar.component.scss'],
})
export class ProductosEditarComponent implements OnInit {
  prodId: number | null = null;
  public ruta = rutas;
  public selectedValue?: string;
  public selectedValue2?: string;

  constructor(
    private route: ActivatedRoute,
    public productoService: ProductoService,
    public categoriaService: CategoriaService,
    public medidaService: MedidaService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  categoriasData: any[] = [];
  medidasData: any[] = [];
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const catIdParam = params.get('prod_id');
      if (catIdParam !== null) {
        this.prodId = +catIdParam; // Convierte el valor en un número si es necesario
      }
    });
    this.productoDetalle(this.prodId);

    this.medidaService.getMedidasAll().subscribe((data: any) => {
      this.medidasData = data;
    });

    this.categoriaService.getCategoriasAll().subscribe((data: any) => {
      this.categoriasData = data;
    });
  }

  datoProducto: any;
  productoDetalle(prodId: any) {
    //console.log(prodId);
    this.productoService.getProducto(prodId).subscribe({
      next: (data) => {
        this.datoProducto = data;
        //console.log(this.datoCategoria);
        this.form.get('id')?.setValue(this.datoProducto[0]['prod_id']);
        this.form.get('codigo')?.setValue(this.datoProducto[0]['prod_codigo']);
        this.form.get('nombre')?.setValue(this.datoProducto[0]['prod_nombre']);
        this.form
          .get('descripcion')
          ?.setValue(this.datoProducto[0]['prod_descripcion']);
        this.form.get('precio')?.setValue(this.datoProducto[0]['precio_venta']);
        this.form.get('medida')?.setValue(this.datoProducto[0]['med_id']);
        this.form.get('categoria')?.setValue(this.datoProducto[0]['cat_id']);
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

  actualizarProducto() {
        if (this.form.valid) {
          const datos = this.form.value;
          console.log(datos);
          this.productoService.updatedProducto(datos).subscribe({
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
