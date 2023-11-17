export interface pageSelection {
  skip: number;
  limit: number;
}

export interface Movimientos{
    movimiento_id: number;
    movimiento_fecha: Date;
    movimiento_tipo: string;
    usuario_id: number;
    sucursal_id: number;
    movimiento_origen: string;
    codigo_origen: string;
    movimiento_observaciones: string;
    movimiento_estado: string;
}