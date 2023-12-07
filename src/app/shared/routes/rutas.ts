export class rutas {
  private static Url = '';

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

  public static get farmacia_venta(): string {
    return this.baseUrl + '/farmacia/venta';
  }
  public static get farmacia_venta_nuevo(): string {
    return this.baseUrl + '/farmacia/venta/nuevo';
  }

  public static get farmacia_cliente(): string {
    return this.baseUrl + '/farmacia/cliente';
  }
  public static get farmacia_cliente_nuevo(): string {
    return this.baseUrl + '/farmacia/cliente/nuevo';
  }

  public static get farmacia_caja(): string {
    return this.baseUrl + '/farmacia/caja';
  }

  public static get farmacia_iniciocierre_operaciones(): string {
    return this.baseUrl + '/farmacia/inicio-cierre-operaciones';
  }

  public static get farmacia_reportecaja(): string {
    return this.baseUrl + '/farmacia/reportecaja';
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

  public static get contable_reporteventasusuario(): string {
    return this.baseUrl + '/contable/reporte-ventas-por-suusuario';
  }
}
  
  