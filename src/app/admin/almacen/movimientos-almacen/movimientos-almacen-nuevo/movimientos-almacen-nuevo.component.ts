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

import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { MovimientosAlmacenService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { MovimientosAlmacenDetalleService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen-detalle.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { StockService } from 'src/app/shared/services/logistica/stock/stock.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';


import { map, startWith } from 'rxjs/operators';

interface Producto {
  idobtenido: string;
  codigoobtenido: string;
  producto: number; //*
  nombrepobtenido: string;
  cantidad: number; //*
  medida: number; //*
  vencimiento: any; //*
  lote: string; //*
  peso: number; //*
  //precio: number; //*
  subtotalagregado: string;
  movimiento: number; //*
}
interface data {
  value: string;
}

@Component({
  selector: 'app-movimientos-almacen-nuevo',
  templateUrl: './movimientos-almacen-nuevo.component.html',
  styleUrls: ['./movimientos-almacen-nuevo.component.scss'],
})
export class MovimientosAlmacenNuevoComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');
  public ruta = rutas;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private movimientosAlmacenService: MovimientosAlmacenService,
    private movimientosAlmacenDetalleService: MovimientosAlmacenDetalleService,
    private productoService: ProductoService,
    private stockService: StockService,
    private medidaService: MedidaService,
    private datePipe: DatePipe
  ) {}

  datoPRODUCTO: any[] = [];

  ngOnInit(): void {
    const initialForm = this.fb.group({
      movimientoDetalle: this.fb.group({
        idsucursal_origen: ['', Validators.required],
        sucursal_origen: ['', Validators.required],
        tipo_origen: ['', Validators.required],
        movimiento_origen: ['', Validators.required],
        codigo_origen: [''],
      }),
      productoBuscado: this.fb.group({
        idbuscado: [''],
        codigobuscado: [''],
        nombrebuscado: [''],
        nombrebproducto: [''],
        preciobuscado: [''],
        medidabuscado: [''],
        medidanombrebuscado: [''],
        cantidadbuscado: [''],
        fechabuscado: [''],
        lotebuscado: [''],
        pesobuscado: [''],
      }),
      listaMovimiento: this.fb.array([]), // FormArray para la lista de compra
    });

    // Asignar el formulario
    this.form = initialForm;

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
    //this.stockAll();
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
        this.form.get('movimientoDetalle')?.patchValue({
          idsucursal_origen: sucursalEncontrada.suc_id,
          sucursal_origen: sucursalEncontrada.suc_nombre,
        });
        /*         this.nombreSucursal = sucursalEncontrada
          ? sucursalEncontrada.suc_nombre
          : ''; */
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  datosSTOCK: any; /*
  stockAll(): void {
    this.stockService.getStockAll().subscribe({
      next: (datosSTOCK: any) => {
        this.datosSTOCK = datosSTOCK;
      },
      error: () => {},
      complete: () => {},
    });
  } */

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
        fecha_buscado: '',
        lote_buscado: '',
        peso_buscado: '',
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
        vencimiento: '',
        lote: '',
        peso: '',
        subtotalagregado: ['', Validators.required],
        descuento: [0],
      });

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
        vencimiento: this.datePipe.transform(
          productoBuscado?.get('fechabuscado')?.value,
          'yyyy/MM/dd'
        ),
        lote: productoBuscado?.get('lotebuscado')?.value,
        peso: productoBuscado?.get('pesobuscado')?.value,
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
      alert('Se necesita un producto');
    }
  }

  eliminarProducto(index: number) {
    const listaMovimiento = this.form.get('listaMovimiento') as FormArray;
    listaMovimiento.removeAt(index);

    this.calcularSubtotal();
  }

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );
  //ID DE VENTA OBTENIDA GUARDADA
  movimiento: any;

  ConfirmarMovimiento() {
    const movimientoData = {
      fecha: this.fechaFormateada,
      tipo: this.form.value.movimientoDetalle['tipo_origen'],
      usuario: this.userid,
      sucursal: this.usersucursal,
      origen: this.form.value.movimientoDetalle['movimiento_origen'],
      origencodigo: this.form.value.movimientoDetalle['codigo_origen'],
      observaciones: '',
    };
    //this.movimiento = 1;
    if (this.form.valid) {
      /*       this.form.value.listaMovimiento.forEach((producto: Producto) => {
        producto.movimiento = this.movimiento;
        console.log(producto);
        this.stockService.getStockAll().subscribe({
          next: (datosSTOCK: any) => {
            this.datosSTOCK = datosSTOCK;

            // Lógica para obtener el producto de ese stock
            const sucursalFind = this.datosSTOCK.find(
              (stock: any) =>
                stock.almacen_id === this.usersucursal &&
                stock.producto_id === producto.producto
            );
            console.log(movimientoData.tipo);
            if (sucursalFind) {
              if (movimientoData.tipo === 'INGRESO') {
                sucursalFind.cantidad =
                  Number(sucursalFind.cantidad) + Number(producto.cantidad);
                console.log(sucursalFind);
              } else {
                sucursalFind.cantidad =
                  Number(sucursalFind.cantidad) + Number(producto.cantidad);
                console.log(sucursalFind);
              }
            }
          },
          error: () => {},
          complete: () => {},
        });
      }); */
      this.movimientosAlmacenService.postMovimientos(movimientoData).subscribe({
        next: (response) => {
          this.movimiento = response;
          console.log('Movimiento registrada con éxito:', this.movimiento);
          this.form.value.listaMovimiento.forEach((producto: Producto) => {
            producto.movimiento = this.movimiento;

            this.movimientosAlmacenDetalleService
              .postMovimientosDetalle(producto)
              .subscribe({
                next: (response) => {
                  console.log('Entrada registrada con éxito:', response);
                },
                error: (errorData) => {
                  console.error(
                    'Error al enviar la solicitud POST de MOVIMIENTODETALLE:',
                    errorData
                  );
                },
                complete: () => {},
              });
          });
        },
        error: (errorData) => {
          console.error(errorData);
        },
        complete: () => {
          this.router.navigate(['/almacen/movimientos-almacen']);
        },
      });
      //console.log(this.form.value)
    }
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
}
