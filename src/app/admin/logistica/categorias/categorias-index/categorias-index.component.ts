import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { CategoriaService } from 'src/app/shared/services/logistica/categoria/categoria.service';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Categoria } from 'src/app/shared/interfaces/logistica';

@Component({
  selector: 'app-categorias-index',
  templateUrl: './categorias-index.component.html',
  styleUrls: ['./categorias-index.component.scss'],
})
export class CategoriasIndexComponent implements OnInit {
  public ruta = rutas;
  datosCAT: Categoria[] = [];
  categoriaallError: string = '';

  public categoriaList: Array<Categoria> = [];
  dataSource!: MatTableDataSource<Categoria>;

  public showFilter = false;
  public searchDataValue: string = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;

  constructor(public categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.categoriasAll();
  }

  private categoriasAll(): void {
    this.categoriaList = [];
    this.serialNumberArray = [];
    this.categoriaService.getCategoriasAll().subscribe({
      next: (datosCAT: any) => {
        this.datosCAT = datosCAT;
        this.totalData = this.datosCAT.length;

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosCAT.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
        this.categoriaallError = errorData;
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Categoria>(this.categoriaList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosCAT.map((res: Categoria, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.categoriaList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: string): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.categoriaList = this.dataSource.filteredData;
    this.searchDataValue = value;
    const filteredData = this.datosCAT.filter((categoria: Categoria) => {
      return (
        (categoria.cat_id &&
          categoria.cat_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (categoria.cat_nombre &&
          categoria.cat_nombre.toLowerCase().includes(value.toLowerCase())) ||
        (categoria.cat_descripcion &&
          categoria.cat_descripcion
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        ((categoria.cat_estado === '1' ? 'activo' : 'inactivo') &&
          (categoria.cat_estado === '1' ? 'activo' : 'inactivo')
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.comprasList
    this.categoriaList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosCAT.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Categoria>(this.categoriaList);
  }

  public sortData(sort: Sort) {
    const data = this.categoriaList.slice();

    if (!sort.active || sort.direction === '') {
      this.categoriaList = data;
    } else {
      this.categoriaList = data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
    }
    this.categoriasAll();
    this.dataSource = new MatTableDataSource<Categoria>(this.categoriaList); // Agregar esta línea
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.categoriasAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.categoriasAll();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
}
