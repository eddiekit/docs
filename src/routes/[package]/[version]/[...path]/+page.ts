import { error } from '@sveltejs/kit';

const modules = import.meta.glob('/src/content/**/*.md');

export async function load({ params }) {
    const { package: pkg, version, path } = params;
    const contentPath = `/src/content/${pkg}/${version}/${path}.md`;

    try {
        if (!modules[contentPath]) {
            throw error(404, 'Documentation page not found');
        }

        const content = await modules[contentPath]() as any;

        return {
            content: content.default,
            metadata: content.metadata
        };
    } catch (e) {
        console.error(e);
        throw error(404, 'Documentation page not found');
    }
}
