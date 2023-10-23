import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { CategoriaService } from 'src/app/shared/services/categoria/categoria.service';

import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-categorias-index',
  templateUrl: './categorias-index.component.html',
  styleUrls: ['./categorias-index.component.scss'],
})
export class CategoriasIndexComponent implements OnInit{
  public ruta = rutas;
  datosCAT: any[] = [];

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.categoriasAll();
  }

  categoriasAll() {
    this.categoriaService.getCategoriasAll().subscribe((datosCAT:any) => {
      this.datosCAT = datosCAT;
      //console.log(this.datosCAT)
    });
  }


  


}
