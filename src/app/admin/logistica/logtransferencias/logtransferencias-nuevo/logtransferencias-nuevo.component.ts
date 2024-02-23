import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, HostListener } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { Router } from '@angular/router';
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

interface Producto {
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
  selector: 'app-logtransferencias-nuevo',
  templateUrl: './logtransferencias-nuevo.component.html',
  styleUrls: ['./logtransferencias-nuevo.component.scss'],
})
export class LogtransferenciasNuevoComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');
  public ruta = rutas;

  constructor(
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
    private movimientosAlmacenDetalleService: MovimientosAlmacenDetalleService
  ) {}

  datoPRODUCTO: any[] = [];

  fechaActual = new Date();
  fechaFormateada2 = this.datePipe.transform(this.fechaActual, 'yyyy/MM/dd');
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );

  ngOnInit(): void {
    const initialForm = this.fb.group({
      detalleTransferencia: this.fb.group({
        idsucursal_origen: ['', Validators.required],
        sucursal_origen: ['', Validators.required],
        fecha: ['', Validators.required],
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

    this.form.get('detalleTransferencia')?.patchValue({
      fecha: this.fechaFormateada2,
    });

    this.productoService.getProductosAll().subscribe({
      next: (data: any) => {
        this.datoPRODUCTO = data;
      },
      error: (_erroData) => {},
      complete: () => {},
    });

    this.medidasAll();
    this.filteresOption();
    this.sucursalAll();
    //this.movimientosAll();
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

  datosSUC: any;
  nombreSucursal!: string;
  sucursalAll() {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;

        // Realiza la lógica para obtener el nombre de la sucursal aquí
        const sucursalEncontrada = this.datosSUC.find(
          (sucursal: any) => sucursal.suc_id === this.usersucursal
        );
        this.form.get('detalleTransferencia')?.patchValue({
          idsucursal_origen: sucursalEncontrada.suc_id,
          sucursal_origen: sucursalEncontrada.suc_nombre,
        });
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  datosSTOCK: any;

  filteredOptions!:
    | Observable<{ id: string; nombre: string; descripcion: string }[]>
    | undefined;
  filteresOption() {
    this.filteredOptions = this.form
      .get('productoBuscado.nombrebproducto')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value as string))
      ) as
      | Observable<{ id: string; nombre: string; descripcion: string }[]>
      | undefined;
  }
  private _filter(
    value: string | null
  ): { id: string; nombre: string; descripcion: string }[] {
    if (!value) {
      return this.datoPRODUCTO.map((option) => ({
        id: option.prod_id,
        nombre: option.prod_nombre,
        descripcion: option.prod_descripcion,
      }));
    }

    const filterValue = value.toLowerCase();
    return this.datoPRODUCTO
      .filter((option) =>
        option.prod_nombre.toLowerCase().includes(filterValue)
      )
      .map((option) => ({
        id: option.prod_id,
        nombre: option.prod_nombre,
        descripcion: option.prod_descripcion,
      }));
  }

  tipoOrigen: data[] = [{ value: 'INGRESO' }, { value: 'SALIDA' }];
  movmientoOrigen1: data[] = [{ value: 'STOCK INICIAL' }, { value: 'COMPRA' }];
  movmientoOrigen2: data[] = [{ value: 'VENTA' }, { value: 'MERMA' }];

  //PARA EL 2DO FORMGROUP
  onProductSelected(event: any) {
    const selectedProduct = event.option.value;
    //console.log('Este el valor de selectedProduct: ' + selectedProduct);
    const productoSeleccionado = this.datoPRODUCTO.find(
      (producto) => producto.prod_nombre == selectedProduct
    );
    //console.log(productoSeleccionado);
    if (productoSeleccionado) {
      const medida = this.datosMED.find(
        (medida: any) => medida.med_id == productoSeleccionado.med_id
      );
      this.form.get('productoBuscado')?.patchValue({
        idbuscado: productoSeleccionado.prod_id,
        codigobuscado: productoSeleccionado.prod_codigo,
        nombrebuscado: productoSeleccionado.prod_id,
        nombrebproducto: productoSeleccionado.prod_nombre,
        preciobuscado: productoSeleccionado.precio_venta,
        medidabuscado: productoSeleccionado.med_id,
        medidanombrebuscado: medida.med_simbolo,
        cantidadbuscado: 1,
        observacionbuscado: '-',
      });
    } else {
      // Si no se selecciona un producto, puedes limpiar los campos
      this.form.get('productoBuscado')?.patchValue({
        idbuscado: '',
        codigobuscado: '',
        nombrebuscado: '',
        nombrebproducto: '',
        preciobuscado: '',
        medidabuscado: '',
        medidanombrebuscado: '',
        cantidadbuscado: null,
        observacionbuscado: '',
      });
    }
  }

  //PARA EL TERCER FORMGROUP
  agregarALista() {
    if (this.form.get('productoBuscado')?.valid) {
      const productoBuscado = this.form.get('productoBuscado');
      const listaMovimiento = this.form.get('listaMovimiento') as FormArray;

      // Crea un nuevo FormGroup para el producto
      const nuevoProducto = this.fb.group({
        idobtenido: ['', Validators.required],
        codigoobtenido: ['', Validators.required],
        producto: ['', Validators.required],
        nombrepobtenido: ['', Validators.required],
        cantidad: ['', Validators.required],
        medida: [''],
        medidanombre: [''],
        precio: ['', Validators.required],
        observacion: '',
        subtotalagregado: ['', Validators.required],
        descuento: [0],
      });

      // Obtener el id del producto buscado
      const idProductoBuscado = productoBuscado?.get('idbuscado')?.value;
      // Verificar si el producto ya está en la listaMovimiento
      const productoExistente = listaMovimiento.controls.find(
        (control) => control.get('idobtenido')?.value === idProductoBuscado
      );
      if (!productoExistente) {
        // Copia los valores del producto buscado al nuevo producto
        nuevoProducto.patchValue({
          idobtenido: productoBuscado?.get('idbuscado')?.value,
          codigoobtenido: productoBuscado?.get('codigobuscado')?.value,
          producto: productoBuscado?.get('nombrebuscado')?.value,
          nombrepobtenido: productoBuscado?.get('nombrebproducto')?.value,
          cantidad: productoBuscado?.get('cantidadbuscado')?.value,
          medida: productoBuscado?.get('medidabuscado')?.value,
          medidanombre: productoBuscado?.get('medidanombrebuscado')?.value,
          precio: productoBuscado?.get('preciobuscado')?.value,
          observacion: productoBuscado?.get('observacionbuscado')?.value,
          descuento: 0,
          subtotalagregado: (
            productoBuscado?.get('preciobuscado')?.value *
            productoBuscado?.get('cantidadbuscado')?.value
          ).toString(),
        });

        // Agrega el nuevo producto a la lista de compra
        listaMovimiento.push(nuevoProducto);
        //console.log(listaMovimiento.controls);

        this.calcularSubtotal();

        this.form.get('productoBuscado')?.reset();
      } else {
        alert('El producto ya está en la lista.');
      }
    } else {
      alert('Se necesita un producto');
    }
  }

  eliminarProducto(index: number) {
    const listaMovimiento = this.form.get('listaMovimiento') as FormArray;
    listaMovimiento.removeAt(index);

    this.calcularSubtotal();
  }

  //ID DE VENTA OBTENIDA GUARDADA
  movimiento: any;
  dataCOMPRA: any;
  dataPROCOMPRA: any[] = [];
  productosNoEncontrados: number[] = [];
  dataOperacionCompra: any;

  productoEncontrado(producto: any): boolean {
    return (
      this.dataPROCOMPRA &&
      this.dataPROCOMPRA.some(
        (productoCompra: any) =>
          productoCompra.producto_id === producto.idobtenido
      )
    );
  }

  calcularSubtotal(): number {
    const listaMovimiento = this.form.get('listaMovimiento') as FormArray;
    let subtotal = 0;

    for (const control of listaMovimiento.controls) {
      const subtotalProducto = parseFloat(
        control.get('subtotalagregado')?.value || 0
      );
      subtotal += subtotalProducto;
    }

    return subtotal;
  }

  calcularTotal(): number {
    // Puedes agregar impuestos u otros costos si es necesario
    return this.calcularSubtotal(); // Por ahora, el total es igual al subtotal
  }

  @ViewChild('addToListLink') addToListLink!: ElementRef;
  // Escucha el evento keydown en toda la página.
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Verificar si la tecla si la tecla 'Ctrl' y la tecla 'A' y está presionada.
    if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
      // Evita el comportamiento predeterminado del navegador para la combinación Ctrl + A.
      event.preventDefault();

      // Llama a la función agregarALista().
      this.agregarALista();
    }
  }

  idrptaMovimientoIngreso: any;
  idrptaMovimientoEgreso: any;
  ConfirmarTransferencia() {
    if (
      this.form.get('detalleTransferencia')?.valid &&
      this.form.get('listaMovimiento')?.valid
    ) {
      Notiflix.Loading.circle('Guardando...');

      const dataMovimientoIngreso = {
        fecha: this.fechaFormateada,
        tipo: 'INGRESO',
        usuario: this.userid,
        sucursal: this.usersucursal,
        origen: 'TRANSFERENCIA',
        origencodigo: '',
        observaciones: '',
      };

      const dataMovimientoEgreso = {
        fecha: this.fechaFormateada,
        tipo: 'EGRESO',
        usuario: this.userid,
        sucursal: this.usersucursal,
        origen: 'TRANSFERENCIA',
        origencodigo: '',
        observaciones: '',
      };

      forkJoin([
        this.movimientosAlmacenService
          .postMovimientos(dataMovimientoIngreso)
          .pipe(
            tap((responseMovimientoIngreso) => {
              console.log(
                'Registro de Ingreso exitoso',
                responseMovimientoIngreso
              );
              this.idrptaMovimientoIngreso = responseMovimientoIngreso;
            }),
            concatMap(() =>
              forkJoin(
                this.form.value.listaMovimiento.map((producto: Producto) => {
                  const dataMovimientoIngresoDetalle = {
                    movimiento: this.idrptaMovimientoIngreso,
                    producto: producto.idobtenido,
                    cantidad: producto.cantidad,
                    medida: producto.medida,
                    lote: '',
                    peso: '',
                  };
                  return this.movimientosAlmacenDetalleService.postMovimientosDetalle(
                    dataMovimientoIngresoDetalle
                  );
                })
              ).pipe(
                catchError((errorDataDetalleIngreso) => {
                  console.error(
                    'Error al enviar la solicitud POST de MOVIMIENTODETALLE INGRESO:',
                    errorDataDetalleIngreso
                  );
                  return of(null);
                })
              )
            )
          ),
        this.movimientosAlmacenService
          .postMovimientos(dataMovimientoEgreso)
          .pipe(
            tap((responseMovimientoEgreso) => {
              console.log(
                'Registro de Egreso exitoso',
                responseMovimientoEgreso
              );
              this.idrptaMovimientoEgreso = responseMovimientoEgreso;
            }),
            concatMap(() =>
              forkJoin(
                this.form.value.listaMovimiento.map((producto: Producto) => {
                  const dataMovimientoEgresoDetalle = {
                    movimiento: this.idrptaMovimientoEgreso,
                    producto: producto.idobtenido,
                    cantidad: producto.cantidad,
                    medida: producto.medida,
                    lote: '',
                    peso: '',
                  };
                  return this.movimientosAlmacenDetalleService.postMovimientosDetalle(
                    dataMovimientoEgresoDetalle
                  );
                })
              ).pipe(
                catchError((errorDataDetalleEgreso) => {
                  console.error(
                    'Error al enviar la solicitud POST de MOVIMIENTODETALLE EGRESO:',
                    errorDataDetalleEgreso
                  );
                  return of(null);
                })
              )
            )
          ),
      ]).subscribe({
        next: () => {
          console.log('Todas las operaciones completadas');

          Notiflix.Loading.remove();
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            html: '<div style="font-size: 15px; font-weight: 700">Movimiento de transferencia realizada exitosamente...</div>',
          });
          this.router.navigate([rutas.logistica_transferencias]);
        },
        error: (errorData) => {
          console.error('Error en alguna de las operaciones:', errorData);
        },
        complete: () => {},
      });
    } else {
      alert('Faltan datos');
    }
  }
}
