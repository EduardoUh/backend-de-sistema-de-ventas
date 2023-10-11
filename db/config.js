const mongoose = require('mongoose');


module.exports.connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION);
        console.log('Connected to db');
    } catch (error) {
        console.log(error);
        throw new Error('Something went wrong when connecting to db');
    }
}