export interface DatosEmpresa {
  empresa_id: string;
  empresa_ruc: string;
  razon_social: string;
  nombre_comercial: string;
  empresa_direccion: string;
  direccion_distrito: string;
  direccion_provincia: string;
  direccion_departamento: string;
  empresa_ubigeo: string;
  empresa_logo: string | null;
  empresa_telefono: string | null;
  empresa_email: string | null;
  usuario_sol: string | null;
  clave_sol: string | null;
  clave_firma: string | null;
}
