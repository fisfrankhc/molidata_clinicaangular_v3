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

  public static get logistica_producto(): string {
    return this.baseUrl + '/logistica/producto';
  }
  public static get logistica_producto_nuevo(): string {
    return this.baseUrl + '/logistica/producto/nuevo';
  }
  public static get logistica_producto_editar(): string {
    return this.baseUrl + '/logistica/producto/editar';
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

  public static get farmacia_reportecaja(): string {
    return this.baseUrl + '/farmacia/reportecaja';
  }
}
  
  