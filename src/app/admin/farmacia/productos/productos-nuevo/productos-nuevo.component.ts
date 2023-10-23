import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
interface data {
  value: string;
}

@Component({
  selector: 'app-productos-nuevo',
  templateUrl: './productos-nuevo.component.html',
  styleUrls: ['./productos-nuevo.component.scss'],
})
export class ProductosNuevoComponent {
  public ruta = rutas;
  public selectedValue!: string;

  selectedList1: data[] = [
    { value: 'Select Department' },
    { value: 'Orthopedics' },
    { value: 'Radiology' },
    { value: 'Dentist' },
  ];

  selectedList2: data[] = [
    { value: 'Select City' },
    { value: 'Alaska' },
    { value: 'Los Angeles' },
  ];

  selectedList3: data[] = [
    { value: 'Select Country' },
    { value: 'Usa' },
    { value: 'Uk' },
    { value: 'Italy' },
  ];
  
  selectedList4: data[] = [
    { value: 'Select State' },
    { value: 'Alaska' },
    { value: 'California' },
  ];
}
