const mongoose = require('mongoose');

const { PASSLENGTH, HTTP_CODES } = require ('../../config/Enum');  
const is = require('is_js');
const CustomError = require('../../lib/Error');
const bcrypt = require('bcrypt-nodejs');

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

    validPassword(password){
        return bcrypt.compareSync(password,this.password); //this ass
     }
    static validateFieldsBeforeAuth(email,password){
         if(typeof password !="string" || password.length < PASSLENGTH || is.not.email(email)) 
        
            throw new CustomError(HTTP_CODES.UNAUTHORIZED, "Validation Error", "Email or password is not valid.");
            
            return null;
        }

}

schema.loadClass(Users);
module.exports = mongoose.model('Users',schema); //Users ismiyle schema'yı export et.
