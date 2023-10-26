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
