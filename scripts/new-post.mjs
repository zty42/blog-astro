import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";

const POSTS_DIR = path.resolve("src/content/blog");

function formatLocalDateYYYYMMDD(d = new Date()) {
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function slugify(input) {
  const s = String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s;
}

function parseArgs(argv) {
  const args = {
    title: "",
    slug: "",
    tags: "",
    mdx: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--mdx") args.mdx = true;
    else if (a === "--md") args.mdx = false;
    else if (a === "--title" || a === "-t") args.title = argv[++i] ?? "";
    else if (a === "--slug" || a === "-s") args.slug = argv[++i] ?? "";
    else if (a === "--tags") args.tags = argv[++i] ?? "";
  }

  return args;
}

function tagsToFrontmatter(tagsRaw) {
  const tags = String(tagsRaw ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (tags.length === 0) return "";
  // YAML inline array: [a, b]
  return `tags: [${tags.join(", ")}]\n`;
}

function buildTemplate({ title, date, tagsFrontmatter }) {
  return `---\n` +
    `title: ${JSON.stringify(title)}\n` +
    `date: ${JSON.stringify(date)}\n` +
    tagsFrontmatter +
    `---\n\n` +
    `## \n\n` +
    `\n`;
}

function uniquePath(dir, baseName, ext) {
  let attempt = 0;
  while (true) {
    const suffix = attempt === 0 ? "" : `-${attempt}`;
    const filename = `${baseName}${suffix}.${ext}`;
    const full = path.join(dir, filename);
    if (!fs.existsSync(full)) return full;
    attempt++;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    let title = args.title;
    if (!title) title = (await rl.question("Title: ")).trim();
    if (!title) {
      console.error("Aborted: title is required.");
      process.exitCode = 1;
      return;
    }

    let tags = args.tags;
    if (!tags) tags = (await rl.question("Tags (comma-separated, optional): ")).trim();

    let slug = args.slug ? slugify(args.slug) : slugify(title);
    if (!slug) {
      // For non-latin titles (e.g. Chinese), slugify() becomes empty. Require an explicit slug.
      while (!slug) {
        const input = (await rl.question("Slug (required for non-latin titles): ")).trim();
        slug = slugify(input);
      }
    }

    const ext = args.mdx ? "mdx" : "md";
    fs.mkdirSync(POSTS_DIR, { recursive: true });

    const fullPath = uniquePath(POSTS_DIR, slug, ext);
    const date = formatLocalDateYYYYMMDD();
    const content = buildTemplate({
      title,
      date,
      tagsFrontmatter: tagsToFrontmatter(tags),
    });

    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`Created: ${path.relative(process.cwd(), fullPath)}`);
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
