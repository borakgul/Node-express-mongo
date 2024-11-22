const mongoose = require('mongoose');

const schema = mongoose.Schema({

  level:String,
  email:String,
  location:String,
  proc_type:String,
  log:String,
},
{
    versionKey: false,
         
     timestamps:{// timestamps:true aynı şey
        createdAt: "created_at",
        updatedAt: "updated_at"
    } //veri veya şema eklerken bu alanlar otomatik olarak alınır. Ek olarak bellirtmek gerekmez.
} 
);
class AuditLogs extends mongoose.model{

}

schema.loadClass(AuditLogs); 
module.exports = mongoose.model('audit_logs',schema); //Users ismiyle schema'yı export et.
   