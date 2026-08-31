import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: ['coverage/**', 'dist/**', 'node_modules/**', 'prisma/**', 'generated/**'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            globals: globals.node,
        },
        ...js.configs.recommended,
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
];
