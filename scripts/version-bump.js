import fs from 'fs';
import path from 'path';

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Please provide a version number (e.g., 0.1.1)');
  process.exit(1);
}

const files = [
  {
    path: 'package.json',
    type: 'json',
    key: 'version'
  },
  {
    path: 'src-tauri/tauri.conf.json',
    type: 'json',
    key: 'version'
  },
  {
    path: 'src-tauri/Cargo.toml',
    type: 'toml',
    regex: /^version\s*=\s*".*"/m,
    replace: `version = "${newVersion}"`
  }
];

files.forEach(file => {
  const filePath = path.resolve(process.cwd(), file.path);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${file.path}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  if (file.type === 'json') {
    const json = JSON.parse(content);
    json[file.key] = newVersion;
    content = JSON.stringify(json, null, 2) + '\n';
  } else if (file.type === 'toml') {
    content = content.replace(file.regex, file.replace);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file.path} to ${newVersion}`);
});
