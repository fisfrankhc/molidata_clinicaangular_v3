export class rutas {
  private static Url = '/ventas';

  public static get baseUrl(): string {
    return this.Url;
  }

  public static get dashboard(): string {
    return this.baseUrl + '/dashboard';
  }

  public static get rol(): string {
    return this.baseUrl + '/roles';
  }
  public static get rol_nuevo(): string {
    return this.baseUrl + '/roles/nuevo';
  }

  public static get sucursal(): string {
    return this.baseUrl + '/sucursal';
  }
  public static get sucursal_nuevo(): string {
    return this.baseUrl + '/sucursal/nuevo';
  }

  public static get logistica_categoria(): string {
    return this.baseUrl + '/logistica/categoria';
  }
  public static get logistica_categoria_nuevo(): string {
    return this.baseUrl + '/logistica/categoria/nuevo';
  }
  public static get logistica_categoria_editar(): string {
    return this.baseUrl + '/logistica/categoria/editar';
  }

  public static get logistica_compra(): string {
    return this.baseUrl + '/logistica/compra';
  }
  public static get logistica_compra_nuevo(): string {
    return this.baseUrl + '/logistica/compra/nuevo';
  }
  public static get logistica_compra_ver(): string {
    return this.baseUrl + '/logistica/compra/ver/';
  }

  public static get logistica_producto(): string {
    return this.baseUrl + '/logistica/producto';
  }
  public static get logistica_producto_nuevo(): string {
    return this.baseUrl + '/logistica/producto/nuevo';
  }
  public static get logistica_producto_editar(): string {
    return this.baseUrl + '/logistica/producto/editar';
  }

  public static get logistica_proveedor(): string {
    return this.baseUrl + '/logistica/proveedores';
  }
  public static get logistica_proveedor_nuevo(): string {
    return this.baseUrl + '/logistica/proveedores/nuevo';
  }

  public static get logistica_requerimientos(): string {
    return this.baseUrl + '/logistica/requerimientos';
  }

  public static get logistica_stock(): string {
    return this.baseUrl + '/logistica/stock';
  }

  public static get despacho_venta(): string {
    return this.baseUrl + '/despacho/venta';
  }
  public static get despacho_venta_nuevo(): string {
    return this.baseUrl + '/despacho/venta/nuevo';
  }

  public static get despacho_cliente(): string {
    return this.baseUrl + '/despacho/cliente';
  }
  public static get despacho_cliente_nuevo(): string {
    return this.baseUrl + '/despacho/cliente/nuevo';
  }

  public static get despacho_caja(): string {
    return this.baseUrl + '/despacho/caja';
  }
  public static get despacho_caja_ventapagada(): string {
    return this.baseUrl + '/despacho/caja/venta-pagada/';
  }

  public static get despacho_iniciocierre_operaciones(): string {
    return this.baseUrl + '/despacho/inicio-cierre-operaciones';
  }

  public static get despacho_reportecaja(): string {
    return this.baseUrl + '/despacho/reportecaja';
  }

  public static get almacen_generarrequerimiento(): string {
    return this.baseUrl + '/almacen/generar-requerimiento';
  }
  public static get almacen_generarrequerimiento_nuevo(): string {
    return this.baseUrl + '/almacen/generar-requerimiento/nuevo';
  }

  public static get almacen_stock_sucursal(): string {
    return this.baseUrl + '/almacen/stock-sucursal';
  }

  public static get almacen_stockminimo(): string {
    return this.baseUrl + '/almacen/stock-minimo';
  }

  public static get almacen_movimientosalmacen(): string {
    return this.baseUrl + '/almacen/movimientos-almacen';
  }
  public static get almacen_movimientosalmacen_nuevo(): string {
    return this.baseUrl + '/almacen/movimientos-almacen/nuevo';
  }

  public static get contable_comprobante(): string {
    return this.baseUrl + '/contable/comprobantes';
  }

  public static get contable_reporteventassucursal(): string {
    return this.baseUrl + '/contable/reporte-ventas-por-sucursal';
  }
  public static get contable_reporteventassucursal_confirmadas(): string {
    return (
      this.baseUrl + '/contable/reporte-ventas-por-sucursal/ventas-confirmadas'
    );
  }
  public static get contable_reporteventassucursal_pagadas(): string {
    return (
      this.baseUrl + '/contable/reporte-ventas-por-sucursal/ventas-pagadas'
    );
  }

  public static get contable_asignacionserie(): string {
    return this.baseUrl + '/contable/asignacion-series';
  }
  public static get contable_asignacionserie_nuevo(): string {
    return this.baseUrl + '/contable/asignacion-series/nuevo';
  }

  public static get contable_reporteventasusuario(): string {
    return this.baseUrl + '/contable/reporte-ventas-por-suusuario';
  }

  public static get administracion_configurarcodigo(): string {
    return this.baseUrl + '/administracion/configurar-codigo-sucursal';
  }
}
