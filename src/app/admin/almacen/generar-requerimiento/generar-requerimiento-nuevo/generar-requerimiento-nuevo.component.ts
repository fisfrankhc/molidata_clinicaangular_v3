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
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { StockService } from 'src/app/shared/services/logistica/stock/stock.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { GenerarRequerimientoService } from 'src/app/shared/services/almacen/generar-requerimiento/generar-requerimiento.service';
import { GenerarRequerimientoDetalleService } from '../../../../shared/services/almacen/generar-requerimiento/generar-requerimiento-detalle.service';
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
  vencimiento: any;
  lote: string;
  peso: number;
  subtotalagregado: string;
  requerimiento: number; //*
  prod_stockminimo: number;
  condicion: string | null;
}
interface data {
  value: string;
}

@Component({
  selector: 'app-generar-requerimiento-nuevo',
  templateUrl: './generar-requerimiento-nuevo.component.html',
  styleUrls: ['./generar-requerimiento-nuevo.component.scss'],
})
export class GenerarRequerimientoNuevoComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');
  public ruta = rutas;
  fechaActual = new Date();
  fechaFormateadaver = this.datePipe.transform(this.fechaActual, 'dd/MM/yyyy');
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private productoService: ProductoService,
    private stockService: StockService,
    private medidaService: MedidaService,
    private generalService: GeneralService,
    private generarRequerimientoService: GenerarRequerimientoService,
    private generarRequerimientoDetalleService: GenerarRequerimientoDetalleService,
    private datePipe: DatePipe
  ) {}

  datoPRODUCTO: any[] = [];

  ngOnInit(): void {
    const initialForm = this.fb.group({
      requerimientoDetalle: this.fb.group({
        idsucursal_origen: ['', Validators.required],
        sucursal_origen: ['', Validators.required],
        user_nombre: ['', Validators.required],
        fecha: ['', Validators.required],
      }),
      productoBuscado: this.fb.group({
        idbuscado: ['', Validators.required],
        codigobuscado: [''],
        nombrebuscado: [''],
        nombrebproducto: [''],
        descripcionproducto: [''],
        preciobuscado: [''],
        medidabuscado: [''],
        medidanombrebuscado: [''],
        cantidadbuscado: [''],
        stockminimobuscado: [''],
        //fechabuscado: [''],
        //lotebuscado: [''],
        //pesobuscado: ['']
      }),
      listaRequerimiento: this.fb.array([]), // FormArray para la lista de compra
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
    this.usuariosAll();
    this.stockAll();

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
            stockminimobuscado: '',
            //fecha_buscado: '',
            //lote_buscado: '',
            //peso_buscado: '',
          });
        }
      });
  }

  datosSTOCK: any;
  stockAll(): void {
    this.stockService.getStockAll().subscribe({
      next: (datosSTOCK: any) => {
        this.datosSTOCK = datosSTOCK;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosUSER: any;
  usuariosAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSER: any) => {
        this.datosUSER = datosUSER;
        const usuarioEncontrado = this.datosUSER.find(
          (user: any) => user.user_id === this.userid
        );
        if (usuarioEncontrado) {
          this.form.get('requerimientoDetalle')?.patchValue({
            user_nombre: usuarioEncontrado.user_nombre,
            fecha: this.fechaFormateadaver,
          });
        }
      },
      error: () => {},
      complete: () => {},
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
        this.form.get('requerimientoDetalle')?.patchValue({
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

  //PARA EL 2DO FORMGROUP
  onProductSelected(event: any) {
    const selectedProduct = event.option.value;
    //console.log('Este el valor de selectedProduct: ' + selectedProduct);
    const productoSeleccionado = this.datoPRODUCTO.find(
      (producto) => producto.prod_nombre == selectedProduct
    );
    console.log(productoSeleccionado);
    if (productoSeleccionado) {
      const medida = this.datosMED.find(
        (medida: any) => medida.med_id == productoSeleccionado.med_id
      );
      const productoStock = this.datosSTOCK.find(
        (stock: any) => stock.producto_id == productoSeleccionado.prod_id
      );
      if (productoStock) {
        productoSeleccionado.prod_stockminimo = productoStock.stock_minimo;
      } else {
        productoSeleccionado.prod_stockminimo = 0;
      }

      this.form.get('productoBuscado')?.patchValue({
        idbuscado: productoSeleccionado.prod_id,
        codigobuscado: productoSeleccionado.prod_codigo,
        nombrebuscado: productoSeleccionado.prod_id,
        nombrebproducto: productoSeleccionado.prod_nombre,
        descripcionproducto: productoSeleccionado.prod_descripcion,
        preciobuscado: productoSeleccionado.precio_venta,
        medidabuscado: productoSeleccionado.med_id,
        medidanombrebuscado: medida.med_simbolo,
        cantidadbuscado: 1,
        stockminimobuscado: productoSeleccionado.prod_stockminimo,
      });
    } else {
      // Si no se selecciona un producto, puedes limpiar los campos
      this.form.get('productoBuscado')?.patchValue({
        idbuscado: '',
        codigobuscado: '',
        nombrebuscado: '',
        nombrebproducto: '',
        descripcionproducto: '',
        preciobuscado: '',
        medidabuscado: '',
        medidanombrebuscado: '',
        cantidadbuscado: null,
        stockminimobuscado: '',
        //fecha_buscado: '',
        //lote_buscado: '',
        //peso_buscado: '',
      });
    }
  }

  //PARA EL TERCER FORMGROUP
  agregarALista() {
    if (this.form.get('productoBuscado')?.valid) {
      const productoBuscado = this.form.get('productoBuscado');
      const listaRequerimiento = this.form.get(
        'listaRequerimiento'
      ) as FormArray;

      // Crea un nuevo FormGroup para el producto
      const nuevoProducto = this.fb.group({
        idobtenido: ['', Validators.required],
        codigoobtenido: ['', Validators.required],
        producto: ['', Validators.required],
        nombrepobtenido: ['', Validators.required],
        descripcionpro: ['', Validators.required],
        cantidad: ['', Validators.required],
        medida: [''],
        medidanombre: [''],
        precio: ['', Validators.required],
        stockminimo: ['', Validators.required],
        //vencimiento: '',
        //lote: '',
        //peso: '',
        //subtotalagregado: ['', Validators.required],
        //descuento: [0],
      });

      // Copia los valores del producto buscado al nuevo producto
      nuevoProducto.patchValue({
        idobtenido: productoBuscado?.get('idbuscado')?.value,
        codigoobtenido: productoBuscado?.get('codigobuscado')?.value,
        producto: productoBuscado?.get('nombrebuscado')?.value,
        nombrepobtenido: productoBuscado?.get('nombrebproducto')?.value,
        descripcionpro: productoBuscado?.get('descripcionproducto')?.value,
        cantidad: productoBuscado?.get('cantidadbuscado')?.value,
        medida: productoBuscado?.get('medidabuscado')?.value,
        medidanombre: productoBuscado?.get('medidanombrebuscado')?.value,
        precio: productoBuscado?.get('preciobuscado')?.value,
        stockminimo: productoBuscado?.get('stockminimobuscado')?.value,
        /* vencimiento: this.datePipe.transform(
          productoBuscado?.get('fechabuscado')?.value,
          'yyyy/MM/dd'
        ),
        lote: productoBuscado?.get('lotebuscado')?.value,
        peso: productoBuscado?.get('pesobuscado')?.value,
        descuento: 0, 
        subtotalagregado: (
          productoBuscado?.get('preciobuscado')?.value *
          productoBuscado?.get('cantidadbuscado')?.value
        ).toString(),*/
      });

      // Agrega el nuevo producto a la lista de compra
      listaRequerimiento.push(nuevoProducto);
      //console.log(listaRequerimiento.controls);

      this.calcularSubtotal();

      this.form.get('productoBuscado')?.reset();
    } else {
      alert('Se necesita un producto');
    }
  }

  eliminarProducto(index: number) {
    const listaRequerimiento = this.form.get('listaRequerimiento') as FormArray;
    listaRequerimiento.removeAt(index);

    this.calcularSubtotal();
  }

  get listaRequerimientoControls() {
    return (this.form.get('listaRequerimiento') as FormArray).controls;
  }
  //ID DE DEL REQUERIMIENTO GUARDADO
  requerimiento: any;
  ConfirmarRequerimiento() {
    const requerimientoData = {
      fecha: this.fechaFormateada,
      usuario: this.userid,
      sucursal: this.usersucursal,
      proceso: 'SOLICITUD',
      observaciones: '',
    };
    if (this.listaRequerimientoControls.length === 0) {
      alert('SIN PRODUCTOS EN LISTA');
    } else {
      //console.log(this.form.get('listaRequerimiento')?.value);
      //console.log(requerimientoData);
      this.generarRequerimientoService
        .postRequerimientos(requerimientoData)
        .subscribe({
          next: (response) => {
            this.requerimiento = response;
            console.log(
              'Requerimiento registrado con éxito:',
              this.requerimiento
            );

            this.form.value.listaRequerimiento.forEach((producto: Producto) => {
              producto.requerimiento = this.requerimiento;

              this.generarRequerimientoDetalleService
                .postRequerimientosDetalle(producto)
                .subscribe({
                  next: (response1) => {
                    console.log('Entrada registrada con éxito:', response1);
                  },
                  error: (errorData) => {
                    console.error(
                      'Error al enviar la solicitud POST de REQUERIMIENTOSDETALLE:',
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
            //this.router.navigate(['/almacen/generar-requerimiento']);
            this.router.navigate([rutas.almacen_generarrequerimiento]);
          },
        });
    }
  }

  calcularSubtotal(): number {
    const listaRequerimiento = this.form.get('listaRequerimiento') as FormArray;
    let subtotal = 0;

    for (const control of listaRequerimiento.controls) {
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
