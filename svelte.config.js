import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['javascript', 'typescript', 'svelte', 'bash', 'diff', 'json', 'css', 'html']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        vitePreprocess(),
        mdsvex({
            extensions: ['.md'],
            highlight: {
                highlighter: async (code, lang = 'text') => {
                    const html = highlighter.codeToHtml(code, {
                        lang,
                        theme: 'github-dark'
                    });
                    return `{@html \`${html.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\` }`;
                }
            }
        })
    ],

    extensions: ['.svelte', '.md'],

    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: '404.html',
            precompress: false,
            strict: true
        }),
        paths: {
            base: process.env.NODE_ENV === 'production' ? '/docs' : '',
        }
    }
};

export default config;
