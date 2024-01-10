if (
  this.form.get("clienteDetalle")?.valid &&
  this.form.get("listaVenta")?.valid
) {
  this.form.value.listaVenta.forEach((producto: Producto) => {
    //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
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
    console.log(cantidadesPorId[id]);
    console.log(this.datoStock);

    const datosFind = this.datoStock.find(
      (prod: any) => prod.prod_id === cantidadesPorId[id].producto
    );
    const operacionCantidad = parseFloat(
      (datosFind.cantidadStockSucursal - cantidadesPorId[id].cantidad).toFixed(
        2
      )
    );
    //console.log(datosFind);
    console.log(operacionCantidad);
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (
  this.form.get("clienteDetalle")?.valid &&
  this.form.get("listaVenta")?.valid
) {
  this.form.value.listaVenta.forEach((producto: Producto) => {
    //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
    const idobtenido = producto.idobtenido;
    const cantidad = +producto.cantidad;
    cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
      almacen: this.usersucursal,
      producto: producto.producto,
      cantidad: 0,
      medida: producto.medida,
    };
    cantidadesPorId[idobtenido].cantidad += cantidad;

    const datosFind = this.datoStock.find(
      (prod: any) => prod.prod_id === cantidadesPorId[idobtenido].producto
    );

    if (datosFind) {
      const operacionCantidad = parseFloat(
        (
          datosFind.cantidadStockSucursal - cantidadesPorId[idobtenido].cantidad
        ).toFixed(2)
      );
      producto.estiloRojo = operacionCantidad < 0;
      console.log(operacionCantidad);

      if (operacionCantidad < 0) {
        producto.cantidadfinal = operacionCantidad;
        alertsToShow.push({
          icon: "error",
          title: "Oops...",
          text:
            "NO HAY STOCK EN EL PRODUCTO: " +
            producto.nombrepobtenido +
            "\n Se pasa por una " +
            Math.abs(operacionCantidad) +
            " cantidad",
        });

        // Almacena los productos sin stock
        productosSinStock.push(producto);
      }
      //this.cdr.detectChanges(); // Forzar la detección de cambios
    }
  });

  // Después del bucle forEach
  if (alertsToShow.length > 0) {
    alertsToShow.forEach((alert) => Swal.fire(alert));
  }
  // Ahora puedes realizar acciones adicionales con los productos sin stock
  if (productosSinStock.length > 0) {
    console.log("Productos sin stock:", productosSinStock);
    // Realizar acciones adicionales, si es necesario
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ORIGNAL

ProformaClick() {
    const ventaData = {
      fecha: this.fechaFormateada,
      cliente: this.form.value.clienteDetalle['id'],
      proceso: 'PROFORMA',
      usuario: this.userid,
      sucursal: this.usersucursal,
    };
    if (this.form.valid) {
      this.ventasService.postVentas(ventaData).subscribe({
        next: (response) => {
          this.venta = response;

          this.form.value.listaVenta.forEach((producto: Producto) => {
            // Agregamos el ID de venta obtenido al objeto producto
            producto.venta = this.venta;

            // Ahora, realizamos la solicitud POST para guardar cada producto individualmente
            this.ventasDetalleService.postVentasDetalle(producto).subscribe({
              next: (response) => {
                console.log('Entrada registrada con éxito:', response);
              },
              error: (errorData) => {
                console.error(
                  'Error al enviar la solicitud POST de VENTADETALLE:',
                  errorData
                );
              },
              complete: () => {},
            });
          });
        },
        error: (errorData) => {
          console.error(
            'Error al enviar la solicitud POST de VENTA:',
            errorData
          );
        },
        complete: () => {
          this.router.navigate(['/despacho/venta']);
        },
      });
    }
}
ConfirmarVentaClick() {
    const ventaData = {
      fecha: this.fechaFormateada,
      cliente: this.form.value.clienteDetalle['id'],
      proceso: 'CONFIRMADO',
      usuario: this.userid,
      sucursal: this.usersucursal,
    };
    if (this.form.valid) {
      this.ventasService.postVentas(ventaData).subscribe({
        next: (response) => {
          this.venta = response;

          this.form.value.listaVenta.forEach((producto: Producto) => {
            // Agregamos el ID de venta obtenido al objeto producto
            producto.venta = this.venta;

            // Ahora, realizamos la solicitud POST para guardar cada producto individualmente
            this.ventasDetalleService.postVentasDetalle(producto).subscribe({
              next: (response) => {
                console.log('Entrada registrada con éxito:', response);
              },
              error: (errorData) => {
                console.error(
                  'Error al enviar la solicitud POST de VENTADETALLE:',
                  errorData
                );
              },
              complete: () => {},
            });
          });
        },
        error: (errorData) => {
          console.error(
            'Error al enviar la solicitud POST de VENTA:',
            errorData
          );
        },
        complete: () => {
          this.router.navigate(['/despacho/caja']);
        },
      });
    }
  }
  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ADAPTACION
  ProformaClick() {
    const cantidadesPorId: {
      [id: string]: {
        almacen: number;
        producto: number;
        cantidad: number;
        medida: string;
        stock_id: number;
      };
    } = {};
    const ventaData = {
      fecha: this.fechaFormateada,
      cliente: this.form.value.clienteDetalle['id'],
      proceso: 'PROFORMA',
      usuario: this.userid,
      sucursal: this.usersucursal,
    };

    /*    const ActualizarVentaStock = {
      almacen: this.usersucursal,
      producto: ,
      cantidad: 
    }; */

    // Antes del bucle forEach
    const alertsToShow: any[] = [];

    if (
      this.form.get('clienteDetalle')?.valid &&
      this.form.get('listaVenta')?.valid
    ) {
      //FOERACH 1
      this.form.value.listaVenta.forEach((producto: Producto) => {
        //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
        const idobtenido = producto.idobtenido;
        const cantidad = +producto.cantidad;
        cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
          almacen: this.usersucursal,
          producto: producto.producto,
          cantidad: 0,
          medida: producto.medida,
          stock_id: '', //ID DEL STOCK PARA EL PUT
        };
        cantidadesPorId[idobtenido].cantidad += cantidad;

        const datosFind0 = this.datoStock.find(
          (prod: any) => prod.prod_id === cantidadesPorId[idobtenido].producto
        );
        const operacionCantidad0 = parseFloat(
          (
            datosFind0.cantidadStockSucursal -
            cantidadesPorId[idobtenido].cantidad
          ).toFixed(2)
        );
        producto.estiloRojo = operacionCantidad0 < 0;
      });

      let todosProductosCumplen = true; // Variable de bandera
      const productosCumplenCriterio: {
        id: number;
        cantidad: number;
        producto: number;
      }[] = []; // Almacena los productos que cumplen con el criterio

      //PARA EL PUT
      Object.keys(cantidadesPorId).forEach((id) => {
        //console.log(cantidadesPorId[id]);
        //console.log(this.datoStock);
        const datosFind = this.datoStock.find(
          (prod: any) => prod.prod_id === cantidadesPorId[id].producto
        );
        const operacionCantidad = parseFloat(
          (
            datosFind.cantidadStockSucursal - cantidadesPorId[id].cantidad
          ).toFixed(2)
        );

        const stockSucursal = this.datoStock.find(
          (stock: any) =>
            stock.prod_id === cantidadesPorId[id].producto &&
            stock.med_id === cantidadesPorId[id].medida &&
            stock.almacen_id === this.usersucursal
        );
        cantidadesPorId[id].stock_id = stockSucursal.stock_id;
        //console.log(cantidadesPorId[id].cantidad);

        if (operacionCantidad < 0) {
          todosProductosCumplen = false;
        } else {
          productosCumplenCriterio.push({
            id: cantidadesPorId[id].stock_id,
            cantidad: operacionCantidad,
            producto: cantidadesPorId[id].producto,
          });
        }
      });

      // Verifica la variable de bandera antes de imprimir
      if (todosProductosCumplen) {
        console.log('TODO LISTO PARA REALIZAR EL POST');
        //HACER EL PUT
        productosCumplenCriterio.forEach((ventasDataPut) => {
          console.log(ventasDataPut);
          //console.log(ventasDataPut.cantidad);
        });
        //HACER EL POST
        const movimientoData = {
          fecha: this.fechaFormateada,
          tipo: 'SALIDA',
          usuario: this.userid,
          sucursal: this.usersucursal,
          origen: 'VENTA',
          origencodigo: '', //I DE LA VENTA
          observaciones: '',
        };
        console.log(movimientoData);
        this.form.value.listaVenta.forEach((producto: Producto) => {
          producto.movimiento = '1';
          const movimientoDetalleData = {
            movimiento: producto.movimiento,
            producto: producto.producto,
            cantidad: producto.cantidad,
            medida: producto.medida,
            vencimiento: '',
            lote: '',
            peso: '',
          };
          console.log(movimientoDetalleData);
          console.log(producto);
        });
      } else {
        //alert('Hay productos que sobrepasan el stock');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          timerProgressBar: true, // Muestra una barra de progreso
          showConfirmButton: false,
          timer: 4000,
          text: 'HAY UN PRODUCTO QUE NO CUENTA CON EL STOCK DISPONIBLE PARA LA COMPRA',
        });
      }
    }
  }


//PREPARANDO PARA EL ENVIO
ProformaClick() {
  
  const cantidadesPorId: {
        [id: string]: {
          almacen: number,
          producto: number,
          cantidad: number,
          medida: string,
          stock_id: number,
        },
      } = {};
  const ventaData = {
        fecha: this.fechaFormateada,
        cliente: this.form.value.clienteDetalle["id"],
        proceso: "PROFORMA",
        usuario: this.userid,
        sucursal: this.usersucursal,
  };

  // Antes del bucle forEach
    if (this.form.get('clienteDetalle')?.valid && this.form.get('listaVenta')?.valid) {
      this.form.value.listaVenta.forEach((producto: Producto) => {
        //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
        const idobtenido = producto.idobtenido;
        const cantidad = +producto.cantidad;
        cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
          almacen: this.usersucursal,
          producto: producto.producto,
          cantidad: 0,
          medida: producto.medida,
          stock_id: "", //ID DEL STOCK PARA EL PUT
        };
        cantidadesPorId[idobtenido].cantidad += cantidad;

        //PARA PODER VISUALIZAR EL ELEMENTO QUE SE SOBREPASA Y MARCARLO CON ROJO
        const datosFind0 = this.datoStock.find(
          (prod: any) => prod.prod_id === cantidadesPorId[idobtenido].producto
        );
        const operacionCantidad0 = parseFloat(
          (
            datosFind0.cantidadStockSucursal -
            cantidadesPorId[idobtenido].cantidad
          ).toFixed(2)
        );
        producto.estiloRojo = operacionCantidad0 < 0;
        //FIN

      });

    let todosProductosCumplen = true; // Variable de bandera
    const productosCumplenCriterio: {
      id: number,
      cantidad: number,
      producto: number,
    }[] = []; // Almacena los productos que cumplen con el criterio

  //PARA EL PUT
    Object.keys(cantidadesPorId).forEach((id) => {
      const datosFind = this.datoStock.find(
        (prod: any) => prod.prod_id === cantidadesPorId[id].producto
      );
      const operacionCantidad = parseFloat(
        (datosFind.cantidadStockSucursal - cantidadesPorId[id].cantidad).toFixed(
          2
        )
      );
      const stockSucursal = this.datoStock.find(
        (stock: any) =>
          stock.prod_id === cantidadesPorId[id].producto &&
          stock.med_id === cantidadesPorId[id].medida &&
          stock.almacen_id === this.usersucursal
      );
      cantidadesPorId[id].stock_id = stockSucursal.stock_id;

      if (operacionCantidad < 0) {
        todosProductosCumplen = false;
      } else {
        productosCumplenCriterio.push({
          id: cantidadesPorId[id].stock_id,
          cantidad: operacionCantidad,
          producto: cantidadesPorId[id].producto,
        });
      }
    });
      
    // Verifica la variable de bandera antes de imprimir
    if (todosProductosCumplen) {
      productosCumplenCriterio.forEach((ventasDataPut) => {
        console.log(ventasDataPut);
        console.log(ventasDataPut.cantidad);
      //HACER EL PUT
        this.stockService.updatedStock(ventasDataPut).subscribe({
            next: (response) => {
              console.log(response);
            },
            error: (errorData) => {
              console.log(errorData);
            },
            complete: () => {},
        });
      //FIN HACER EL PUT
      });

    //HACER EL POST
      const movimientoData = {
        fecha: this.fechaFormateada,
        tipo: "SALIDA",
        usuario: this.userid,
        sucursal: this.usersucursal,
        origen: "VENTA",
        origencodigo: "", //I DE LA VENTA
        observaciones: "",
      };
      this.ventasService.postVentas(ventaData).subscribe({
        next: (response) => {
          this.venta = response;

          this.form.value.listaVenta.forEach((producto: Producto) => {
            // Agregamos el ID de venta obtenido al objeto producto
            producto.venta = this.venta;

            // Ahora, realizamos la solicitud POST para guardar cada producto individualmente
            this.ventasDetalleService.postVentasDetalle(producto).subscribe({
              next: (response) => {
                console.log('Entrada registrada con éxito:', response);
              },
              error: (errorData) => {
                console.error(
                  'Error al enviar la solicitud POST de VENTADETALLE:',
                  errorData
                );
              },
              complete: () => {},
            });
            //FIN DE VENTA-DETALLE
          });
        },
        error: (errorData) => {
           console.error('Error al enviar la solicitud POST de VENTA:', errorData);
           },
        complete: () => {},
      });
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        timerProgressBar: true, // Muestra una barra de progreso
        showConfirmButton: false,
        timer: 4000,
        text: 'HAY UN PRODUCTO QUE NO CUENTA CON EL STOCK DISPONIBLE PARA LA COMPRA',
      });
    }
    }
}

