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

@Component({
  selector: 'app-ventas-nuevo',
  templateUrl: './ventas-nuevo.component.html',
  styleUrls: ['./ventas-nuevo.component.scss'],
})
export class VentasNuevoComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private productoService: ProductoService
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
        idbuscado: ['', Validators.required],
        codigobuscado: ['', Validators.required],
        nombrebuscado: ['', Validators.required],
        nombrebproducto: ['', Validators.required],
        preciobuscado: ['', Validators.required],
        medidabuscado: ['', Validators.required],
        cantidadbuscado: ['', Validators.required],
      }),
      listaCompra: this.fb.array([]), // FormArray para la lista de compra
    });

    // Asignar el formulario
    this.form = initialForm;

    this.productoService.getProductosAll().subscribe({
      next: (data: any) => {
        this.datoPRODUCTO = data;

        console.log(this.datoPRODUCTO);
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
        nombreobtenido: [''],
        nombrepobtenido: [''],
        cantidadobtenido: [''],
        precioobtenido: [''],
        subtotalagregado: [''],
      });

      // Copia los valores del producto buscado al nuevo producto
      nuevoProducto.patchValue({
        idobtenido: productoBuscado?.get('idbuscado')?.value,
        codigoobtenido: productoBuscado?.get('codigobuscado')?.value,
        nombreobtenido: productoBuscado?.get('nombrebuscado')?.value,
        nombrepobtenido: productoBuscado?.get('nombrebproducto')?.value,
        cantidadobtenido: productoBuscado?.get('cantidadbuscado')?.value,
        precioobtenido: productoBuscado?.get('preciobuscado')?.value,
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
      alert("Se necesita un producto");
    }
    
  }

  eliminarProducto(index: number) {
    const listaCompra = this.form.get('listaCompra') as FormArray;
    listaCompra.removeAt(index);

    this.calcularSubtotal();
  }

  registrarProducto() {
    console.log(this.form.value.clienteDetalle);
    console.log(this.form.value.listaCompra);
    console.log(this.form.value.productoBuscado);
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
