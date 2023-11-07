import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { VentasService } from 'src/app/shared/services/farmacia/ventas/ventas.service';
import { VentasItemService } from 'src/app/shared/services/farmacia/ventas/ventas-item.service';
import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';

import { VentasDetalle } from 'src/app/shared/interfaces/farmacia';

@Component({
  selector: 'app-ventas-ver',
  templateUrl: './ventas-ver.component.html',
  styleUrls: ['./ventas-ver.component.scss'],
})
export class VentasVerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public ventasService: VentasService,
    public ventasItemService: VentasItemService,
    public clientesService: ClientesService,
    public productoService: ProductoService
  ) {}
  ventaId: number | null = null;
  public ruta = rutas;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const ventaIdParam = params.get('venta_id');
      if (ventaIdParam !== null) {
        this.ventaId = +ventaIdParam;
      }
    });
    this.clientesAll();
    this.productosAll();
  }

  form = this.fb.group({
    clienteDetalle: this.fb.group({
      id: ['', Validators.required],
      documento: [''],
      nombrecliente: [''],
      email: [''],
    }),
    listaCompra: this.fb.array([]), // FormArray para la lista de compra
  });

  datosCLI: any;
  clientesAll(): void {
    this.clientesService.getClientesAll().subscribe({
      next: (datosCLI: any) => {
        this.datosCLI = datosCLI;
        this.ventaDetalle(this.ventaId);
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosPRO: any;
  productosAll() {
    this.productoService.getProductosAll().subscribe({
      next: (datosPRO: any) => {
        this.datosPRO = datosPRO;
        this.ventaDetalleItem(this.ventaId);
      },
      error: () => {},
      complete: () => {},
    });
  }

  datoVenta: any = {};
  ventaDetalle(ventaId: any) {
    //console.log(ventaId);
    this.ventasService.getVenta(ventaId).subscribe({
      next: (data) => {
        this.datoVenta = data;

        if (this.datosCLI && this.datosCLI.length > 0) {
          // Buscar el cliente correspondiente en datosCLI
          const cliente = this.datosCLI.find(
            (cli: any) => cli.cli_id === this.datoVenta[0]['cliente_id']
          );
          // Asignar el nombre del cliente al formulario si se encontró
          if (cliente) {
            this.form
              .get('clienteDetalle.nombrecliente')
              ?.setValue(cliente.cli_nombre);
            this.form
              .get('clienteDetalle.documento')
              ?.setValue(cliente.numero_documento);
          }
        }

        this.form
          .get('clienteDetalle.id')
          ?.setValue(this.datoVenta[0]['venta_id']);
        this.form
          .get('clienteDetalle.email')
          ?.setValue(this.datoVenta[0]['venta_proceso']);
      },
      error: (errorData) => {
        console.error('Error al obtener los datos de la venta: ', errorData);
      },
      complete: () => {
        //console.log('DATOS OBTENIDOS EXITOSAMENTE');
      },
    });
  }

  datosProductosDetalle: any;
  ventaDetalleItem(ventaId: any) {
    this.ventasItemService.getVentaItem(ventaId).subscribe({
      next: (response) => {
        this.datosProductosDetalle = response;

        // Mapea los nombres de los clientes a los datos de ventas
        this.datosProductosDetalle = this.datosProductosDetalle.map(
          (ventasDetalle: VentasDetalle) => {
            //PARA CATEGORIAS
            const producto = this.datosPRO.find(
              (pro: any) => pro.prod_id === ventasDetalle.prod_id
            );
            if (producto) {
              ventasDetalle.nombreProducto = producto.prod_nombre;
              ventasDetalle.codigoProducto = producto.prod_codigo;
            }
            return ventasDetalle;
          }
        );

        this.productoList = this.datosProductosDetalle;
      },
      error: (errorData) => {
        console.error(
          'Error al enviar la solicitud POST de VentaDetalleItems:',
          errorData
        );
      },
      complete: () => {},
    });
  }

  public calcularSubtotal(producto: any): number {
    const precio = producto.precio_venta;
    const cantidad = producto.cantidad_venta;
    const descuento = producto.descuento;

    return precio * cantidad - descuento;
  }

  productoList = [];
  public calcularSubtotalTotal(): number {
    let subtotalTotal = 0;
    this.productoList.forEach((producto) => {
      subtotalTotal += this.calcularSubtotal(producto);
    });
    return subtotalTotal;
  }



  actualizarVenta() {
    if (this.form.valid) {
      //console.log(this.form.value);
      const ventaData = {
        id: this.ventaId,
        proceso: 'CONFIRMADO'
      };
      this.ventasService.updatedVenta(ventaData).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (errorData) => {},
        complete: () => {
          this.router.navigate(['/farmacia/venta']);
        },
      });

    }
  }
}
