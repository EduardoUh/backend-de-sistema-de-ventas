# **Backend de sistema de ventas**

## **Descripción general:**

Backend de un sistema de ventas hecho para practicar.

## **Funcionalidades incluidas:**

* Iniciar sesión.
* Manejo de usuarios.
* Manejo de Sucursales.
* Manejo de stock por sucursal.
* Creación de ventas.
* Creación de ventas a crédito para clientes registrados.
* Actualización de perfil.
* Manejo de roles.
* Operaciones de __creado, actualizado y obtención__ de usuarios, sucursales, proveedores, clientes, productos y stock por sucursal.
* Asignar __roles__, __permisos__ y __sucursales__ a los usuarios.
* Operaciones de __creado__ y __obtención__ de compras, ventas y pagos por venta.
* Renovación de tokens de autenticación.
* Protección de los endpoints mediante la verificación del token de autenticación.
* Verificación de que los autores de las peticiones sean usuarios registrados.
* Acceso a endpoints mediante permisos asignados a los usuarios.
* Verificación de los datos del body de las peticiones de __creación__ y __actualización__.
* Resultados __paginados__ para las operaciones de __obtención__.

## **Ver demo:**

[Sistema de ventas](https://spa-sistema-de-ventas.onrender.com "Sistema de ventas")

### **Usuarios para acceder al sistema:**
* super usuario -> superusuario@gmail.com contraseña -> superusuario
* usuario administrador -> juanpalmagarza@gmail.com contraseña -> juanpalmagarzapassword

## **Tecnologías usadas en el proyecto:**

* JavaScript.
* Node.js.
* Express.
* Express Validator.
* MongoDB.
* Mongoose ODM.
* Json Web Token.
* Bcrypt.
* Cors.
* Nodemon.
* Dotenv.

## **Si desea levantar el proyecto en su computadora, siga estos pasos:**

* Instalar node.js y npm si no los tiene.
* Clonar, hacer fork o descargar el proyecto.
* Abrir una ventana de comandos en la raíz del proyecto.
* Ejecutar el siguiente comando ```npm install```, para installar todas la dependencias necesarias.
* Obtener una cadena de conexión para MongoDB, puedes obtener un cluster gratuito en el siguiente enlace [ir a MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register "MongoDB Atlas").
* Cambiar el nombre del archivo ```.env.template``` a ```.env``` e ingresar los valores que las variables requieren por ejemplo: PORT=4000 DB_CONNECTION=CadenaDeConexiónDeMongoDB JWT_SECRET=MyJWTSECRET@ULTRASECRET.
* En la ventana de comandos ejecutar el siguiente comando ```npm run db:import``` para importar algunos datos necesarios a la bd.
* Ahora en la ventana de comandos abierta ejecuta el siguiente comando ```npm run server``` para levantar el servidor.

**Nota:** Para hacer peticiones a los endpoints puede usar Postman y Thunder client; o usar la aplicación SPA en __React__ que creé para consumir esta API, [React SPA repo](https://github.com/EduardoUh/frontend-de-sistema-de-ventas "Ir al repo").

## **Description:**

Backend of a sales system made for practice purposes.

## **Features:**

* Log in.
* User management.
* Branches management.
* Branches stock management.
* Create sales.
* Create sales on credit, for registered users.
* Profile management.
* Roles management.
* __Create__, __update__ and __get__ operations over users, branches, providers, clients, products, stock by branch.
* Asign __roles__, __permissions__ and __branches__ to users.
* __Create__ and __get__ operations over __sales__ and __payments per sale__.
* Renovation of authentication token.
* Middleware to verify the authentication token of the user.
* Middleware to verify if the author of the request is a registered user.
* Middleware to verify the user credentials over the endpoint.
* Verification of the data of the __create__ and __update__ requests body.
* __Paginated results__ in the __get__ requests.

## **See live site:**

[Sellings system](https://spa-sistema-de-ventas.onrender.com "Sellings system")

## **Technologies used in the project:**

* JavaScript.
* Node.js.
* Express.
* Express Validator.
* MongoDB.
* Mongoose ODM.
* Json Web Token.
* Bcrypt.
* Cors.
* Nodemon.
* Dotenv.

## **Follow these steps if you wish to get the server running on your computer:**

* Install node.js and npm if you don't have them.
* Clone, fork or download the project.
* Open a cli in the project root.
* Run the following command to install all necessary dependencies ```npm install```.
* Get a MongoDB connection string, you can get a free cluster in the following link [go to MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register "MongoDB Atlas").
* Rename the ```.env.template``` file to ```.env``` and asign the required values to the variables, e.g. PORT=4000 DB_CONNECTION=MongoDBConnectionString JWT_SECRET=MyJWTSECRET@ULTRASECRET.
* In the cli run the following command ```npm run db:import``` to import some necessary data for the db.
* Now in the cli run the following command ```npm run server```, to get the server running.

**Note:** To start making requests to the API you can use Postman and Thunder client; or use the __React__ __SPA__ application I built to consume this API, [React SPA repo](https://github.com/EduardoUh/frontend-de-sistema-de-ventas "Go to React SPA repo").