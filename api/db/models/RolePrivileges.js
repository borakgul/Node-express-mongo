const mongoose = require('mongoose');

const schema = mongoose.Schema({
    role_id:{type: mongoose.SchemaTypes.ObjectId,required: true,},//role id alanı roles tablosundan gelmektedir. DB otomatik olarak oluşturur.
    permission:{type:String,required:true}, //permission alanı config/role_privileges.js dosyasındaki privileges alanındaki Key alanı ile eşleşmelidir.
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
class RolePrivileges extends mongoose.model{

}

schema.loadClass(RolePrivileges);
module.exports = mongoose.model('role_privileges',schema); 