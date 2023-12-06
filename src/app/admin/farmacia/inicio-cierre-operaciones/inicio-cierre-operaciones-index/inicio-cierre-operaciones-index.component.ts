import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { GeneralService } from 'src/app/shared/services/general.service';
import { InicioCierreOperacionesService } from 'src/app/shared/services/farmacia/inicio-cierre-operaciones/inicio-cierre-operaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio-cierre-operaciones-index',
  templateUrl: './inicio-cierre-operaciones-index.component.html',
  styleUrls: ['./inicio-cierre-operaciones-index.component.scss'],
})
export class InicioCierreOperacionesIndexComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  public ruta = rutas;
  userid = localStorage.getItem('userid');
  fechaActual = new Date();
  fechaFormateadaver = this.datePipe.transform(this.fechaActual, 'dd/MM/yyyy');
  fechaFormateada = this.datePipe.transform(this.fechaActual, 'yyyy/MM/dd');
  fechaFormateadaVTabla = this.datePipe.transform(
    this.fechaActual,
    'yyyy-MM-dd'
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private generalService: GeneralService,
    private inicioCierreOperacionesService: InicioCierreOperacionesService
  ) {}

  ngOnInit(): void {
    const initialForm = this.fb.group({
      aperturaCaja: this.fb.group({
        usuario: ['', Validators.required],
        nombreUsuario: [''],
        fecha: [''],
        tipo: ['APERTURA'],
        monto: [''],
      }),
      cierreCaja: this.fb.group({
        usuario: ['', Validators.required],
        nombreUsuario: [''],
        fecha: [''],
        tipo: ['CIERRE'],
      }),
    });
    // Asignar el formulario
    this.form = initialForm;

    this.usuariosAll();
    this.inicioCierreOperacionesServiceAll();
  }

  datosUSER: any;
  usuariosAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSER: any) => {
        this.datosUSER = datosUSER;
        const usuarioEncontrado = this.datosUSER.find(
          (user: any) => user.user_id === this.userid
        );
        //console.log(usuarioEncontrado);
        if (usuarioEncontrado) {
          this.form.get('aperturaCaja')?.patchValue({
            usuario: usuarioEncontrado.user_id,
            nombreUsuario: usuarioEncontrado.user_nombre,
            fecha: this.fechaFormateada,
          });
          this.form.get('cierreCaja')?.patchValue({
            usuario: usuarioEncontrado.user_id,
            nombreUsuario: usuarioEncontrado.user_nombre,
            fecha: this.fechaFormateada,
          });
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosICOperaciones: any;
  ICOperacionesEncontrado1: any;
  ICOperacionesEncontrado2: any;
  inicioCierreOperacionesServiceAll(): void {
    this.inicioCierreOperacionesService
      .getInicioCierreOperacionesAll()
      .subscribe({
        next: (data) => {
          this.datosICOperaciones = data;

          //VALIDACION 1
          this.ICOperacionesEncontrado1 = this.datosICOperaciones.find(
            (ICO: any) =>
              ICO.user_id === this.userid &&
              ICO.sesion_tipo == 'APERTURA' &&
              ICO.sesion_fecha == this.fechaFormateadaVTabla
          ); //this.fechaFormateadaVTabla
          if (this.ICOperacionesEncontrado1) {
            console.log(this.ICOperacionesEncontrado1);
          }

          //VALIDACION 2
          this.ICOperacionesEncontrado2 = this.datosICOperaciones.find(
            (ICO: any) =>
              ICO.user_id === this.userid &&
              ICO.sesion_tipo == 'CIERRE' &&
              ICO.sesion_fecha == this.fechaFormateadaVTabla
          ); //this.fechaFormateadaVTabla
          if (this.ICOperacionesEncontrado2) {
            console.log(this.ICOperacionesEncontrado2);
          }
        },
        error: (errorData) => {
          console.log(errorData);
        },
        complete: () => {},
      });
  }

  dataApertura: any;
  apertura() {
    if (this.ICOperacionesEncontrado1) {
      Swal.fire('Ya ha realizado la apertura de CAJA en el dia!');
    } else {
      this.dataApertura = this.form.get('aperturaCaja')?.value;
      //console.log(this.dataApertura);
      this.inicioCierreOperacionesService
        .postInicioCierreOperaciones(this.dataApertura)
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (errorData) => {
            console.log(errorData);
          },
          complete: () => {
            this.inicioCierreOperacionesServiceAll();
            this.router.navigate(['/farmacia/inicio-cierre-operaciones']);
          },
        });
    }
  }

  dataCierre: any;
  cierre() {
    //console.log(this.form.get('cierreCaja')?.value);
    if (this.ICOperacionesEncontrado2) {
      Swal.fire('Ya ha realizado el cierre de CAJA en el dia!');
    } else {
      this.dataCierre = this.form.get('cierreCaja')?.value;
      //console.log(this.dataApertura);
      this.inicioCierreOperacionesService
        .postInicioCierreOperaciones(this.dataCierre)
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (errorData) => {
            console.log(errorData);
          },
          complete: () => {
            this.inicioCierreOperacionesServiceAll();
            this.router.navigate(['/farmacia/inicio-cierre-operaciones']);
          },
        });
    }
  }
}
