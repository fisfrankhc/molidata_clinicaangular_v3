import { Component } from '@angular/core';
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

interface data {
  value: string;
}

@Component({
  selector: 'app-productos-nuevo',
  templateUrl: './productos-nuevo.component.html',
  styleUrls: ['./productos-nuevo.component.scss'],
})
export class ProductosNuevoComponent {
  public ruta = rutas;
  public selectedValue?: string;
  public selectedValue2?: string;

  selectedList1: data[] = [
    { value: 'Select Department' },
    { value: 'Orthopedics' },
    { value: 'Radiology' },
    { value: 'Dentist' },
  ];

  selectedList2: data[] = [
    { value: 'Select City' },
    { value: 'Alaska' },
    { value: 'Los Angeles' },
  ];

  selectedList3: data[] = [
    { value: 'Select Country' },
    { value: 'Usa' },
    { value: 'Uk' },
    { value: 'Italy' },
  ];

  selectedList4: data[] = [
    { value: 'Select State' },
    { value: 'Alaska' },
    { value: 'California' },
  ];

  imageUrl: string = '';
  formData = new FormData();
  selectedFileName: string = '';

  form = this.fb.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: ['', Validators.required],
    medida: ['', Validators.required],
    imagen: ['', Validators.required],
    categoria: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  constructor(
    public productoService: ProductoService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  archivo!: File;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.archivo = event.target.files[0];
    this.formData.append('imagen', file);
    this.selectedFileName = file.name;
    this.imageUrl = window.URL.createObjectURL(file);
    console.log(file);
    //return this.http.post('assets/images/', this.formData);
    //console.log(this.imageUrl);
  }

  registrarProducto() {
    if (this.form.valid) {
      console.log(this.form.value);
    }

    /* if (this.archivo) {
      this.productoService.uploadImage(this.archivo).subscribe(
        (response) => {
          // Manejar la respuesta del servidor
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        }
      );
    } else {
      console.warn('No se ha seleccionado un archivo.');
    }
  } */
  }
}
