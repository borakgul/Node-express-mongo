import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
    pluginJs.configs.recommended, // Önce @eslint/js kurallarını uygula
    {
        // Projedeki tüm `.js` dosyalarını hedef al
        files: ["**/*.js"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },

        rules: {
            // Proje için özel kurallar
            "no-unused-vars": "off", // Kullanılmayan değişkenler için kontrolü tamamen kapat
            "no-undef": "off",
            "no-console": "off",
            "no-empty": "warn",
            "semi": ["error", "always"],
        },
    },
];
