export class rutasadministracion {
  private static Url = '/administracion';

  public static get baseUrl(): string {
    return this.Url;
  }

  public static get dashboard(): string {
    return this.baseUrl + '/dashboard';
  }

  public static get administracion_usuarios(): string {
    return this.baseUrl + '/dashboard/usuarios';
  }
  public static get administracion_usuarios_nuevo(): string {
    return this.baseUrl + '/dashboard/usuarios/nuevo';
  }
}