//PREPARANDO PARA EL ENVIO DE CONFIRMAR VENTA
ConfirmarVentaClick() {
  
  const cantidadesPorId: {
        [id: string]: {
          almacen: number,
          producto: number,
          cantidad: number,
          medida: string,
          stock_id: number,
        },
      } = {};
  const ventaData = {
        fecha: this.fechaFormateada,
        cliente: this.form.value.clienteDetalle["id"],
        proceso: "CONFIRMADO",
        usuario: this.userid,
        sucursal: this.usersucursal,
  };

  // Antes del bucle forEach
    if (this.form.get('clienteDetalle')?.valid && this.form.get('listaVenta')?.valid) {
      this.form.value.listaVenta.forEach((producto: Producto) => {
        //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
        const idobtenido = producto.idobtenido;
        const cantidad = +producto.cantidad;
        cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
          almacen: this.usersucursal,
          producto: producto.producto,
          cantidad: 0,
          medida: producto.medida,
          stock_id: "", //ID DEL STOCK PARA EL PUT
        };
        cantidadesPorId[idobtenido].cantidad += cantidad;

        //PARA PODER VISUALIZAR EL ELEMENTO QUE SE SOBREPASA Y MARCARLO CON ROJO
        const datosFind0 = this.datoStock.find(
          (prod: any) => prod.prod_id === cantidadesPorId[idobtenido].producto
        );
        const operacionCantidad0 = parseFloat(
          (
            datosFind0.cantidadStockSucursal -
            cantidadesPorId[idobtenido].cantidad
          ).toFixed(2)
        );
        producto.estiloRojo = operacionCantidad0 < 0;
        //FIN

      });

    let todosProductosCumplen = true; // Variable de bandera
    const productosCumplenCriterio: {
      id: number,
      cantidad: number,
      producto: number,
    }[] = []; // Almacena los productos que cumplen con el criterio

  //PARA EL PUT
    Object.keys(cantidadesPorId).forEach((id) => {
      const datosFind = this.datoStock.find(
        (prod: any) => prod.prod_id === cantidadesPorId[id].producto
      );
      const operacionCantidad = parseFloat(
        (datosFind.cantidadStockSucursal - cantidadesPorId[id].cantidad).toFixed(
          2
        )
      );
      const stockSucursal = this.datoStock.find(
        (stock: any) =>
          stock.prod_id === cantidadesPorId[id].producto &&
          stock.med_id === cantidadesPorId[id].medida &&
          stock.almacen_id === this.usersucursal
      );
      cantidadesPorId[id].stock_id = stockSucursal.stock_id;

      if (operacionCantidad < 0) {
        todosProductosCumplen = false;
      } else {
        productosCumplenCriterio.push({
          id: cantidadesPorId[id].stock_id,
          cantidad: operacionCantidad,
          producto: cantidadesPorId[id].producto,
        });
      }
    });
      
    // Verifica la variable de bandera antes de imprimir
    if (todosProductosCumplen) {
      productosCumplenCriterio.forEach((ventasDataPut) => {
        //console.log(ventasDataPut);
        //console.log(ventasDataPut.cantidad);
      //HACER EL PUT
        this.stockService.updatedStock(ventasDataPut).subscribe({
            next: (response) => {
              console.log(response);
            },
            error: (errorData) => {
              console.log(errorData);
            },
            complete: () => {},
        });
      //FIN HACER EL PUT
      });

    //HACER EL POST
      const movimientoData = {
        fecha: this.fechaFormateada,
        tipo: "SALIDA",
        usuario: this.userid,
        sucursal: this.usersucursal,
        origen: "VENTA",
        origencodigo: "", //I DE LA VENTA
        observaciones: "",
      };
      //POST VENTAS
      this.ventasService.postVentas(ventaData).subscribe({
        next: (response) => {
          this.venta = response;

          this.form.value.listaVenta.forEach((producto: Producto) => {
            // Agregamos el ID de venta obtenido al objeto producto
            producto.venta = this.venta;

            // Ahora, realizamos la solicitud POST para guardar cada producto individualmente
            this.ventasDetalleService.postVentasDetalle(producto).subscribe({
              next: (response) => {
                console.log('Entrada registrada con éxito:', response);
              },
              error: (errorData) => {
                console.error(
                  'Error al enviar la solicitud POST de VENTADETALLE:',
                  errorData
                );
              },
              complete: () => {},
            });
            //FIN DE VENTA-DETALLE
          });

          const movimientoData = {
            fecha: this.fechaFormateada,
            tipo: 'SALIDA',
            usuario: this.userid,
            sucursal: this.usersucursal,
            origen: 'VENTA',
            origencodigo: this.venta, //I DE LA VENTA
            observaciones: '',
          };
          //POST MOVIMIENTOS
          this.movimientosAlmacenService.postMovimientos(movimientoData).subscribe({
            next: (response) => {
              producto.movimiento = response;
              this.form.value.listaVenta.forEach((producto: Producto) => {
              const movimientoDetalleData = {
                movimiento: producto.movimiento,
                producto: producto.producto,
                cantidad: producto.cantidad,
                medida: producto.medida,
                vencimiento: '',
                lote: '',
                peso: '',
              };
                this.movimientosAlmacenDetalleService.postMovimientosDetalle(movimientoDetalleData).subscribe({
                  next: (response) => {
                    console.log('Movimientodetalle registrado con éxito:', response);
                  },
                  error: (errorData) => {
                    console.error(
                      'Error al enviar la solicitud POST de MOVIMIENTODETALLE:',
                      errorData
                    );
                  },
                  complete: () => {},
                });
              });
            },
            error: (errorData) => {
              console.error('Error al enviar la solicitud POST de MOVIMIENTO:', errorData);
              },
            complete: () => {},
          });

        },
        error: (errorData) => {
           console.error('Error al enviar la solicitud POST de VENTA:', errorData);
           },
        complete: () => {},
      });
    }
    else
    {
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          timerProgressBar: true, // Muestra una barra de progreso
          showConfirmButton: false,
          timer: 4000,
          text: 'HAY UN PRODUCTO QUE NO CUENTA CON EL STOCK DISPONIBLE PARA LA COMPRA',
        });
    }
    }
}