import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { rutas } from 'src/app/shared/routes/rutas';

import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { VentasService } from 'src/app/shared/services/farmacia/ventas/ventas.service';
import { VentasDetalleService } from 'src/app/shared/services/farmacia/ventas/ventas-detalle.service';
import { DatePipe } from '@angular/common';

interface Producto {
  idobtenido: string;
  codigoobtenido: string;
  producto: string;
  nombrepobtenido: string;
  cantidad: number;
  precio: number;
  subtotalagregado: string;
  venta: number;
}

@Component({
  selector: 'app-ventas-nuevo',
  templateUrl: './ventas-nuevo.component.html',
  styleUrls: ['./ventas-nuevo.component.scss'],
})
export class VentasNuevoComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private productoService: ProductoService,
    private ventasService: VentasService,
    private ventasDetalleService: VentasDetalleService,
    private datePipe: DatePipe
  ) {}

  public ruta = rutas;
  datoPRODUCTO: any[] = [];
  ngOnInit(): void {
    const initialForm = this.fb.group({
      clienteDetalle: this.fb.group({
        id: ['', Validators.required],
        documento: [''],
        nombrecliente: [''],
        email: [''],
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
        //console.log(this.datoPRODUCTO);
      },
      error: (erroData) => {},
      complete: () => {},
    });
  }

  /*
  form = this.fb.group({
    clienteDetalle: this.fb.group({
      id: [''],
      documento: [''],
      nombrecliente: [''],
      email: [''],
    }),
    productoBuscado: this.fb.group({
      idbuscado: [''],
      codigobuscado: [''],
      nombrebuscado: [''],
      preciobuscado: [''],
      medidabuscado: [''],
      cantidadbuscado: [''],
    }),
    listaCompra: this.fb.array([]), // FormArray para la lista de compra
  });
  */
  datoCliente: any[] = [];

  //PRIMER FORMGROUP
  obtenerCliente() {
    const documento = this.form.get('clienteDetalle.documento')?.value;

    if (documento && (documento.length === 8 || documento.length === 12)) {
      console.log(documento);
      this.clientesService.getClientesAll().subscribe({
        next: (response: any) => {
          this.datoCliente = response;

          const clienteEncontrado = this.datoCliente.find(
            (cliente) => cliente.numero_documento === documento
          );

          if (clienteEncontrado) {
            this.form
              .get('clienteDetalle.id')
              ?.patchValue(clienteEncontrado.cli_id);
            this.form
              .get('clienteDetalle.nombrecliente')
              ?.patchValue(clienteEncontrado.cli_nombre);
            this.form
              .get('clienteDetalle.email')
              ?.patchValue(clienteEncontrado.cli_email);
          } else {
            // En caso de no encontrar el cliente, puedes limpiar los campos
            this.form.get('clienteDetalle.id')?.patchValue('');
            this.form
              .get('clienteDetalle.nombrecliente')
              ?.patchValue('Cliente no encontrado');
            this.form.get('clienteDetalle.email')?.patchValue('-');
          }
        },
        error: (errorData) => {},
        complete: () => {},
      });
    } else {
      this.form.get('clienteDetalle.id')?.patchValue('');
      this.form.get('clienteDetalle.nombrecliente')?.patchValue('');
      this.form.get('clienteDetalle.email')?.patchValue('');
    }
  }

  //PARA EL 2DO FORMGROUP
  onProductSelected(selectedProduct: any) {
    const productoSeleccionado = this.datoPRODUCTO.find(
      (producto) => producto.prod_id == selectedProduct
    );
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
        idobtenido: [''],
        codigoobtenido: [''],
        producto: [''],
        nombrepobtenido: [''],
        cantidad: [''],
        precio: [''],
        subtotalagregado: [''],
        descuento: [0],
      });

      // Copia los valores del producto buscado al nuevo producto
      nuevoProducto.patchValue({
        idobtenido: productoBuscado?.get('idbuscado')?.value,
        codigoobtenido: productoBuscado?.get('codigobuscado')?.value,
        producto: productoBuscado?.get('nombrebuscado')?.value,
        nombrepobtenido: productoBuscado?.get('nombrebproducto')?.value,
        cantidad: productoBuscado?.get('cantidadbuscado')?.value,
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
  venta: any;

  registrarProducto() {
    //console.log(this.form.value.clienteDetalle);
    //console.log(this.form.value.listaCompra);
    //console.log(this.form.value.productoBuscado);

    const ventaData = {
      fecha: this.fechaFormateada,
      cliente: this.form.value.clienteDetalle['id'],
      proceso: 'PROFORMA',
      usuario: this.userid,
      sucursal: this.usersucursal,
    };

    if (this.form.valid) {
      //GUARDAMOS EN VENTA
      this.ventasService.postVentas(ventaData).subscribe({
        next: (response) => {
          this.venta = response;
          //console.log('Este es el Id de venta registrada:', this.venta);
          // GUARDAMOS EN VENTADETALLE
          this.form.value.listaCompra.forEach((producto: Producto) => {
            // Agregamos el ID de venta obtenido al objeto producto
            producto.venta = this.venta;

            // Ahora, realizamos la solicitud POST para guardar cada producto individualmente
            this.ventasDetalleService.postVentasDetalle(producto).subscribe({
              next: (response) => {
                console.log('Entrada registrada con éxito:', response);
              },
              error: (errorData) => {
                console.error(
                  'Error al enviar la solicitud POST de VENTADETALLE:',
                  errorData
                );
              },
              complete: () => {
                //this.router.navigate(['/farmacia/venta']);
              },
            });
          });
        },
        error: (errorData) => {
          console.error(
            'Error al enviar la solicitud POST de VENTA:',
            errorData
          );
        },
        complete: () => {
          this.router.navigate(['/farmacia/venta']);
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
}
