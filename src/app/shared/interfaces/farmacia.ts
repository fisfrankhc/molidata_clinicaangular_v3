export interface pageSelection {
  skip: number;
  limit: number;
}

export interface Ventas {
  venta_id?: number | null;
  venta_fecha: string;
  cliente_id: number;
  venta_proceso?: string | null;
  usuario_id?: number;
  sucursal_id?: number;
  venta_estado: string;
}

export interface Clientes {
  cli_id?: number | null;
  tipo_documento: string;
  numero_documento: number;
  cli_nombre: string;
  cli_direccion?: string;
  cli_email?: string;
  cli_telefono?: string;
  cli_estado: string;
}
