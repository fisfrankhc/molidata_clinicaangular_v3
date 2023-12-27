export interface pageSelection {
  skip: number;
  limit: number;
}

export interface Ventas {
  venta_id: number;
  venta_fecha: string;
  cliente_id: number;
  venta_proceso?: string | null;
  usuario_id?: number;
  sucursal_id?: number;
  venta_estado: string;
  nombreCliente?: string; //AGREGADO PARA IMPRMIR EN OTRAS VISTAS
  nombreSucursal: string; //AGREGADO PARA IMPRMIR EN OTRAS VISTAS
  nombreUsuarioVenta: string; //AGREGADO PARA IMPRMIR EN OTRAS VISTAS
  tipoPago: string; //AGREGADO PARA IMPRMIR EN OTRAS VISTAS
  montototal: number;
}

export interface VentasDetalle {
  cantidadStockSucursal: string;
  det_id: number;
  venta_id: number;
  prod_id: number;
  cantidad_venta: number;
  precio_venta: number;
  descuento: number;
  medidaid: number;
  nombreProducto: string; //AGREGADO PARA IMPRMIR EN OTRAS VISTAS
  codigoProducto: string; //AGREGADO PARA IMPRMIR EN OTRAS VISTAS
  medidaProducto: string; //AGREGADO PARA IMPRIMIR EN OTRAS VISTAS
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

export interface Operacion {
  ope_id: number;
  user_id: number;
  fecha_pago: Date;
  ope_tipo: string;
  monto_pago: number;
  motivo_pago: string;
  motivo_codigo: number;
  descripcion_pago: string | null;
  medio_pago: string;
  medio_detalle: string | null;
  ope_estado: number
}
