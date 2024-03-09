import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, HostListener } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { StockService } from 'src/app/shared/services/almacen/stock/stock.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { MovimientosAlmacenService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { MovimientosAlmacenDetalleService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen-detalle.service';
import { catchError, concatMap, map, startWith, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';
import * as Notiflix from 'notiflix';
import { Stock } from 'src/app/shared/interfaces/logistica';
import { GeneralService } from '../../../../../shared/services/general.service';

interface Producto {
  estiloRojo: boolean;
  idobtenido: string;
  codigoobtenido: string;
  producto: number; //*
  nombrepobtenido: string;
  cantidad: number; //*
  medida: number; //*
  subtotalagregado: string;
  movimiento: number; //*
  observacion: string;
}
interface data {
  value: string;
}

@Component({
  selector: 'app-transferencias-ver',
  templateUrl: './transferencias-ver.component.html',
  styleUrls: ['./transferencias-ver.component.scss'],
})
export class TransferenciasVerComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');
  public ruta = rutas;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private productoService: ProductoService,
    private stockService: StockService,
    private medidaService: MedidaService,
    private datePipe: DatePipe,
    //private movimientosCentralService: MovimientosCentralService,
    //private movimientosCentralDetalleService: MovimientosCentralDetalleService,
    private movimientosAlmacenService: MovimientosAlmacenService,
    private movimientosAlmacenDetalleService: MovimientosAlmacenDetalleService,
    private generalService: GeneralService
  ) {}

  datoPRODUCTO: any[] = [];

  fechaActual = new Date();
  fechaFormateada2 = this.datePipe.transform(this.fechaActual, 'yyyy/MM/dd');
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );
  movimientoId: any;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const movimientoIdParam = params.get('movimiento_id');
      if (movimientoIdParam !== null) {
        this.movimientoId = +movimientoIdParam;
      }
    });

    const initialForm = this.fb.group({
      movimientoDetalle: this.fb.group({
        id: ['', Validators.required],
        fecha: ['', Validators.required],
        tipo_origen: ['', Validators.required],
        usuario_id: ['', Validators.required],
        usuarioEncargado: ['', Validators.required],
        idsucursal: ['', Validators.required],
        nombreSucursal: ['', Validators.required],
        movimiento_origen: ['', Validators.required],
        codigo_origen: [''],
        observaciones: ['', Validators.required],
        estado: ['', Validators.required],
      }),
      productoBuscado: this.fb.group({
        idbuscado: ['', Validators.required],
        codigobuscado: [''],
        nombrebuscado: [''],
        nombrebproducto: [''],
        preciobuscado: [''],
        medidabuscado: [''],
        medidanombrebuscado: [''],
        cantidadbuscado: [''],
        observacionbuscado: [''],
      }),
      listaMovimiento: this.fb.array([]), // FormArray para la lista de compra
    });

    // Asignar el formulario
    this.form = initialForm;

    this.productoService.getProductosAll().subscribe({
      next: (data: any) => {
        this.datoPRODUCTO = data;
        console.log(this.datoPRODUCTO);
      },
      error: (_erroData) => {},
      complete: () => {},
    });

    this.medidasAll();
    this.usuariosAll();
    this.sucursalAll();
    this.stockAll();
    this.stockProductos();
    // Agregar suscriptor para el evento valueChanges del campo nombrebproducto en caso este vacio
    this.form
      .get('productoBuscado.nombrebproducto')
      ?.valueChanges.subscribe((value) => {
        if (!value || value.trim() === '') {
          // Si el valor es vacío, resetear los campos del grupo productoBuscado
          this.form.get('productoBuscado')?.patchValue({
            idbuscado: '',
            codigobuscado: '',
            nombrebuscado: '',
            preciobuscado: '',
            medidabuscado: '',
            medidanombrebuscado: '',
            cantidadbuscado: '',
            observacionbuscado: '',
          });
        }
      });
  }

  datosMED: any;
  medidasAll(): void {
    this.medidaService.getMedidasAll().subscribe({
      next: (datosMED: any) => {
        this.datosMED = datosMED;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosUSUARIO: any;
  usuariosAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSUARIO: any) => {
        this.datosUSUARIO = datosUSUARIO;
        console.log(this.datosUSUARIO);
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosSUC: any;
  sucursalAll() {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;
        this.movimientoInformacionGet(this.movimientoId);
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  datosSTOCK: any;
  stockAll(): void {
    this.stockService.getStockAll().subscribe({
      next: (dataStockResponse) => {
        this.datosSTOCK = dataStockResponse;
        console.log(this.datosSTOCK);
        //this.stockProductos();
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosSTOCK2: any;
  datoPRODUCTOSTOCK: any[] = [];
  stockProductos(): void {
    this.stockService.getStockAll().subscribe({
      next: (dataStockResponse2) => {
        this.datosSTOCK2 = dataStockResponse2;
        let almacen_id_deseado = this.usersucursal; // El almacen_id que quieres filtrar
        // Filtrar productos basados en el almacen_id
        let productosFiltrados = this.datoPRODUCTO.filter((producto: any) => {
          // Verificar si hay alguna entrada en datosSTOCK que coincida con el producto_id y almacen_id
          return this.datosSTOCK.some((stock: any) => {
            return (
              stock.producto_id === producto.prod_id &&
              stock.almacen_id === almacen_id_deseado
            );
          });
        });
        this.datoPRODUCTOSTOCK = productosFiltrados;
        console.log(productosFiltrados);
      },
      error: () => {},
      complete: () => {},
    });
  }

  movimientoINFO: any;
  movimientoInformacionGet(movimientoId: any): void {
    this.movimientosAlmacenService.getMovimiento(movimientoId).subscribe({
      next: (responseMov) => {
        this.movimientoINFO = responseMov;
        console.log(responseMov);
        //PARA SUCURSAL
        const sucursal = this.datosSUC.find(
          (suc: any) => suc.suc_id == this.movimientoINFO[0]['sucursal_id']
        );
        if (sucursal) {
          this.form
            .get('movimientoDetalle.nombreSucursal')
            ?.setValue(sucursal.suc_nombre);
        }
        //PARA USUARIO
        const user = this.datosUSUARIO.find(
          (user: any) => user.user_id == this.movimientoINFO[0]['usuario_id']
        );
        if (user) {
          this.form
            .get('movimientoDetalle.usuarioEncargado')
            ?.setValue(user.user_nombre);
        }
        this.form
          .get('movimientoDetalle.tipo_origen')
          ?.setValue(this.movimientoINFO[0]['movimiento_tipo']);
        this.form
          .get('movimientoDetalle.fecha')
          ?.setValue(this.movimientoINFO[0]['movimiento_fecha']);
        this.form
          .get('movimientoDetalle.usuario_id')
          ?.setValue(this.movimientoINFO[0]['usuario_id']);
        this.form
          .get('movimientoDetalle.idsucursal')
          ?.setValue(this.movimientoINFO[0]['sucursal_id']);
        this.form
          .get('movimientoDetalle.movimiento_origen')
          ?.setValue(this.movimientoINFO[0]['movimiento_origen']);
        this.form
          .get('movimientoDetalle.codigo_origen')
          ?.setValue(this.movimientoINFO[0]['codigo_origen']);
        this.form
          .get('movimientoDetalle.observaciones')
          ?.setValue(this.movimientoINFO[0]['movimiento_observaciones']);
        this.form
          .get('movimientoDetalle.estado')
          ?.setValue(this.movimientoINFO[0]['movimiento_estado']);
      },
      error: () => {},
      complete: () => {},
    });
  }

  idrptaMovimientoIngreso: any;
  idrptaMovimientoEgreso: any;
  dataverifyStock: any;
  ConfirmarTransferencia() {
    if (
      this.form.get('movimientoDetalle')?.valid &&
      this.form.get('listaMovimiento')?.valid
    ) {
      if (this.form.get('listaMovimiento')?.value == '') {
        alert('No ha añadido productos');
      } else {
      }
    } else {
      alert('Faltan datos');
    }
  }
}
