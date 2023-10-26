import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { VentasService } from 'src/app/shared/services/farmacia/ventas/ventas.service';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Ventas } from 'src/app/shared/interfaces/farmacia';

@Component({
  selector: 'app-ventas-index',
  templateUrl: './ventas-index.component.html',
  styleUrls: ['./ventas-index.component.scss'],
})
export class VentasIndexComponent implements OnInit {
  public ruta = rutas;
  datosVENTA: Ventas[] = [];
  categoriaallError: string = '';

  constructor(public ventasService: VentasService) {}

  ngOnInit(): void {
    this.ventasAll();
  }

  private ventasAll(): void {
    this.ventasService.getVentasAll().subscribe({
      next: (datosVENTA: any) => {
        console.log(datosVENTA);
      },
      error: (errorData) => {
        console.error(errorData);
        this.categoriaallError = errorData;
      },
      complete: () => {
        console.log("DATOS RECIBIDOS");
      }
    });
  }
}
