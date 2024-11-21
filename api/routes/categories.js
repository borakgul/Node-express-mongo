var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {  //http://localhost:3000/api/categories 
  res.json({ success: true, message: "Categories" });
}   //http://localhost:3000/users/ geldiğinde 'respond with a resource' yazdır. 
    
    );
    module.exports = router; //router'ı export et.