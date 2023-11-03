import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sucursal-editar',
  templateUrl: './sucursal-editar.component.html',
  styleUrls: ['./sucursal-editar.component.scss'],
})
export class SucursalEditarComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public sucursalService: SucursalService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  sucId: number | null = null;
  public ruta = rutas;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const catIdParam = params.get('suc_id');
      if (catIdParam !== null) {
        this.sucId = +catIdParam;
      }
    });
    this.sucursalDetalle(this.sucId);
  }
  datoSucursal: any;

  sucursalDetalle(sucId: any) {
    console.log(sucId);
    this.sucursalService.getSucursal(sucId).subscribe({
      next: (data) => {
        this.datoSucursal = data;
        this.form.get('id')?.setValue(this.datoSucursal[0]['suc_id']);
        this.form.get('nombre')?.setValue(this.datoSucursal[0]['suc_nombre']);
        this.form
          .get('direccion')
          ?.setValue(this.datoSucursal[0]['suc_direccion']);
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
    direccion: ['', Validators.required],
  });
  get f() {
    return this.form.controls;
  }

  editarSucursal() {
    if (this.form.valid) {
      const datos = this.form.value;
      this.sucursalService.updatedSucursal(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
        },
        error: (errorData) => {
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          this.router.navigate(['/sucursal']);
        },
      });
    }
  }
}
