const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name :{type:String,required:true,unique:true},
    is_active:{type:Boolean,default:true,},
    created_by: {type: mongoose.SchemaTypes.ObjectId}   
},
{
    versionKey: false,
         
     timestamps:{// timestamps:true aynı şey
        createdAt: "created_at",
        updatedAt: "updated_at"
    } //veri veya şema eklerken bu alanlar otomatik olarak alınır. Ek olarak bellirtmek gerekmez.
} 
);
class Categories extends mongoose.model{

}

schema.loadClass(Categories);
module.exports = mongoose.model('categories',schema); //Users ismiyle schema'yı export et.
   