// Pulls each eddiekit package's README.md into src/content/<package>.md so the docs site
// always reflects the package's real, current documentation instead of a hand-maintained copy.
//
// Looks for a sibling package directory first (../../<package>/README.md - true when this repo
// is checked out alongside the others, as in local development), and falls back to fetching the
// README from GitHub (so this also works when the docs repo is checked out on its own, e.g. in
// CI for a GitHub Pages deploy). The source repos are private, so that fallback needs a token
// with read access to them - set ORG_READ_TOKEN (a fine-grained PAT scoped to Contents: Read-only
// on the relevant repos) and it'll use the authenticated Contents API; without it, only public
// repos will resolve via the plain raw.githubusercontent.com URL.
//
// Output is generated, not committed - see .gitignore.

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "..", "src", "content");
const SIBLING_PACKAGES_DIR = path.join(__dirname, "..", "..");

const PACKAGES = ["session", "auth", "captcha", "limiter", "mail"];

async function readLocalReadme(pkg) {
    try {
        return await readFile(path.join(SIBLING_PACKAGES_DIR, pkg, "README.md"), "utf8");
    } catch {
        return null;
    }
}

async function readRemoteReadme(pkg) {
    const token = process.env.ORG_READ_TOKEN;

    if (token) {
        try {
            const response = await fetch(`https://api.github.com/repos/eddiekit/${pkg}/contents/README.md`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github.raw+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            });
            if (response.ok) {
                return await response.text();
            }
        } catch {
            // fall through to the unauthenticated attempt below
        }
    }

    try {
        const response = await fetch(`https://raw.githubusercontent.com/eddiekit/${pkg}/main/README.md`);
        return response.ok ? await response.text() : null;
    } catch {
        return null;
    }
}

function titleCase(pkg) {
    return pkg.charAt(0).toUpperCase() + pkg.slice(1);
}

async function main() {
    await rm(CONTENT_DIR, { recursive: true, force: true });
    await mkdir(CONTENT_DIR, { recursive: true });

    const pulled = [];

    for (const pkg of PACKAGES) {
        const readme = (await readLocalReadme(pkg)) ?? (await readRemoteReadme(pkg));

        if (readme === null) {
            console.warn(`[pull-readmes] No README found for "${pkg}" (checked local sibling dir and GitHub) - skipping.`);
            continue;
        }

        const frontmatter = `---\ntitle: "${titleCase(pkg)}"\n---\n\n`;
        await writeFile(path.join(CONTENT_DIR, `${pkg}.md`), frontmatter + readme, "utf8");
        pulled.push(pkg);
    }

    console.log(`[pull-readmes] Pulled ${pulled.length}/${PACKAGES.length} README(s): ${pulled.join(", ") || "none"}`);
}

main();
