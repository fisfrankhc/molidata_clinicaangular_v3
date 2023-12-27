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
                


/* this.form
                  .get('listaMovimiento')
                  ?.value.forEach((productoLista: any) => {
                    const productoEncontrado = this.dataPROCOMPRA.find(
                      (productoCompra: any) =>
                        productoCompra.producto_id === productoLista.producto
                    );
                    if (productoEncontrado) {
                      // Aquí puedes realizar acciones comparativas o simplemente imprimir en la consola
                      console.log(
                        `Producto ${productoLista.nombrepobtenido} encontrado en la compra`
                      );
                    } else {
                      console.log(
                        `Producto ${productoLista.nombrepobtenido} no encontrado en la compra`
                      );
                    }
                  }); */

               this.comprasService.getCompra(valorCodigo).subscribe({
            next: (response: any) => {
              this.dataCOMPRA = response;
              if (this.dataCOMPRA == 'no hay resultados') {
                alert('LA COMPRA NO EXISTE');
              } else {
                this.dataCOMPRA = response[0];
                console.log(this.dataCOMPRA);

                this.comprasItemService
                  .getCompraItems(this.dataCOMPRA.compra_id)
                  .subscribe({
                    next: (response: any) => {
                      this.dataPROCOMPRA = response;
                      console.log(this.dataPROCOMPRA);
                    },
                    error: (errorData) => {},
                    complete: () => {},
                  });
                
                const productosMovimiento =
                  this.form.get('listaMovimiento')?.value;

                // Verifica si todos los productos en listaMovimiento están presentes en this.dataPROCOMPRA
                const todosProductosPresentes = productosMovimiento.every(
                  (productoMovimiento: any) => {
                    return (
                      this.dataPROCOMPRA &&
                      this.dataPROCOMPRA.some(
                        (productoCompra: any) =>
                          productoCompra.producto_id ===
                          productoMovimiento.producto
                      )
                    );
                  }
                );
                console.log(todosProductosPresentes);
                if (todosProductosPresentes) {
                  console.log(
                    'Todos los productos están presentes en la compra'
                  );
                } else {
                  console.log('¡Falta al menos un producto en la compra!');
                  
                }
              }
            },
            error: (errorData) => {},
            complete: () => {},
               });   
          


//REVISAMOS CADA PRODUCTO
productosMovimiento.forEach((productoLista: any) => {
  const productoEncontrado = this.dataPROCOMPRA.find(
    (productoCompra: any) =>
      productoCompra.producto_id ===
      productoLista.producto
  );
  if (productoEncontrado) {
    if (
      parseInt(productoEncontrado.cantidad) ===
      parseInt(productoLista.cantidad)
    ) {
      console.log('LAS CANTIDADES COINCIDEN');
    } else if (
      parseInt(productoEncontrado.cantidad) <
      parseInt(productoLista.cantidad)
    ) {
      cachesonsole.log(
        'EL VALOR DEL PRODUCTO ' +
          productoLista.nombrepobtenido +
          'SUPERA A LA COMPRA EFECTUADA'
      );
    }
  } else {
  }
});

const todosProductosExcede = productosMovimiento.every(
                        (productoMovimiento: any) => {
                          return (
                            this.dataPROCOMPRA.some(
                              (productoCompra: any) =>
                                productoCompra.producto_id ===
                                  productoMovimiento.producto &&
                                parseInt(productoCompra.cantidad) <
                                  parseInt(productoMovimiento.cantidad)
                            )
                          );
                        }
                      );
                      console.log(todosProductosExcede);
                      if (todosProductosExcede) {
                        console.log('PARA MENSAJE 1');
                      } else {
                        console.log('PARA MENSAJE 2');
}
                      

const algunProductoSuperaMontoCompra =
                        productosMovimiento.some((productoMovimiento: any) => {
                          const productoCompra = this.dataPROCOMPRA.find(
                            (producto: any) =>
                              producto.producto_id ===
                              productoMovimiento.producto
                          );

                          // Verificar si el productoCompra existe y si su cantidad es menor
                          return (
                            productoCompra &&
                            productoMovimiento.cantidad >
                              productoCompra.cantidad
                          );
                        });
                      

                      if (algunProductoSuperaMontoCompra) {
                        console.log(
                          'Al menos un producto supera al monto de compra'
                        );
                        Swal.fire({
                          title:
                            'Al menos un producto supera al monto de compra',
                          icon: 'error',
                          timer: 2500,
                        });
                      } else {
                        console.log(
                          'Las cantidades son iguales'
                        );
}
                      

const algunProductoSuperaMontoCompra =
                        productosMovimiento.some((producto: any) => {
                          const productoCompra = this.dataPROCOMPRA.find(
                            (productoCompra: any) =>
                              productoCompra.producto_id === producto.producto
                          );

                          // Verificar si el productoCompra existe y si su cantidad es menor
                          producto.encontrado =
                            productoCompra != null &&
                            parseInt(producto.cantidad) <
                              parseInt(productoCompra.cantidad);
                          producto.cantidadMaximaCompra =
                            productoCompra?.cantidad || 0;

                          return (
                            producto.encontrado === false ||
                            parseInt(producto.cantidad) >
                              parseInt(producto.cantidadMaximaCompra)
                          );
                        });

                      if (algunProductoSuperaMontoCompra) {
                        console.log(
                          'Al menos un producto supera al monto de compra'
                        );
                        Swal.fire({
                          title:
                            'Al menos un producto supera al monto de compra',
                          icon: 'error',
                          timer: 2500,
                        });
                      } else {
                        console.log('Las cantidades son iguales');
                      }