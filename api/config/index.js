module.exports = {
    "LOG_LEVEL":process.env.LOG_LEVEL || "debug", 
    //log level field var config'i import ettiğimde gelsin (mldule export ile sağladık.).
    //ENV'TAN LOG LEVELİ OKU EĞER YOKSA DEBUG OLARAK AYARLA
    "CONNECTION_STRING":process.env.CONNECTION_STRING || "mongodb://localhost:27017/project_base",
    //connection string field oluşturuldu. Değişken tanımlandı ve env'den okumasını istedik. 
    //Yoksa defauly olarak mongodb'ye bağlansın. Mongo db'deki project_base veritabanına ataması yapıldı.
}