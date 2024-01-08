# **Backend de sistema de ventas**

## **Descripción general:**

Backend de un sistema de ventas hecho para practicar.

## **Funcionalidades incluidas:**

* Iniciar sesión.
* Renovación de tokens de autenticación.
* Protección de los endpoints mediante la verificación del token de autenticación.
* Verificación de que los autores de las peticiones sean usuarios registrados.
* Acceso a endpoints mediante permisos asignados a los usuarios.
* Verificación de los datos del body de las peticiones de __creación__ y __actualización__.
* Resultados __paginados__ para las operaciones de __obtención__.
* Operaciones de __creado, actualizado y obtención__ de usuarios, sucursales, proveedores, clientes, productos y stock por sucursal.
* Asignar __roles__, __permisos__ y __sucursales__ a los usuarios.
* Operaciones de __creado__ y __obtención__ de compras, ventas y pagos por venta.

## **Pasos para correr el servidor**

* Instalar node.js y npm si no los tiene.
* Clonar, hacer fork o descargar el proyecto.
* Abrir una ventana de comandos en la raíz del proyecto.
* Ejecutar el siguiente comando ```npm install```, para installar todas la dependencias necesarias.
* Obtener una cadena de conexión para MongoDB, puedes obtener un cluster gratuito en el siguiente enlace [ir a MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register "MongoDB Atlas").
* Cambiar el nombre del archivo ```.env.template``` a ```.env``` e ingresar los valores que las variables requieren por ejemplo: PORT=4000 DB_CONNECTION=CadenaDeConexiónDeMongoDB JWT_SECRET=MyJWTSECRET@ULTRASECRET.
* En la ventana de comandos ejecutar el siguiente comando ```npm run db:import``` para importar algunos datos necesarios a la bd.
* Ahora en la ventana de comandos abierta ejecuta el siguiente comando ```npm run server``` para levantar el servidor.

**Nota:** Para hacer peticiones a los endpoints puede usar Postman y Thunder client; actualmente estoy trabajando en un proyecto de __React__ que consuma esta API, sin embargo aún no está terminado.

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

## **Description:**

Backend of a sales system made for practice purposes.

## **Features:**

* Log in.
* Renovation of authentication token.
* Middleware to verify the authentication token of the user.
* Middleware to verify if the author of the request is a registered user.
* Middleware to verify the user credentials over the endpoint.
* Verificación de los datos del body de las peticiones de creación y actualización.
* Verify the data of the __create__ and __update_ requests body.
* Resultados paginados para las operaciones de obtención.
* __Paginated results__ in the __get__ requests.
* __Create__, __update__ and __get__ operations over users, branches, providers, clients, products, stock by branch.
* Asign __roles__, __permissions__ and __branches__ to users.
* Operaciones de creado y obtención de compras, ventas y pagos por venta.
* __Create__ and __get__ operations over __sales__ and __payments per sale__.

## **Steps to get the server running**

* Install node.js and npm if you don't have them.
* Clone, fork or download the project.
* Open a cli in the project root.
* Run the following command to install all necessary dependencies ```npm install```.
* Get a MongoDB connection string, you can get a free cluster in the following link [go to MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register "MongoDB Atlas").
* Rename the ```.env.template``` file to ```.env``` and asign the required values to the variables, e.g. PORT=4000 DB_CONNECTION=MongoDBConnectionString JWT_SECRET=MyJWTSECRET@ULTRASECRET.
* In the cli run the following command ```npm run db:import``` to import some necessary data for the db.
* Now in the cli run the following command ```npm run server```, to get the server running.

**Note:** To start making requests to the API you can use Postman and Thunder client; currently I'm working in a __React__ project to consume this API, however it is not done yet.

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