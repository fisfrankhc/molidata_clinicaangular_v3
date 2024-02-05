export interface pageSelection {
  skip: number;
  limit: number;
}

export interface Pacientes {
  paciente_id: number;
  apellido_paterno: string;
  apellido_materno: string;
  nombres: string;
  fecha_nacimiento: string;
  lugar_nacimiento: string;
  paciente_sexo: string;
  paciente_direccion: string;
  paciente_telefono: string;
  paciente_tipo: string;
  numero_poliza: string;
  eps_seguro: string;
  familiar_declarado: string;
  paciente_estado: string;
  fullname: string; //PARA VISTA
}
