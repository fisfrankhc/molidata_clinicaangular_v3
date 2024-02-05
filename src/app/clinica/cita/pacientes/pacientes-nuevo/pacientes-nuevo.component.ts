import { Component } from '@angular/core';
import { rutasclinica } from 'src/app/shared/routes/rutasclinica';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PacientesService } from 'src/app/shared/services/clinica/cita/pacientes/pacientes.service';
import { Router } from '@angular/router';

import * as Notiflix from 'notiflix';
import Swal from 'sweetalert2';

interface data {
  value: string;
}

@Component({
  selector: 'app-pacientes-nuevo',
  templateUrl: './pacientes-nuevo.component.html',
  styleUrls: ['./pacientes-nuevo.component.scss'],
})
export class PacientesNuevoComponent {
  public rutaclinica = rutasclinica;

  constructor(
    public pacientesService: PacientesService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  form = this.fb.group({
    apaterno: ['', Validators.required],
    amaterno: ['', Validators.required],
    nombres: ['', Validators.required],
    tipoPaciente: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    pacienteSexo: ['', Validators.required],
    lugarNacimiento: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', [Validators.pattern(/^\d{9}$/), Validators.required]],
    poliza: [''],
    eps: [''],
    familiar: [''],
  });

  get f() {
    return this.form.controls;
  }

  registrarPaciente() {
    if (this.form.valid) {
      const datos = this.form.value;
      console.log(datos);

      Notiflix.Loading.hourglass('Guardando...');
      this.pacientesService.postPacientes(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
          Notiflix.Loading.remove();
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            html: '<div style="font-size: 15px; font-weight: 700">Paciente registrado exitosamente</div>',
          });
        },
        error: (errorData) => {
          Notiflix.Loading.remove();
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          this.router.navigate([rutasclinica.cita_paciente]);
        },
      });
    }
  }

  tiposeguroList1: data[] = [{ value: 'PARTICULAR' }, { value: 'SEGURO' }];
  sexoList1: data[] = [
    { value: 'MASCULINO' },
    { value: 'FEMENINO' },
    { value: 'PREFIERO NO DECIRLO' },
  ];
}
