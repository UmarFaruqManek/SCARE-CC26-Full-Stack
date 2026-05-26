const { Sequelize } = require("sequelize");
const path = require("path");

let sequelize;

if (process.env.DATABASE_URL) {
  const pg = require("pg");

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectModule: pg,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  const storagePath =
    process.env.SQLITE_STORAGE ||
    (process.env.VERCEL
      ? path.join("/tmp", "database.sqlite")
      : path.join(__dirname, "..", "..", "database.sqlite"));

  // Membuat koneksi database SQLite lokal
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: storagePath,
    logging: false, // Nonaktifkan logging SQL ke konsol agar output bersih
  });
}

module.exports = sequelize;
