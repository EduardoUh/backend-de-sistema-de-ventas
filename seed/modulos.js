module.exports.modulos = [
    {
        nombre: 'SUCURSALES',
        componente: 'Sucursales',
        ruta: '/sucursales',
        permisos: ['crear', 'ver', 'actualizar']
    },
    {
        nombre: 'USUARIOS',
        componente: 'Usuarios',
        ruta: '/usuarios',
        permisos: ['crear', 'ver', 'actualizar']
    },
    {
        nombre: 'PROVEEDORES',
        componente: 'Proveedores',
        ruta: '/proveedores',
        permisos: ['crear', 'ver', 'actualizar']
    },
    {
        nombre: 'TIPOS DE PRODUCTOS',
        componente: 'TiposDeProductos',
        ruta: '/tipos-de-productos',
        permisos: ['crear', 'ver', 'actualizar']
    },
    {
        nombre: 'PRODUCTOS',
        componente: 'Productos',
        ruta: '/productos',
        permisos: ['crear', 'ver', 'actualizar']
    },
    {
        nombre: 'STOCK',
        componente: 'Stock',
        ruta: '/stock',
        permisos: ['crear', 'ver', 'actualizar']
    },
    {
        nombre: 'COMPRAS',
        componente: 'Compras',
        ruta: '/compras',
        permisos: ['ver']
    },
    {
        nombre: 'CLIENTES',
        componente: 'Clientes',
        ruta: '/clientes',
        permisos: ['crear', 'ver', 'actualizar']
    },
    {
        nombre: 'CREAR COMPRA',
        componente: 'CrearCompra',
        ruta: '/crear-compra',
        permisos: ['crear']
    },
    {
        nombre: 'CREAR VENTA',
        componente: 'CrearVenta',
        ruta: '/crear-venta',
        permisos: ['crear']
    },
    {
        nombre: 'VENTAS',
        componente: 'Ventas',
        ruta: '/ventas',
        permisos: ['ver', 'crear pago', 'ver pagos']
    }
]