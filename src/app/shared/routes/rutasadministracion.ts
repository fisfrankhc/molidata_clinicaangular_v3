export class rutasadministracion {
  private static Url = '/administracion';

  public static get baseUrl(): string {
    return this.Url;
  }

  public static get dashboard(): string {
    return this.baseUrl + '/dashboard';
  }

  public static get administracion_usuarios(): string {
    return this.baseUrl + '/administracion/usuarios';
  }
  public static get administracion_usuarios_nuevo(): string {
    return this.baseUrl + '/administracion/usuarios/nuevo';
  }

  public static get administracion_roles(): string {
    return this.baseUrl + '/administracion/roles';
  }
  public static get administracion_roles_nuevo(): string {
    return this.baseUrl + '/administracion/roles/nuevo';
  }

  public static get administracion_sucursales(): string {
    return this.baseUrl + '/administracion/sucursales';
  }
  public static get administracion_sucursales_nuevo(): string {
    return this.baseUrl + '/administracion/sucursales/nuevo';
  }
}
