const { Sequelize } = require("sequelize");
const path = require("path");

const storagePath =
  process.env.SQLITE_STORAGE ||
  (process.env.VERCEL
    ? path.join("/tmp", "database.sqlite")
    : path.join(__dirname, "..", "..", "database.sqlite"));

// Membuat koneksi database SQLite lokal
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storagePath,
  logging: false, // Nonaktifkan logging SQL ke konsol agar output bersih
});

module.exports = sequelize;
