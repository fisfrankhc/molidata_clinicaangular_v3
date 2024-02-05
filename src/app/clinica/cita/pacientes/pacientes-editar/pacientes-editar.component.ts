import { Component, OnInit } from '@angular/core';
import { rutasclinica } from 'src/app/shared/routes/rutasclinica';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PacientesService } from 'src/app/shared/services/clinica/cita/pacientes/pacientes.service';
import { ActivatedRoute, Router } from '@angular/router';

import * as Notiflix from 'notiflix';
import Swal from 'sweetalert2';

interface data {
  value: string;
}

@Component({
  selector: 'app-pacientes-editar',
  templateUrl: './pacientes-editar.component.html',
  styleUrls: ['./pacientes-editar.component.scss'],
})
export class PacientesEditarComponent implements OnInit {
  pacID: number | null = null;
  public rutaclinica = rutasclinica;

  constructor(
    private route: ActivatedRoute,
    public pacientesService: PacientesService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const pacIdParam = params.get('paciente_id');
      if (pacIdParam !== null) {
        this.pacID = +pacIdParam;
      }
    });
    this.clienteDetalle(this.pacID);
  }
  datoPaciente: any;

  clienteDetalle(pacID: any) {
    console.log(pacID);
    this.pacientesService.getPaciente(pacID).subscribe({
      next: (data) => {
        this.datoPaciente = data;
        this.form.get('id')?.setValue(this.datoPaciente[0]['paciente_id']);
        this.form
          .get('apaterno')
          ?.setValue(this.datoPaciente[0]['apellido_paterno']);
        this.form
          .get('amaterno')
          ?.setValue(this.datoPaciente[0]['apellido_materno']);
        this.form.get('nombres')?.setValue(this.datoPaciente[0]['nombres']);
        this.form
          .get('tipoPaciente')
          ?.setValue(this.datoPaciente[0]['paciente_tipo']);
        this.form
          .get('fechaNacimiento')
          ?.setValue(this.datoPaciente[0]['fecha_nacimiento']);
        this.form
          .get('pacienteSexo')
          ?.setValue(this.datoPaciente[0]['paciente_sexo']);
        this.form
          .get('lugarNacimiento')
          ?.setValue(this.datoPaciente[0]['lugar_nacimiento']);
        this.form
          .get('direccion')
          ?.setValue(this.datoPaciente[0]['paciente_direccion']);
        this.form
          .get('telefono')
          ?.setValue(this.datoPaciente[0]['paciente_telefono']);
        this.form
          .get('poliza')
          ?.setValue(this.datoPaciente[0]['numero_poliza']);
        this.form.get('eps')?.setValue(this.datoPaciente[0]['eps_seguro']);
        this.form
          .get('familiar')
          ?.setValue(this.datoPaciente[0]['familiar_declarado']);
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

  tiposeguroList1: data[] = [{ value: 'PARTICULAR' }, { value: 'SEGURO' }];
  sexoList1: data[] = [
    { value: 'MASCULINO' },
    { value: 'FEMENINO' },
    { value: 'PREFIERO NO DECIRLO' },
  ];

  editarPaciente() {
    if (this.form.valid) {
      const datos = this.form.value;
      Notiflix.Loading.hourglass('Actualizando datos de paciente...');
      this.pacientesService.updatedPaciente(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
          Notiflix.Loading.remove();
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            width: '450px',
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
            html: `<div style="font-size: 15px; font-weight: 700">Paciente ${response} actualizado exitosamente</div>`,
          });
        },
        error: (errorData) => {
          Notiflix.Loading.remove();
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          //this.router.navigate(['/despacho/cliente']);
          this.router.navigate([rutasclinica.cita_paciente]);
        },
      });
    }
  }
}
