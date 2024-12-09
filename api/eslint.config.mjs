    import globals from "globals";
    import pluginJs from "@eslint/js";

    /** @type {import('eslint').Linter.Config[]} */
    export default [
    {
        // Projedeki tüm `.js` dosyalarını hedef al
        files: ["**/*.js"],

        languageOptions: {
        ecmaVersion: "latest", // En son ECMAScript sürümünü kullan
        sourceType: "module", // ES Modules destekleniyor
        globals: {
            ...globals.browser, // Tarayıcı ortamı değişkenlerini ekle
            ...globals.node,    // Node.js ortamı değişkenlerini ekle
        },
        },

        rules: {
        // Kuralları özelleştir
        "no-unused-vars": ["warn", { 
            "args": "after-used",          // Sadece kullanılmayan parametrelerden sonra hata üret
            "argsIgnorePattern": "^next$" // 'next' adındaki parametreleri görmezden gel
          }], // Kullanılmayan değişkenler için uyarı verme
        "no-undef": "off",       // Tanımsız değişkenlere uyarı verme
        "no-console": "off",    // Konsol kullanımını uyarı seviyesinde tut
        "semi": ["error", "always"], // Her ifadeden sonra noktalı virgül zorunlu
        },
    },
    pluginJs.configs.recommended, // @eslint/js tarafından önerilen kuralları kullan
    ];
