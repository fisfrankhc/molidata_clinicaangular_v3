import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Producto } from 'src/app/shared/interfaces/logistica';
import { CategoriaService } from 'src/app/shared/services/logistica/categoria/categoria.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';

@Component({
  selector: 'app-productos-index',
  templateUrl: './productos-index.component.html',
  styleUrls: ['./productos-index.component.scss'],
})
export class ProductosIndexComponent {
  public ruta = rutas;
  datosPRO: Producto[] = [];
  productoallError: string = '';

  public productoList: Array<Producto> = [];
  dataSource!: MatTableDataSource<Producto>;

  public showFilter = false;
  public searchDataValue = '';
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

  constructor(
    public productoService: ProductoService,
    public categoriaService: CategoriaService,
    public medidaService: MedidaService
  ) {}
  ngOnInit(): void {
    this.categoriasAll();
    this.medidasAll();
  }

  datosCAT: any;
  categoriasAll(): void {
    this.categoriaService.getCategoriasAll().subscribe({
      next: (datosCAT: any) => {
        this.datosCAT = datosCAT;
        this.productosAll();
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosMED: any;
  medidasAll(): void {
    this.medidaService.getMedidasAll().subscribe({
      next: (datosMED: any) => {
        this.datosMED = datosMED;
      },
      error: () => {},
      complete: () => {},
    });
  }

  private productosAll(): void {
    this.productoList = [];
    this.serialNumberArray = [];

    this.productoService.getProductosAll().subscribe({
      next: (datosPRO: any) => {
        this.datosPRO = datosPRO;
        this.totalData = this.datosPRO.length;

        // Mapea los nombres de los clientes a los datos de ventas
        this.datosPRO = this.datosPRO.map((producto: Producto) => {
          //PARA CATEGORIAS
          const categoria = this.datosCAT.find(
            (cat: any) => cat.cat_id === producto.cat_id
          );
          if (categoria) {
            producto.nombreCategoria = categoria.cat_nombre;
          }
          //PARA MEDIDAS
          const medidas = this.datosMED.find(
            (med: any) => med.med_id === producto.med_id
          );
          if (medidas) {
            producto.nombreMedida = medidas.med_nombre;
          }
          return producto;
        });

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosPRO.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
        this.productoallError = errorData;
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Producto>(this.productoList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosPRO.map((res: Producto, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.productoList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: any): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.productoList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosCOMPRA)
    const filteredData = this.datosPRO.filter((producto: Producto) => {
      return (
        (producto.prod_id &&
          producto.prod_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (producto.prod_codigo &&
          producto.prod_codigo.toLowerCase().includes(value.toLowerCase())) ||
        (producto.prod_nombre &&
          producto.prod_nombre
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (producto.prod_descripcion &&
          producto.prod_descripcion
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (producto.precio_venta &&
          producto.precio_venta
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (producto.nombreMedida &&
          producto.nombreMedida.toLowerCase().includes(value.toLowerCase())) ||
        (producto.nombreCategoria &&
          producto.nombreCategoria.toLowerCase().includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.comprasList
    this.productoList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosPRO.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Producto>(this.productoList);
  }

  public sortData(sort: Sort) {
    const data = this.productoList.slice();

    if (!sort.active || sort.direction === '') {
      this.productoList = data;
    } else {
      this.productoList = data.sort((a, b) => {
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
      this.productosAll();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.productosAll();
    }
    this.dataSource = new MatTableDataSource<Producto>(this.productoList); // Agregar esta línea
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
    this.productosAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.productosAll();
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
