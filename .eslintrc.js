module.exports = {
    env: {
        browser: true,
        es2021: true,
        "jest/globals": true,
    },
    extends: ["airbnb-base", "prettier", "plugin:jest/recommended"],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
    },
    overrides: [{
        "files": ["src/*.ts"],
        parser: "@typescript-eslint/parser",
        parserOptions: {
            "project": "./tsconfig.json"
        },
        plugins: ["@typescript-eslint/eslint-plugin"],
        rules: {
            "import/extensions": [
                "error",
                "ignorePackages",
                {
                    "ts": "never",
                    "js": "never",
                }
            ],
            "max-len": [
                "error",
                {
                    ignoreComments: true,
                    code: 120,
                },
            ],
            // "no-unused-vars": "off",
            "no-param-reassign": "off",
            "import/no-mutable-exports": "off",
        },
    }],
    settings: {
        "import/resolver": {
            "node": {
                "extensions": [".ts", ".js"],
            }
        }
    },
    plugins: ["jest"],
};
