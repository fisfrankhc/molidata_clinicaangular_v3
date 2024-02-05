export class rutasclinica {
  private static Url = '/clinica';

  public static get baseUrl(): string {
    return this.Url;
  }

  public static get dashboard(): string {
    return this.baseUrl + '/dashboard';
  }

  public static get cita_cliente(): string {
    return this.baseUrl + '/cita/clientes';
  }
  public static get cita_cliente_nuevo(): string {
    return this.baseUrl + '/cita/clientes/nuevo';
  }

  public static get cita_paciente(): string {
    return this.baseUrl + '/cita/pacientes';
  }
  public static get cita_paciente_nuevo(): string {
    return this.baseUrl + '/cita/pacientes/nuevo';
  }
}
