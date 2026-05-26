const { Sequelize } = require("sequelize");
const path = require("path");

// Membuat koneksi database SQLite lokal
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "..", "..", "database.sqlite"),
  logging: false, // Nonaktifkan logging SQL ke konsol agar output bersih
});

module.exports = sequelize;
