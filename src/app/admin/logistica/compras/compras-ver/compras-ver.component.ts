import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { rutas } from 'src/app/shared/routes/rutas';
import { ProveedoresService } from 'src/app/shared/services/logistica/proveedor/proveedores.service';
import { ComprasService } from 'src/app/shared/services/logistica/compra/compras.service';
import { ComprasItemService } from 'src/app/shared/services/logistica/compra/compras-item.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { StockCentralService } from 'src/app/shared/services/logistica/stock-central/stock-central.service';
import { StockService } from 'src/app/shared/services/almacen/stock/stock.service';

import { DatePipe } from '@angular/common';

import { CompraDetalle } from 'src/app/shared/interfaces/logistica';
import * as Notiflix from 'notiflix';
import Swal from 'sweetalert2';

interface data {
  value: string;
}

interface Producto {
  cantidad: number;
  codigoProducto: string;
  compra_id: number;
  detalle_id: number;
  entrega: number;
  nombreMedida: string;
  nombreProducto: string;
  precio_compra: number;
  producto_id: number;
  unidad_medida: number;
}

@Component({
  selector: 'app-compras-ver',
  templateUrl: './compras-ver.component.html',
  styleUrls: ['./compras-ver.component.scss'],
})
export class ComprasVerComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService,
    private comprasService: ComprasService,
    private comprasItemService: ComprasItemService,
    private productoService: ProductoService,
    private medidaService: MedidaService,
    private generalService: GeneralService,
    private sucursalService: SucursalService,
    private stockCentralService: StockCentralService,
    private datePipe: DatePipe,
    private stockService: StockService
  ) {}

  compraId: number | null = null;
  public ruta = rutas;
  datoPRODUCTO: any[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const compraIdParam = params.get('compra_id');
      if (compraIdParam !== null) {
        this.compraId = +compraIdParam;
      }
    });
    this.productosAll();

    const initialForm = this.fb.group({
      proveedorDetalle: this.fb.group({
        proveedorid: ['', Validators.required],
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
      listaCompra: this.fb.array([]), // FormArray para la lista de compra
      comprobanteDetalle: this.fb.group({
        comprobante_tipo: ['', Validators.required],
        comprobante_serie: ['', Validators.required],
        comprobante_numero: ['', Validators.required],
        suc_destino: ['', Validators.required],
      }),
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
    this.proveedoresAll();
    this.empresaAll();
    this.sucursalAll();
  }

  datosPRO: any;
  productosAll() {
    this.productoService.getProductosAll().subscribe({
      next: (datosPRO: any) => {
        this.datosPRO = datosPRO;
        this.compraDetalleItems(this.compraId);
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

  datoPROVEEDOR: any[] = [];
  proveedoresAll(): void {
    this.proveedoresService.getProveedoresAll().subscribe({
      next: (datoPROVEEDOR: any) => {
        this.datoPROVEEDOR = datoPROVEEDOR;
        this.compraDetalle(this.compraId);
      },
      error: () => {},
      complete: () => {},
    });
  }

  datoSUC: any[] = [];
  sucursalAll(): void {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datoSUC: any) => {
        this.datoSUC = datoSUC;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datoCOMPRA: any = {};
  compraDetalle(compraId: any) {
    //console.log(compraId);
    this.comprasService.getCompra(compraId).subscribe({
      next: (data) => {
        this.datoCOMPRA = data;

        if (this.datoSUC && this.datoPROVEEDOR.length > 0) {
          const proveedor = this.datoPROVEEDOR.find(
            (prov: any) =>
              prov.proveedor_id === this.datoCOMPRA[0]['proveedor_id']
          );
          if (proveedor) {
            this.form
              .get('proveedorDetalle.razon_social')
              ?.setValue(proveedor.razon_social);
            this.form
              .get('proveedorDetalle.documento_numero')
              ?.setValue(proveedor.documento_numero);
            this.form
              .get('proveedorDetalle.proveedor_descripcion')
              ?.setValue(proveedor.proveedor_descripcion);
          }
        }
        this.form
          .get('proveedorDetalle.proveedorid')
          ?.setValue(this.datoCOMPRA[0]['proveedor_id']);
        this.form
          .get('compraDetalle.compra_moneda')
          ?.setValue(this.datoCOMPRA[0]['compra_moneda']);
        this.form
          .get('compraDetalle.tipo_pago')
          ?.setValue(this.datoCOMPRA[0]['tipo_pago']);
        this.form
          .get('compraDetalle.tipo_pago')
          ?.setValue(this.datoCOMPRA[0]['tipo_pago']);
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
  compraDetalleItems(compraId: any) {
    this.comprasItemService.getCompraItems(compraId).subscribe({
      next: (response) => {
        this.datosProductosDetalle = response;

        // Mapea los nombres de los clientes a los datos de ventas
        this.datosProductosDetalle = this.datosProductosDetalle.map(
          (compraDetalle: CompraDetalle) => {
            //PARA CATEGORIAS
            const producto = this.datosPRO.find(
              (pro: any) => pro.prod_id === compraDetalle.producto_id
            );
            if (producto) {
              compraDetalle.nombreProducto = producto.prod_nombre;
              compraDetalle.codigoProducto = producto.prod_codigo;
            }
            if (compraDetalle.unidad_medida == 0) {
              compraDetalle.nombreMedida = '';
            } else {
              //PARA MEDIDAS
              const medida = this.datosMED.find(
                (med: any) => med.med_id === compraDetalle.unidad_medida
              );
              if (medida) {
                compraDetalle.nombreMedida = medida.med_nombre;
              }
            }
            return compraDetalle;
          }
        );
        this.productoList = this.datosProductosDetalle;
      },
      error: (errorData) => {
        console.error(
          'Error al enviar la solicitud GET de ComprasItems:',
          errorData
        );
      },
      complete: () => {},
    });
  }

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

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );
  comprobanteTipo: data[] = [{ value: 'BOLETA' }, { value: 'FACTURA' }];

  dataFindStockCentral: any;
  dataFindStock: any;
  confirmarCompra() {
    const compraData = {
      id: this.compraId,
      proceso: 'CONFIRMADO',
    };
    //console.log(compraData);
    Notiflix.Loading.pulse('Confirmando compra...');
    this.comprasService.updatedCompra(compraData).subscribe({
      next: (response) => {
        console.log(response);

        //PROCEDEMOS A ACTUALIZAR O GUARDAR LOS PRODUCTOS EN EL STOCK CENTRAL
        const productosAgrupados: { [id: string]: Producto } = {};
        this.datosProductosDetalle.forEach((producto: Producto) => {
          const idProducto = producto.producto_id;
          if (productosAgrupados[idProducto]) {
            // Si ya existe el producto en la lista agrupada, se suma la cantidad
            productosAgrupados[idProducto].cantidad += producto.cantidad; // No se realiza ninguna conversión
          } else {
            // Si no existe, se agrega el producto a la lista agrupada
            productosAgrupados[idProducto] = { ...producto };
          }
        });

        Object.values(productosAgrupados).forEach((producto: Producto) => {
          const dataStockPost = {
            almacen: 1,
            producto: producto.producto_id,
            cantidad: producto.cantidad,
            medida: producto.unidad_medida,
          };

          this.stockService.getStockAll().subscribe({
            next: (responseFind: any) => {
              //SI ES UN TABLA VACIA, REGISTRAMOS EL PRIMER DATO DE LA TABLA
              if (responseFind == 'no hay resultados') {
                this.stockService.postStock(dataStockPost).subscribe({
                  next: (responsePostStock) => {
                    console.log(
                      'Entrada registrada con éxito:',
                      responsePostStock
                    );
                  },
                  error: (errorData) => {
                    Notiflix.Loading.remove();
                    console.error(
                      'Error al enviar la solicitud POST PRIMERA de STOCK A ALMACEN 1:',
                      errorData
                    );
                  },
                  complete: () => {},
                });
              }
              //SI NO ES UNA TABLA VACIA, YA QUE BUSQUE
              else {
                this.dataFindStock = responseFind;
                //buscamos algun producto que se encuentre en la tabla
                const StockEncontrado = this.dataFindStock.find(
                  (stoc: any) =>
                    stoc.producto_id === producto.producto_id &&
                    stoc.almacen_id === '1'
                );
                //SI ENCONTRAMOS HACEMOS EL PUT
                if (StockEncontrado) {
                  const nuevostock =
                    StockEncontrado.cantidad + producto.cantidad;
                  const dataStockUpdate = {
                    producto: producto.producto_id,
                    cantidad: nuevostock,
                    condicion: 'COMPRA-CONFIRMAR',
                  };

                  this.stockService.updatedStock(dataStockUpdate).subscribe({
                    next: (responseUpdateStock) => {
                      console.log(
                        'Entrada actualizada de stock con éxito:',
                        responseUpdateStock
                      );
                    },
                    error: (errorData) => {
                      Notiflix.Loading.remove();
                      console.error(
                        'Error al enviar la solicitud PUT de STOCK:',
                        errorData
                      );
                    },
                    complete: () => {},
                  });
                }
                //SI NO SE ENCUENTRA LA DATA QUE COINCIDA
                else {
                  this.stockService.postStock(dataStockPost).subscribe({
                    next: (responsePostStock) => {
                      console.log(
                        'Entrada registrada con éxito:',
                        responsePostStock
                      );
                    },
                    error: (errorData) => {
                      Notiflix.Loading.remove();
                      console.error(
                        'Error al enviar la solicitud POST de SOTCKCENTRAL:',
                        errorData
                      );
                    },
                    complete: () => {},
                  });
                }
              }
            },
            error: (errorData) => {
              Notiflix.Loading.remove();
              console.error(
                'Error al enviar al consultar datos de STOCK',
                errorData
              );
            },
            complete: () => {},
          });
        });
      },
      error: (errorData) => {
        Notiflix.Loading.remove();
        console.error('Error al enviar al actualizar COMPRA:', errorData);
      },
      complete: () => {
        //this.router.navigate([`/logistica/compra/ver/${this.compraId}`]);
        this.router.navigate([rutas.logistica_compra_ver + this.compraId]);
        this.compraDetalle(this.compraId);

        Notiflix.Loading.remove();
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          html: `<div style="font-size: 15px; font-weight: 700">Compra ${this.compraId} confirmada con &eacute;xito.</div>`,
        });
      },
    });
  }

  dataFindStock2: any;
  confirmar() {
    Notiflix.Loading.pulse('Confirmando compra...');
    //console.log(this.form.value);
    const compraData2 = {
      id: this.compraId,
      comprobante: this.form.get('comprobanteDetalle')?.value.comprobante_tipo,
      seriecomprobante:
        this.form.get('comprobanteDetalle')?.value.comprobante_serie,
      numerocomprobante:
        this.form.get('comprobanteDetalle')?.value.comprobante_numero,
      proceso: 'CONFIRMADO',
      destino: this.form.get('comprobanteDetalle')?.value.suc_destino,
    };
    console.log(compraData2);
    this.comprasService.updatedCompra(compraData2).subscribe({
      next: (response) => {
        console.log(response);

        //INICIO PARA ACTUALIZAR STOCK
        this.stockService.getStockAll().subscribe({
          next: (responseFind2: any) => {
            if (responseFind2 != 'no hay resultados') {
              this.dataFindStock2 = responseFind2;

              const productosAgrupados: { [id: string]: Producto } = {};
              this.datosProductosDetalle.forEach((producto: Producto) => {
                const idProducto = producto.producto_id;
                if (productosAgrupados[idProducto]) {
                  // Si ya existe el producto en la lista agrupada, se suma la cantidad
                  productosAgrupados[idProducto].cantidad += producto.cantidad;
                } else {
                  // Si no existe, se agrega el producto a la lista agrupada
                  productosAgrupados[idProducto] = { ...producto };
                }
              });

              Object.values(productosAgrupados).forEach(
                (producto: Producto) => {
                  const StockEncontrado2 = this.dataFindStock2.find(
                    (stoc: any) =>
                      stoc.producto_id === producto.producto_id &&
                      stoc.almacen_id === '1'
                  );
                  if (StockEncontrado2) {
                    const nuevostock =
                      StockEncontrado2.cantidad - producto.cantidad;

                    const dataCalculadaStock = {
                      producto: StockEncontrado2.producto_id,
                      cantidad: nuevostock,
                      condicion: 'COMPRA-CONFIRMAR',
                    };
                    console.log(dataCalculadaStock);

                    this.stockService
                      .updatedStock(dataCalculadaStock)
                      .subscribe({
                        next: (responseDataCalculada) => {
                          console.log(
                            'Entrada actualizada con éxito en stock:',
                            responseDataCalculada
                          );
                        },
                        error: (errorData) => {
                          Notiflix.Loading.remove();
                          console.log(
                            'Error al actualizar dato calculado en stock:',
                            errorData
                          );
                        },
                        complete: () => {},
                      });
                  }
                }
              );
            }
          },
          error: (errorData) => {
            Notiflix.Loading.remove();
            console.log(
              'Error al consultar datos generales de stock central:',
              errorData
            );
          },
          complete: () => {},
        });
        //FIN
      },
      error: (errorData) => {
        Notiflix.Loading.remove();
        console.error(
          'Error al enviar al actualizar datos de entrega',
          errorData
        );
      },
      complete: () => {
        this.router.navigate([rutas.logistica_compra]);

        Notiflix.Loading.remove();
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          html: `<div style="font-size: 15px; font-weight: 700">Datos de la compra ${this.compraId} añadidas con &eacute;xito.</div>`,
        });
      },
    });
  }

  public calcularSubtotal(producto: any): number {
    const precio = producto.precio_compra;
    const cantidad = producto.cantidad;

    return precio * cantidad;
  }

  productoList = [];
  public calcularSubtotalTotal(): number {
    let subtotalTotal = 0;
    this.productoList.forEach((producto) => {
      subtotalTotal += this.calcularSubtotal(producto);
    });
    return subtotalTotal;
  }
}
