import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { StockService } from 'src/app/shared/services/logistica/stock/stock.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { pageSelection, Stock } from '../../../../shared/interfaces/logistica';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-minimo-index',
  templateUrl: './stock-minimo-index.component.html',
  styleUrls: ['./stock-minimo-index.component.scss'],
})
export class StockMinimoIndexComponent implements OnInit {
  public ruta = rutas;
  datosSTOCK: Stock[] = [];

  public stockList: Array<Stock> = [];
  dataSource!: MatTableDataSource<Stock>;

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

  constructor(
    public stockService: StockService,
    public sucursalService: SucursalService,
    private productoService: ProductoService,
    private medidaService: MedidaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productosAll();
    this.sucursalAll();
    this.medidasAll();
    //this.form.patchValue({ sucursalid: '1' }); // Establecer valor predeterminado de la sucursal a 1
    //this.verSucursal(); // Llamarfunción verSucursal para filtrar los datos/dfecto de la sucursal 1
  }

  usersucursal: any = localStorage.getItem('usersucursal');
  usersucusalnombre: any;
  resultadoMostrar: any;

  datosSUC: any;
  sucursalAll() {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;
        const sucursalINFO = this.datosSUC.find(
          (suc: any) => suc.suc_id === this.usersucursal
        );
        if (sucursalINFO) {
          this.resultadoMostrar = true;
          this.usersucusalnombre = sucursalINFO.suc_nombre;
        }
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }
  datosPRO: any;
  productosAll() {
    this.productoService.getProductosAll().subscribe({
      next: (datosPRO: any) => {
        this.datosPRO = datosPRO;
        this.stockAll();
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }
  datosMED: any;
  medidasAll() {
    this.medidaService.getMedidasAll().subscribe({
      next: (datosMED: any) => {
        this.datosMED = datosMED;
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  form = this.fb.group({
    sucursalid: ['', Validators.required],
  });

  private stockAll(): void {
    this.stockList = [];
    this.serialNumberArray = [];
    this.stockService.getStockAll().subscribe({
      next: (datosSTOCK: any) => {
        this.datosSTOCK = datosSTOCK;
        this.totalData = this.datosSTOCK.length;
        //console.log(this.datosSTOCK);
        //FILTRAMOS DE ACUERDO AL ROL QUE PERTENEZCA EL USUARIO
        this.datosSTOCK = this.datosSTOCK.filter(
          (sto: any) => sto.almacen_id === this.usersucursal
        );
        //console.log(this.datosSTOCK);

        // Mapear nombres
        this.datosSTOCK = this.datosSTOCK.map((stock: Stock) => {
          //PARA productos
          const producto = this.datosPRO.find(
            (pro: any) => pro.prod_id === stock.producto_id
          );
          if (producto) {
            stock.codigoProducto = producto.prod_codigo;
            stock.nombreProducto = producto.prod_nombre;
          }
          //PARA Medidas
          const medida = this.datosMED.find(
            (med: any) => med.med_id === stock.unidad_medida
          );
          if (medida) {
            stock.nombreMedida = medida.med_nombre;
          }
          return stock;
        });

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosSTOCK.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Stock>(this.stockList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosSTOCK.map((res: Stock, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.stockList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: string): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.stockList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosSTOCK)
    const filteredData = this.datosSTOCK.filter((stock: Stock) => {
      return (
        (stock.stock_id &&
          stock.stock_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (stock.codigoProducto &&
          stock.codigoProducto.toLowerCase().includes(value.toLowerCase())) ||
        (stock.nombreProducto &&
          stock.nombreProducto
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (stock.cantidad &&
          stock.cantidad
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (stock.stock_minimo &&
          stock.stock_minimo
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (stock.nombreMedida &&
          stock.nombreMedida.toLowerCase().includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.stockList
    this.stockList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosSTOCK.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Stock>(this.stockList);
  }

  public sortData(sort: Sort) {
    const data = this.stockList.slice();

    if (!sort.active || sort.direction === '') {
      this.stockList = data;
    } else {
      this.stockList = data.sort((a, b) => {
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
    this.stockAll();
    this.dataSource = new MatTableDataSource<Stock>(this.stockList); // Agregar esta línea
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
    this.stockAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.stockAll();
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

  verSucursal() {
    // Actualizar la tabla y recalcular las páginas
    this.dataSource = new MatTableDataSource<Stock>(this.stockList);
    //this.dataSource.data = this.stockList;
    this.calculateTotalPages(this.stockList.length, this.pageSize);

    /* const sucursalId = this.form.value.sucursalid;
    // Verificar si sucursalId tiene un valor antes de comparar
    if (sucursalId !== null && sucursalId !== undefined) {
      // Filtrar los datos según la sucursal seleccionada
      this.stockList = this.datosSTOCK.filter(
        (data) => data.almacen_id === sucursalId
      );
    } */
  }

  public actualizarStock(): void {
    this.stockAll();
  }

  form2 = this.fb.group({
    idstock: ['', Validators.required],
    productoNombre: ['', Validators.required],
    stock: ['', Validators.required],
    stockMinimo: ['', Validators.required],
    condicion: '',
  });

  selectedStockData: Stock | null = null;
  openEditModal(data: Stock) {
    this.selectedStockData = data;
    // Mostrar el modal
    const modalElement = document.getElementById('modal_stock');
    if (modalElement) {
      modalElement.classList.add('show');
    }

    this.form2.setValue({
      idstock: data.stock_id.toString(),
      productoNombre: data.nombreProducto,
      stock: data.cantidad.toString(),
      stockMinimo: data.stock_minimo.toString(),
      condicion: 'STOCK-MINIMO',
    });
  }

  updatedStock(): void {
    if (this.form2.valid) {
      const dataStockMin = {
        id: this.form2.value.idstock,
        productoNombre: this.form2.value.productoNombre,
        stockmin: this.form2.value.stockMinimo,
        condicion: this.form2.value.condicion,
      };

      //console.log(dataStockMin);
      this.stockService.updatedStock(dataStockMin).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (errorData) => {
          console.log(errorData);
        },
        complete: () => {
          this.stockAll();

          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            width: '450px',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            //title: 'Stock minimo guardado',
            html: `<div style="font-size: 15px; font-weight: 700">Stock mínimo de ${dataStockMin.productoNombre} guardado con &eacute;xito.</div>`,
          });
        },
      });
    }
  }
}
