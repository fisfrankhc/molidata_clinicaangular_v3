if (this.form.valid) {
  this.form.value.listaMovimiento.forEach((producto: Producto) => {
    producto.movimiento = this.movimiento;

    const idobtenido = producto.idobtenido;
    const cantidad = +producto.cantidad;
    cantidadesPorId[idobtenido] = (cantidadesPorId[idobtenido] || 0) + cantidad;
  });

    Object.keys(cantidadesPorId).forEach((id) => {
        //console.log(`Suma de cantidades de idobtenido ${id}: ${cantidadesPorId[id]}`);
        this.stockService.getStockAll().subscribe({
            next: (datosSTOCK: any) => {
                this.datosSTOCK = datosSTOCK;

                const sucursalFind = this.datosSTOCK.find(
                    (stock: any) =>
                        stock.almacen_id === this.usersucursal && stock.producto_id === id
                );
                //console.log(sucursalFind);

                if (sucursalFind) {
                    if (movimientoData.tipo === "INGRESO") {
                        sucursalFind.cantidad =
                            Number(sucursalFind.cantidad) + Number(cantidadesPorId[id]);
                        console.log(sucursalFind);
                        const stockActualizar = {};
                    } else if (movimientoData.tipo === "SALIDA") {
                        sucursalFind.cantidad =
                            Number(sucursalFind.cantidad) - Number(cantidadesPorId[id]);
                        console.log(sucursalFind);
                    }
                }
            },
            error: () => { },
            complete: () => { },
        });
    });
}



  ConfirmarMovimiento() {
    const movimientoData = {
      fecha: this.fechaFormateada,
      tipo: this.form.value.movimientoDetalle['tipo_origen'],
      usuario: this.userid,
      sucursal: this.usersucursal,
      origen: this.form.value.movimientoDetalle['movimiento_origen'],
      origencodigo: this.form.value.movimientoDetalle['codigo_origen'],
      observaciones: '',
    };
    //this.movimiento = 1;
    //const cantidadesPorId: { [id: string]: number } = {};
    const cantidadesPorId: {
      [id: string]: {
        almacen: number;
        producto: number;
        cantidad: number;
        medida: string;
      };
    } = {};

    if (this.form.valid) {
      this.form.value.listaMovimiento.forEach((producto: Producto) => {
        producto.movimiento = this.movimiento;

        const idobtenido = producto.idobtenido;
        const cantidad = +producto.cantidad;
        //cantidadesPorId[idobtenido] = (cantidadesPorId[idobtenido] || 0) + cantidad;
        cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
          almacen: this.usersucursal,
          producto: producto.producto,
          cantidad: 0,
          medida: producto.medida,
        };
        cantidadesPorId[idobtenido].cantidad += cantidad;

      });

      Object.keys(cantidadesPorId).forEach((id) => {
        //console.log(`Suma de cantidades de idobtenido ${id}: ${cantidadesPorId[id]}`);
        console.log(cantidadesPorId[id].producto);
        console.log(cantidadesPorId[id]);
        
      });
    }
  }





    ConfirmarMovimiento() {
    const movimientoData = {
      fecha: this.fechaFormateada,
      tipo: this.form.value.movimientoDetalle['tipo_origen'],
      usuario: this.userid,
      sucursal: this.usersucursal,
      origen: this.form.value.movimientoDetalle['movimiento_origen'],
      origencodigo: this.form.value.movimientoDetalle['codigo_origen'],
      observaciones: '',
    };
    //this.movimiento = 1;

    const cantidadesPorId: {
      [id: string]: {
        almacen: number;
        producto: number;
        cantidad: number;
        medida: string;
      };
    } = {};

    if (this.form.valid) {
      this.form.value.listaMovimiento.forEach((producto: Producto) => {
        producto.movimiento = this.movimiento;

        const idobtenido = producto.idobtenido;
        const cantidad = +producto.cantidad;

        cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
          almacen: this.usersucursal,
          producto: producto.producto,
          cantidad: 0,
          medida: producto.medida,
        };
        cantidadesPorId[idobtenido].cantidad += cantidad;
      });

      Object.keys(cantidadesPorId).forEach((id) => {
        //console.log(`Suma de cantidades de idobtenido ${id}: ${cantidadesPorId[id]}`);
        //console.log(cantidadesPorId[id].producto);
        //console.log(cantidadesPorId[id]);

        this.stockService.getStockAll().subscribe({
          next: (datosSTOCK: any) => {
            this.datosSTOCK = datosSTOCK;

            const sucursalFindUpdate = this.datosSTOCK.find(
              (stock: any) =>
                stock.almacen_id === this.usersucursal &&
                stock.producto_id === cantidadesPorId[id].producto
            );
            //console.log(sucursalFindUpdate);

            if (sucursalFindUpdate) {
              if (movimientoData.tipo === 'INGRESO') {
                sucursalFindUpdate.cantidad =
                  Number(sucursalFindUpdate.cantidad) +
                  Number(cantidadesPorId[id].cantidad);
                //console.log(sucursalFindUpdate);
                const stockActualizar = {
                  id: sucursalFindUpdate.stock_id,
                  almacen: cantidadesPorId[id].almacen,
                  producto: cantidadesPorId[id].producto,
                  cantidad: sucursalFindUpdate.cantidad,
                  medida: cantidadesPorId[id].medida,
                  condicion: 'ACTUALIZAR',
                };
                console.log(stockActualizar);
              } else if (movimientoData.tipo === 'SALIDA') {
                sucursalFindUpdate.cantidad =
                  Number(sucursalFindUpdate.cantidad) -
                  Number(cantidadesPorId[id]);
                console.log(sucursalFindUpdate);
              }
            } else {
              const stockActualizar2 = {
                almacen: cantidadesPorId[id].almacen,
                producto: cantidadesPorId[id].producto,
                cantidad: cantidadesPorId[id].cantidad,
                medida: cantidadesPorId[id].medida,
                condicion: "REGISTRAR",
              };
              console.log(stockActualizar2);
            }
          },
          error: () => {},
          complete: () => {},
        });
      });

      /*       this.movimientosAlmacenService.postMovimientos(movimientoData).subscribe({
        next: (response) => {
          this.movimiento = response;
          console.log('Movimiento registrada con éxito:', this.movimiento);
          this.form.value.listaMovimiento.forEach((producto: Producto) => {
            producto.movimiento = this.movimiento;

            //PARA ALMACENAR LOS PRODUCTOS
            this.movimientosAlmacenDetalleService
              .postMovimientosDetalle(producto)
              .subscribe({
                next: (response) => {
                  console.log('Entrada registrada con éxito:', response);
                },
                error: (errorData) => {
                  console.error(
                    'Error al enviar la solicitud POST de MOVIMIENTODETALLE:',
                    errorData
                  );
                },
                complete: () => {},
              });
              //PARA ACTUALIZAR EL STOCK
            
          });
        },
        error: (errorData) => {
          console.error(errorData);
        },
        complete: () => {
          this.router.navigate(['/almacen/movimientos-almacen']);
        },
      }); */
      //console.log(this.form.value)
    }
}
  



                if (sucursalFindUpdate) {
                  if (movimientoData.tipo === 'INGRESO') {
                    sucursalFindUpdate.cantidad =
                      Number(sucursalFindUpdate.cantidad) +
                      Number(cantidadesPorId[id].cantidad);
                    //console.log(sucursalFindUpdate);
                    const stockActualizar = {
                      id: sucursalFindUpdate.stock_id,
                      almacen: cantidadesPorId[id].almacen,
                      producto: cantidadesPorId[id].producto,
                      cantidad: sucursalFindUpdate.cantidad,
                      medida: cantidadesPorId[id].medida,
                      condicion: 'ACTUALIZAR',
                    };
                    console.log(stockActualizar);
                  } else if (movimientoData.tipo === 'SALIDA') {
                    /* sucursalFindUpdate.cantidad =
                      Number(sucursalFindUpdate.cantidad) -
                      Number(cantidadesPorId[id]);
                    console.log(sucursalFindUpdate); */
                  }
                } else {
                  const stockActualizar2 = {
                    almacen: cantidadesPorId[id].almacen,
                    producto: cantidadesPorId[id].producto,
                    cantidad: cantidadesPorId[id].cantidad,
                    medida: cantidadesPorId[id].medida,
                    condicion: 'REGISTRAR',
                  };
                  console.log(stockActualizar2);
                }