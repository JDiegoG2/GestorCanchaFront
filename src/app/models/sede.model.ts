export interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: boolean;
  departamento?: string; 
  provincia?: string; 
  distrito?: string; // Aquí 'distrito' representa el ubigeoId que debe ser enviado al backend
  ubigeo: {
    id: number;  // Este es el ID del Ubigeo seleccionado
  };
}