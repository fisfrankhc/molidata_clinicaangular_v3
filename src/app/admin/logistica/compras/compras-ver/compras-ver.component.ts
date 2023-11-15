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
import { DatePipe } from '@angular/common';

import { CompraDetalle } from 'src/app/shared/interfaces/logistica';

interface data {
  value: string;
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
    private datePipe: DatePipe
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
          'Error al enviar la solicitud POST de VentaDetalleItems:',
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

  confirmarCompra() {
    const compraData = {
      id: this.compraId,
      proceso: 'CONFIRMADO',
    };
    //console.log(compraData);
    this.comprasService.updatedCompra(compraData).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (errorData) => {
        console.error('Error al enviar al actualizar COMPRA:', errorData);
      },
      complete: () => {
        this.router.navigate([`/logistica/compra/ver/${this.compraId}`]);
      },
    });
  }

  confirmar() {
    //console.log(this.form.value);
    const compraData2 = {
      id: this.compraId,
      comprobante: this.form.get('comprobanteDetalle')?.value.comprobante_tipo,
      seriecomprobante:
        this.form.get('comprobanteDetalle')?.value.comprobante_serie,
      numerocomprobante:
        this.form.get('comprobanteDetalle')?.value.comprobante_numero,
      destino: this.form.get('comprobanteDetalle')?.value.suc_destino,
    };
    //console.log(compraData2);
    this.comprasService.updatedCompra(compraData2).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (errorData) => {
        console.error('Error al enviar al actualizar COMPRA2:', errorData);
      },
      complete: () => {
        this.router.navigate([`/logistica/compra`]);
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
