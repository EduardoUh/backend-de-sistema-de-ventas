const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const { connectDb } = require('./db/config.js');
const { authRouter, sucursalesRouter, usuariosRouter, rolesRouter, proveedoresRouter, tiposProductosRouter } = require('./routes/index.js');

const app = express();

const startServer = async () => {
    await connectDb();

    app.use(cors());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());

    app.use('/api/v1', authRouter);
    app.use('/api/v1', sucursalesRouter);
    app.use('/api/v1', usuariosRouter);
    app.use('/api/v1', rolesRouter);
    app.use('/api/v1', proveedoresRouter);
    app.use('/api/v1', tiposProductosRouter);

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '/public/index.html'));
    });

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
}

startServer();