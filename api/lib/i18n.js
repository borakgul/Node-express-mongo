
const i18n = require('../i18n');

class I18n {
    constructor(lang) {
        this.lang = lang;
        //lang = 'EN' or 'TR'
    }
    translate(text, lang = this.lang, params = []) {

        let arr = text.split("."); // COMMON.VALIDATION_ERROR_TITLE => ['COMMON', 'VALIDATION_ERROR_TITLE']

        let val = i18n[lang][arr[0]];   //text['EN']['COMMON']

        for (let i = 1; i<arr.length; i++){
            val = val[arr[i]]; // i = 1 için val{"VALIDATION_ERROR_TITLE"}
        }
        
        val = val + ""; // FIELD MUST BE FILLED değerinin içine atama yapıyoruz. Pass By Value kavramı çerçevrsinde memorydeki alanı değiştirmiş oluyoruz. Bu yüaden yapıyoruz. Böylece bu string ekleme yapıldığı için memoryde farklı bir alanı temsil etmiş olacak. Yani en.js/tr.js içersindeki alanı değiştirmiş olmayacak.

        for (let i = 0; i < params.length; i++) {
            val = val.replace("{}", params[i]);
        }

        return val || ""; //i16n 'nin language parametresine git.
    }
}
module.exports = I18n;