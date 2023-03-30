const mysql = require('mysql');
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'miNegocio'
});

async function connect() {
    try {
    await connection.connect();
    } catch (err) {
    console.log("ERROR: " + err);
    }
    }
    
    function query(query) {
    return new Promise((resolve, reject) => {
    connection.query(query, function (error, results, fields) {
    if (error) {
    reject(error);
    } else {
    resolve(results);
    }
    });
    });
    }
    
    let cliente = {
    nombre: 'Nepomuceno',
    rfc: 'NEPO231010',
    ciudad: 'Colima',
    email: 'conocido@gmail.com'
    }
    
    let factura = {
    fecha: '2023/03/23',
    total: 150,
    productos: [{
    id: 1,
    cantidad: 5,
    costo: 10
    }, {
    id: 2,
    cantidad: 5,
    costo: 20
    }
    ]
    }
    
    async function insertData(cliente, datosFactura) {
    try {
    let totalSuma = 0;
    datosFactura.productos.forEach(producto => {
    totalSuma += producto.cantidad * producto.costo;
    });
    console.log("Total: " + totalSuma);
    let idCliente = await query( `INSERT INTO clientes (nombre, rfc, ciudad, cp, email) VALUES ('${cliente.nombre}', '${cliente.rfc}', '${cliente.ciudad}',28000, '${cliente.email}') RETURNING id`);

    let idFactura = await query(`
    INSERT INTO facturas (fecha, total, id_cliente) 
    VALUES ('${datosFactura.fecha}','${totalSuma}', ${idCliente.rows[0].id}) RETURNING id`);
    
    // datosFactura.productos.forEach(async (producto) => {
    //   await query(`
    // INSERT INTO detalle_facturas (id_factura, id_producto, cantidad, costo) 
    // VALUES (${idFactura.rows[0].id},${producto.id},${producto.cantidad},${producto.costo})`);
    // });  En pruebas...
    
    console.log("ID del cliente: " + idCliente.rows[0].id);
    console.log("ID de la factura: " + idFactura.rows[0].id);
} catch (error) {
    console.log(error);
    } finally {
    connection.end();
    }
    }
    connect();
    insertData(cliente, factura);