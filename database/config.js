const mongoose = require('mongoose');

// dB connection between mongo and node

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Database Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error in the db init');
    }
}

module.exports = {
    dbConnection,
}