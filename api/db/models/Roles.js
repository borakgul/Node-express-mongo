const mongoose = require('mongoose');

const schema = mongoose.Schema({

    role_name:{type:mongoose.SchemaTypes.String,required:true},
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
class Roles extends mongoose.model{

}

schema.loadClass(Roles);
module.exports = mongoose.model('Roles',schema); //Users ismiyle schema'yı export et.
   