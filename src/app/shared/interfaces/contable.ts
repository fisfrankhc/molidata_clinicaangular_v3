export interface pageSelection {
  skip: number;
  limit: number;
}

export interface ComprobanteNumeracion {
  numeracion_id: number;
  sede_id: number;
  comprobante_tipo: string;
  serie: string;
  numero: string;
  nombreSede: string; //PARA VISTA
  nombreComprobanteTipo: string; //PARA VISTA
}

export interface ComprobanteTipos {
  tipo_id: number;
  tipo_nombre: string;
  codigo_sunat: string;
}
