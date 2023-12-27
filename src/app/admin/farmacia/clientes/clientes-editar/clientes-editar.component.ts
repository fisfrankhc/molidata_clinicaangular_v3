import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
import { ActivatedRoute, Router } from '@angular/router';

interface data {
  value: string;
}

@Component({
  selector: 'app-clientes-editar',
  templateUrl: './clientes-editar.component.html',
  styleUrls: ['./clientes-editar.component.scss'],
})
export class ClientesEditarComponent implements OnInit {
  cliId: number | null = null;
  public ruta = rutas;

  constructor(
    private route: ActivatedRoute,
    public clientesService: ClientesService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const catIdParam = params.get('cli_id');
      if (catIdParam !== null) {
        this.cliId = +catIdParam;
      }
    });
    this.clienteDetalle(this.cliId);
  }
  datoCliente: any;

  clienteDetalle(cliId: any) {
    console.log(cliId);
    this.clientesService.getCliente(cliId).subscribe({
      next: (data) => {
        this.datoCliente = data;
        this.form.get('id')?.setValue(this.datoCliente[0]['cli_id']);
        this.form
          .get('documento')
          ?.setValue(this.datoCliente[0]['tipo_documento']);
        this.form
          .get('numero')
          ?.setValue(this.datoCliente[0]['numero_documento']);
        this.form.get('nombre')?.setValue(this.datoCliente[0]['cli_nombre']);
        this.form
          .get('direccion')
          ?.setValue(this.datoCliente[0]['cli_direccion']);
        this.form.get('email')?.setValue(this.datoCliente[0]['cli_email']);
        this.form
          .get('telefono')
          ?.setValue(this.datoCliente[0]['cli_telefono']);
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
    documento: ['', Validators.required],
    numero: ['', [Validators.required, Validators.minLength(8)]],
    nombre: ['', Validators.required],
    direccion: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^\d{9}$/), Validators.required]],
  });

  public selectedValue!: string;
  selectedList1: data[] = [
    { value: 'DNI' },
    { value: 'CARNET DE EXTRANJERIA' },
  ];

  editarCliente() {
    if (this.form.valid) {
      const datos = this.form.value;
      this.clientesService.updatedCliente(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
        },
        error: (errorData) => {
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          this.router.navigate(['/farmacia/cliente']);
        },
      });
    }
  }
}
