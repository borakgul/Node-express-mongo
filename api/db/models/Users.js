const mongoose = require('mongoose');

const schema = mongoose.Schema({
    email : {type:String,required:true, unique:true},
    password : { type: String, required: true },
    is_active : {type:Boolean, default:true}, 
    first_name : String,
    last_name : String,
    phone_number : String

}, {
    versionKey:false,
    // timestamps:true aynı şey
    timestamps:{
        createdAt: "created_at",
        updatedAt: "updated_at"
    } //veri veya şema eklerken bu alanlar otomatik olarak alınır. Ek olarak bellirtmek gerekmez.
});
class Users extends mongoose.model{

}

schema.loadClass(Users);
module.exports = mongoose.model('Users',schema); //Users ismiyle schema'yı export et.
