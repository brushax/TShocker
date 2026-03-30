import { execSync } from 'node:child_process';

const version = process.argv[2];

if (!version) {
  console.error('Please provide a version number, e.g. pnpm release:prepare 0.1.6');
  process.exit(1);
}

const run = (command) => {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: 'inherit' });
};

const tagName = `v${version}`;

try {
  run(`git rev-parse --verify ${tagName}`);
  console.error(`Tag ${tagName} already exists.`);
  process.exit(1);
} catch {
  // The tag does not exist yet, continue.
}

run(`pnpm version:bump ${version}`);
run('pnpm test');
run('pnpm build');
run('git add -A');
run(`git commit -m "chore: release ${tagName}"`);
run(`git tag -a ${tagName} -m "${tagName}"`);

console.log(`\nRelease commit and tag ready: ${tagName}`);
console.log('Push with: git push origin main --follow-tags');
