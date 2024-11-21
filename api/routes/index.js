var express = require('express');
var router = express.Router();

const fs = require('fs'); // node js ile direkt gelir. Bu kütüphane ile dosya okuma yazma işlemleri yapabiliriz.

let routes = fs.readdirSync(__dirname);
//__dirname: bu dosyanın bulunduğu klasörün path'ini verir.
// Bu klasördeki tüm dosyaları oku.  //routes dizisine atar. 

for (let route of routes) {

  if (route.includes(".js") && route != "index.js"){
     router.use("/"+route.replace(".js",""), require('./'+route));
  }
}

module.exports = router;