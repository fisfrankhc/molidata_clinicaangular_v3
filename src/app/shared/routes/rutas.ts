export class rutas {
  private static Url = '';

  public static get baseUrl(): string {
    return this.Url;
  }

  public static get dashboard(): string {
    return this.baseUrl + '/dashboard';
  }

  public static get farmacia_categoria(): string {
    return this.baseUrl + '/farmacia/categoria';
  }

  public static get farmacia_categoria_nuevo(): string {
    return this.baseUrl + '/farmacia/categoria/nuevo';
  }

  public static get farmacia_producto(): string {
    return this.baseUrl + '/farmacia/producto';
  }
}
  
  