import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";

const NOTES_DIR = path.resolve("src/content/notes");

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

function parseArgs(argv) {
  const args = {
    content: "",
    contentProvided: false,
    mdx: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--mdx") args.mdx = true;
    else if (a === "--md") args.mdx = false;
    else if (a === "--content" || a === "-c") {
      args.contentProvided = true;
      args.content = argv[++i] ?? "";
    }
  }

  return args;
}

async function readContentInteractive(rl) {
  console.log("Enter note content (optional).");
  console.log("Finish by submitting an empty line. Press Enter immediately for an empty note.");

  const lines = [];
  while (true) {
    const prompt = lines.length === 0 ? "Content: " : "> ";
    const line = (await rl.question(prompt)).toString();
    if (line.trim() === "") break;
    lines.push(line);
  }
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    const ext = args.mdx ? "mdx" : "md";
    fs.mkdirSync(NOTES_DIR, { recursive: true });

    const timestamp = Date.now();
    const baseName = `note-${timestamp}`;
    const fullPath = uniquePath(NOTES_DIR, baseName, ext);

    const date = new Date().toISOString();
    const content = args.contentProvided
      ? String(args.content)
      : await readContentInteractive(rl);

    const file =
      `---\n` +
      `date: ${JSON.stringify(date)}\n` +
      `---\n\n` +
      (content ? `${content}\n` : "");

    fs.writeFileSync(fullPath, file, "utf8");
    console.log(`Created: ${path.relative(process.cwd(), fullPath)}`);
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
