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
  nombreUsuario: string; //PARA VISTA
  nombreSucursal: string; //PARA VISTA
}

export interface Movimientos_Detalle {
  detalle_id: number;
  movimiento_id: number;
  producto_id: number;
  cantidad: number;
  unidad_medida: number;
  fecha_vencimiento: Date;
  lote: number;
  peso: string;
  nombreProducto: string; //PARA VISTA
  codigoProducto: string; //PARA VISTA
  descripcionProducto: string; //PARA VISTA
  nombreMedida: string; //PARA VISTA
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

export interface MovimientosCentral {
  movimiento_id: number;
  movimiento_fecha: Date;
  sucursal_id: number;
  usuario_id: number;
  movimiento_observaciones: string;
  movimiento_estado: string;
  nombreUsuario: string; //PARA VISTA
  nombreSucursal: string; //PARA VISTA
}

export interface MovimientosCentralDetalle {
  movimiento_id: number;
  producto_codigo: string;
  producto_id: number;
  cantidad: number;
  unidad_medida: string;
  observaciones: string;
  nombreProducto: string; //PARA VISTA
  nombreMedida: string; //PARA VISTA
}
