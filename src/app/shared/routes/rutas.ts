export class rutas {
  private static Url = '';

  public static get baseUrl(): string {
    return this.Url;
  }

  public static get dashboard(): string {
    return this.baseUrl + '/dashboard';
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

  public static get farmacia_venta(): string {
    return this.baseUrl + '/farmacia/venta';
  }

  public static get farmacia_cliente(): string {
    return this.baseUrl + '/farmacia/cliente';
  }

  public static get farmacia_cliente_nuevo(): string {
    return this.baseUrl + '/farmacia/cliente/nuevo';
  }
}
  
  