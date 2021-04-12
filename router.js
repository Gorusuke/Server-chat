const express = require("express");
const router = express.Router();

module.exports = function () {
  router.get("/", (req, res) => {
    // Obteniendo la pagina principal
    res.send("<h1>Welcome.!</h1>");
  });

  return router;
};
