const mongoose = require('mongoose');

const schema = mongoose.Schema({
   
},{
    // timestamps:true aynı şey
    timestamps:{
        createdAt: "created_at",
        updatedAt: "updated_at"
    } //veri veya şema eklerken bu alanlar otomatik olarak alınır. Ek olarak bellirtmek gerekmez.
} 
);
class Roles extends mongoose.model{

}

schema.loadClass(Roles);
module.exports = mongoose.model('Roles',schema); //Users ismiyle schema'yı export et.
   