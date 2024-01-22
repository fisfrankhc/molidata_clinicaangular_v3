import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { rutas } from 'src/app/shared/routes/rutas';
import { ProveedoresService } from 'src/app/shared/services/logistica/proveedor/proveedores.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
interface data {
  value: string;
}

@Component({
  selector: 'app-proveedores-nuevo',
  templateUrl: './proveedores-nuevo.component.html',
  styleUrls: ['./proveedores-nuevo.component.scss'],
})
export class ProveedoresNuevoComponent {
  form: FormGroup = new FormGroup({});
  public ruta = rutas;

  constructor(
    public proveedoresService: ProveedoresService,
    private router: Router,
    private fb: FormBuilder
  ) {
    const initialForm = this.fb.group({
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

  // Evento input para validar la longitud del documento_numero
  validarNumeroDocumento(event: any): void {
    const input = event.target;
    const inputValue = input.value;

    // Limpiar cualquier caracter que no sea un número
    const numericValue = inputValue.replace(/\D/g, '');

    // Establecer el valor limpio en el campo
    input.value = numericValue;

    // Obtener el tipo de documento actual
    const tipoDocumento = this.form.get('documento')?.value;

    // Limitar la longitud según el tipo de documento
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
    // Limpiar cualquier caracter que no sea un número
    const numericValue = inputValue.replace(/\D/g, '');
    // Establecer el valor limpio en el campo
    input.value = numericValue;
    if (numericValue.length > 9) {
      input.value = numericValue.slice(0, 9);
    }
  }

  registrarProveedor() {
    if (this.form.valid) {
      const datos = this.form.value;
      this.proveedoresService.postProveedor(datos).subscribe({
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

  public selectedValue!: string;
  selectedList1: data[] = [{ value: 'DNI' }, { value: 'RUC' }];

  // Función para convertir a mayúsculas
  mayusc(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }
}
