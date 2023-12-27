import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, HostListener } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { rutas } from 'src/app/shared/routes/rutas';
import { ProveedoresService } from 'src/app/shared/services/logistica/proveedor/proveedores.service';
import { ComprasService } from 'src/app/shared/services/logistica/compra/compras.service';
import { ComprasDetalleService } from 'src/app/shared/services/logistica/compra/compras-detalle.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { GeneralService } from 'src/app/shared/services/general.service';
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
  precio: number; //*
  subtotalagregado: string;
  compra: number; //*
}
interface data {
  value: string;
}

@Component({
  selector: 'app-compras-nuevo',
  templateUrl: './compras-nuevo.component.html',
  styleUrls: ['./compras-nuevo.component.scss'],
})
export class ComprasNuevoComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService,
    private comprasService: ComprasService,
    private comprasDetalleService: ComprasDetalleService,
    private productoService: ProductoService,
    private medidaService: MedidaService,
    private generalService: GeneralService,
    private datePipe: DatePipe
  ) {}

  public ruta = rutas;
  datoPRODUCTO: any[] = [];

  ngOnInit(): void {
    const initialForm = this.fb.group({
      proveedorDetalle: this.fb.group({
        id: ['', Validators.required],
        documento_numero: [''],
        razon_social: [''],
        proveedor_descripcion: [''],
      }),
      compraDetalle: this.fb.group({
        compra_moneda: ['', Validators.required],
        tipo_pago: ['', Validators.required],
        idempresa: ['', Validators.required],
        empresa: ['', Validators.required],
      }),
      productoBuscado: this.fb.group({
        idbuscado: [''],
        codigobuscado: [''],
        nombrebuscado: [''],
        nombrebproducto: [''],
        preciobuscado: [''],
        medidabuscado: [''],
        cantidadbuscado: [''],
      }),
      listaCompra: this.fb.array([]), // FormArray para la lista de compra
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
    this.empresaAll();
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

  datoPROVEEDOR: any[] = [];
  //PRIMER FORMGROUP
  obtenerProveedor() {
    const documento = this.form.get('proveedorDetalle.documento_numero')?.value;

    if (documento && (documento.length === 8 || documento.length === 11)) {
      this.proveedoresService.getProveedoresAll().subscribe({
        next: (response: any) => {
          this.datoPROVEEDOR = response;

          const proveedorEncontrado = this.datoPROVEEDOR.find(
            (proveedor) => proveedor.documento_numero === documento
          );

          if (proveedorEncontrado) {
            this.form
              .get('proveedorDetalle.id')
              ?.patchValue(proveedorEncontrado.proveedor_id);
            this.form
              .get('proveedorDetalle.razon_social')
              ?.patchValue(proveedorEncontrado.razon_social);
            this.form
              .get('proveedorDetalle.proveedor_descripcion')
              ?.patchValue(proveedorEncontrado.proveedor_descripcion);
          } else {
            // En caso de no encontrar el cliente, puedes limpiar los campos
            this.form.get('proveedorDetalle.id')?.patchValue('');
            this.form
              .get('proveedorDetalle.razon_social')
              ?.patchValue('Cliente no encontrado');
            this.form
              .get('proveedorDetalle.proveedor_descripcion')
              ?.patchValue('-');
          }
        },
        error: (_errorData) => {},
        complete: () => {},
      });
    } else {
      this.form.get('proveedorDetalle.id')?.patchValue('');
      this.form.get('proveedorDetalle.razon_social')?.patchValue('');
      this.form.get('proveedorDetalle.proveedor_descripcion')?.patchValue('');
    }
  }

  compraMoneda: data[] = [{ value: 'SOLES' }, { value: 'DOLARES' }];
  tipoPago: data[] = [{ value: 'CONTADO' }, { value: 'CREDITO' }];
  datosEMP: any;
  empresaAll() {
    this.generalService.getDatosEmpresa().subscribe({
      next: (datosEMP: any) => {
        this.datosEMP = datosEMP[0];
        this.form.get('compraDetalle')?.patchValue({
          idempresa: this.datosEMP.empresa_id,
          empresa: this.datosEMP.nombre_comercial,
        });
      },
      error: () => {},
      complete: () => {},
    });
  }

  //PARA EL 2DO FORMGROUP
  onProductSelected(event: any) {
    const selectedProduct = event.option.value;
    //console.log('Este el valor de selectedProduct: ' + selectedProduct);
    const productoSeleccionado = this.datoPRODUCTO.find(
      (producto) => producto.prod_nombre == selectedProduct
    );
    //console.log(productoSeleccionado);
    if (productoSeleccionado) {
      this.form.get('productoBuscado')?.patchValue({
        idbuscado: productoSeleccionado.prod_id,
        codigobuscado: productoSeleccionado.prod_codigo,
        nombrebuscado: productoSeleccionado.prod_id,
        nombrebproducto: productoSeleccionado.prod_nombre,
        preciobuscado: productoSeleccionado.precio_venta,
        medidabuscado: productoSeleccionado.med_id,
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
        cantidadbuscado: null,
      });
    }
  }

  //PARA EL TERCER FORMGROUP
  agregarALista() {
    if (this.form.get('productoBuscado')?.valid) {
      const productoBuscado = this.form.get('productoBuscado');
      const listaCompra = this.form.get('listaCompra') as FormArray;

      // Crea un nuevo FormGroup para el producto
      const nuevoProducto = this.fb.group({
        idobtenido: ['', Validators.required],
        codigoobtenido: ['', Validators.required],
        producto: ['', Validators.required],
        nombrepobtenido: ['', Validators.required],
        cantidad: ['', Validators.required],
        medida: [''],
        precio: ['', Validators.required],
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
        precio: productoBuscado?.get('preciobuscado')?.value,
        descuento: 0,
        subtotalagregado: (
          productoBuscado?.get('preciobuscado')?.value *
          productoBuscado?.get('cantidadbuscado')?.value
        ).toString(),
      });

      // Agrega el nuevo producto a la lista de compra
      listaCompra.push(nuevoProducto);
      //console.log(listaCompra.controls);

      this.calcularSubtotal();

      this.form.get('productoBuscado')?.reset();
    } else {
      alert('Se necesita un producto');
    }
  }

  eliminarProducto(index: number) {
    const listaCompra = this.form.get('listaCompra') as FormArray;
    listaCompra.removeAt(index);

    this.calcularSubtotal();
  }

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );
  //ID DE VENTA OBTENIDA GUARDADA
  compra: any;

  cotizacionClick() {
    const compraData = {
      proveedor: this.form.value.proveedorDetalle['id'],
      fecha: this.fechaFormateada,
      moneda: this.form.value.compraDetalle['compra_moneda'],
      empresa: this.form.value.compraDetalle['idempresa'],
      pago: this.form.value.compraDetalle['tipo_pago'],
      usuario: this.userid,
      proceso: 'COTIZACION',
      comprobante: '',
      seriecomprobante: '',
      numerocomprobante: '',
      destino: ''
    };
    if (this.form.valid) {
      this.comprasService.postCompras(compraData).subscribe({
        next: (response) => {
          this.compra = response;

          this.form.value.listaCompra.forEach((producto: Producto) => {
            producto.compra = this.compra;

            this.comprasDetalleService.postComprasDetalle(producto).subscribe({
              next: (response) => {
                console.log('Entrada registrada con éxito:', response);
              },
              error: (errorData) => {
                console.error(
                  'Error al enviar la solicitud POST de COMPRADETALLE:',
                  errorData
                );
              },
              complete: () => {},
            });
          });
        },
        error: (errorData) => {
          console.error(
            'Error al enviar la solicitud POST de COMPRA:',
            errorData
          );
        },
        complete: () => {
          this.router.navigate(['/logistica/compra']);
        },
      });
    }
  }

  ConfirmarCompraClick() {
    const compraData = {
      proveedor: this.form.value.proveedorDetalle['id'],
      fecha: this.fechaFormateada,
      moneda: this.form.value.compraDetalle['compra_moneda'],
      empresa: this.form.value.compraDetalle['idempresa'],
      pago: this.form.value.compraDetalle['tipo_pago'],
      usuario: this.userid,
      proceso: 'CONFIRMADO',
      comprobante: '',
      seriecomprobante: '',
      numerocomprobante: '',
      destino: '',
    };
    if (this.form.valid) {
            this.comprasService.postCompras(compraData).subscribe({
              next: (response) => {
                this.compra = response;
                console.log('Compra registrada con éxito:', this.compra);
                this.form.value.listaCompra.forEach((producto: Producto) => {
                  producto.compra = this.compra;

                  this.comprasDetalleService
                    .postComprasDetalle(producto)
                    .subscribe({
                      next: (response) => {
                        console.log('Entrada registrada con éxito:', response);
                      },
                      error: (errorData) => {
                        console.error(
                          'Error al enviar la solicitud POST de COMPRADETALLE:',
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
                this.router.navigate(['/logistica/compra']);
              },
            });
    }
  }

  calcularSubtotal(): number {
    const listaCompra = this.form.get('listaCompra') as FormArray;
    let subtotal = 0;

    for (const control of listaCompra.controls) {
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
