const mongoose = require("mongoose");

const schema = mongoose.Schema({
    role_id : {type: mongoose.SchemaTypes.ObjectId,required: true,},
    user_id : {type: mongoose.SchemaTypes.ObjectId,required: true,}   
},
{
    versionKey: false,
         
     timestamps:{// timestamps:true aynı şey
        createdAt: "created_at",
        updatedAt: "updated_at"
    } //veri veya şema eklerken bu alanlar otomatik olarak alınır. Ek olarak bellirtmek gerekmez.
} 
);
class UserRoles extends mongoose.model{

}

schema.loadClass(UserRoles);
module.exports = mongoose.model('user_roles',schema); 