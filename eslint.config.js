import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        ignores: ['dist', 'node_modules', 'src-tauri/target', 'coverage', '*.config.js', '*.config.ts'],
    },
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        rules: {
            // TypeScript rules
            ...tsPlugin.configs.recommended.rules,

            // React rules
            ...reactPlugin.configs.recommended.rules,

            // React Hooks rules
            ...reactHooksPlugin.configs.recommended.rules,

            // Custom rules from .eslintrc.json
            'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
            'complexity': ['error', 10],
            'max-depth': ['error', 3],
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
