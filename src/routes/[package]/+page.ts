import { error } from '@sveltejs/kit';

const modules = import.meta.glob('/src/content/*.md');

export async function load({ params }) {
    const contentPath = `/src/content/${params.package}.md`;

    if (!modules[contentPath]) {
        throw error(404, 'Documentation page not found');
    }

    const content = await modules[contentPath]() as any;

    return {
        content: content.default,
        metadata: content.metadata
    };
}
