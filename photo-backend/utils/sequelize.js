const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('photo_manager', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;
