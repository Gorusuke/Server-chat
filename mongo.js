const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_DB_URI } = process.env;

const connectionString = MONGO_DB_URI;

if (!connectionString) {
  console.error(
    "Recuerda que tienes que tener un archiivo .env con las variables de entorno definidas y el MONGO_DB_URI que servira de connection string. En las clases usamos MongoDB atlas pero puedes utilizar cualquier base de datos de MongoDB (local incluso)"
  );
}

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.info("Database Connected");
  })
  .catch((error) => {
    console.error(error);
  });
