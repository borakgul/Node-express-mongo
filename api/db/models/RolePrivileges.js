const mongoose = require('mongoose');

const schema = mongoose.Schema({
    role_id:{type: mongoose.SchemaTypes.ObjectId,required: true,},
    permission:{type:string,required:true},
    created_by: {type: mongoose.SchemaTypes.ObjectId,required: true,}   
},
{
    versionKey: false,
         
     timestamps:{// timestamps:true aynı şey
        createdAt: "created_at",
        updatedAt: "updated_at"
    } //veri veya şema eklerken bu alanlar otomatik olarak alınır. Ek olarak bellirtmek gerekmez.
} 
);
class RolePrivileges extends mongoose.model{

}

schema.loadClass(RolePrivileges);
module.exports = mongoose.model('role_privileges',schema); 