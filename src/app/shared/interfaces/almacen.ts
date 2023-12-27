export interface pageSelection {
  skip: number;
  limit: number;
}

export interface Movimientos {
  movimiento_id: number;
  movimiento_fecha: Date;
  movimiento_tipo: string;
  usuario_id: number;
  sucursal_id: number;
  movimiento_origen: string;
  codigo_origen: string;
  movimiento_observaciones: string;
  movimiento_estado: string;
  nombreUsuario: string;
}

export interface Requerimientos {
  requerimiento_id: number;
  requerimiento_fecha: Date;
  usuario_id: number;
  sucursal_id: number;
  requerimiento_proceso: string; // SOLICITUD, REVISADO, ATENDIDO
  requerimiento_observaciones: string;
  requerimiento_estado: string;
  nombreUsuario: string; //PARA VISTA
  nombreSucursal: string; //PARA VISTA
}

export interface Requerimiento_Detalle {
  detalle_id: number;
  requerimiento_id: number;
  producto_id: number;
  requerimiento_cantidad: number;
  unidad_medida: number;
  nombreProducto: string; //PARA VISTA
  codigoProducto: string; //PARA VISTA
  descripcionProducto: string; //PARA VISTA
  nombreMedida: string; //PARA VISTA
}
