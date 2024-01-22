import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedoresService } from 'src/app/shared/services/logistica/proveedor/proveedores.service';
interface data {
  value: string;
}

@Component({
  selector: 'app-proveedores-editar',
  templateUrl: './proveedores-editar.component.html',
  styleUrls: ['./proveedores-editar.component.scss'],
})
export class ProveedoresEditarComponent {
  proveeId: number | null = null;
  form: FormGroup = new FormGroup({});
  public ruta = rutas;

  constructor(
    private route: ActivatedRoute,
    public proveedoresService: ProveedoresService,
    private router: Router,
    private fb: FormBuilder
  ) {
    const initialForm = this.fb.group({
      id: ['', Validators.required],
      documento: ['', Validators.required],
      numero: ['', [Validators.required, Validators.minLength(8)]],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
      descripcion: ['', Validators.required],
      representante: ['', Validators.required],
    });
    // Asignar el formulario
    this.form = initialForm;

    this.form.get('documento')?.valueChanges.subscribe(() => {
      // Limpiar el campo documento_numero al cambiar el tipo de documento
      const documentoNumeroControl = this.form.get('numero');
      documentoNumeroControl?.setValue('', { emitEvent: false });
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const proveeIdParam = params.get('proveedor_id');
      if (proveeIdParam !== null) {
        this.proveeId = +proveeIdParam;
      }
    });
    this.proveedorDetalle(this.proveeId);
  }

  datoProveedor: any;
  proveedorDetalle(proveeId: any) {
    console.log(proveeId);
    this.proveedoresService.getProveedor(proveeId).subscribe({
      next: (data) => {
        this.datoProveedor = data;
        this.form.get('id')?.setValue(this.datoProveedor[0]['proveedor_id']);
        this.form
          .get('documento')
          ?.setValue(this.datoProveedor[0]['documento_tipo']);
        this.form
          .get('numero')
          ?.setValue(this.datoProveedor[0]['documento_numero']);
        this.form
          .get('nombre')
          ?.setValue(this.datoProveedor[0]['razon_social']);
        this.form
          .get('direccion')
          ?.setValue(this.datoProveedor[0]['proveedor_direccion']);
        this.form
          .get('telefono')
          ?.setValue(this.datoProveedor[0]['proveedor_telefono']);
        this.form
          .get('email')
          ?.setValue(this.datoProveedor[0]['proveedor_email']);
        this.form
          .get('descripcion')
          ?.setValue(this.datoProveedor[0]['proveedor_descripcion']);
        this.form
          .get('representante')
          ?.setValue(this.datoProveedor[0]['representante_ventas']);
      },
      error: (errorData) => {
        console.error('Error al obtener los datos del usuario: ', errorData);
      },
      complete: () => {},
    });
  }

  public selectedValue!: string;
  selectedList1: data[] = [{ value: 'DNI' }, { value: 'RUC' }];

  validarNumeroDocumento(event: any): void {
    const input = event.target;
    const inputValue = input.value;
    const numericValue = inputValue.replace(/\D/g, '');
    input.value = numericValue;
    const tipoDocumento = this.form.get('documento')?.value;

    if (tipoDocumento === 'DNI' && numericValue.length > 8) {
      (input.value = numericValue.slice(0, 8)), { emitEvent: false };
    } else if (
      (tipoDocumento === 'CARNET DE EXTRANJERIA' || tipoDocumento === 'RUC') &&
      numericValue.length > 11
    ) {
      (input.value = numericValue.slice(0, 11)), { emitEvent: false };
    }
  }

  validarTelefono(event: any): void {
    const input = event.target;
    const inputValue = input.value;
    const numericValue = inputValue.replace(/\D/g, '');

    input.value = numericValue;
    if (numericValue.length > 9) {
      input.value = numericValue.slice(0, 9);
    }
  }

  mayusc(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }

  actualizarProveedor() {
    if (this.form.valid) {
      const datos = this.form.value;
      console.log(datos);
      this.proveedoresService.updatedProveedor(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
        },
        error: (errorData) => {
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          //this.router.navigate(['/logistica/proveedores']);
          this.router.navigate([rutas.logistica_proveedor]);
        },
      });
    }
  }
}
