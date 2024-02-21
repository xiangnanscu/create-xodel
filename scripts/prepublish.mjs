#!/usr/bin/env zx
import 'zx/globals'

await $`pnpm build`
await $`pnpm snapshot`

let { version } = JSON.parse(await fs.readFile('./package.json'))

const playgroundDir = path.resolve(__dirname, '../playground/')
cd(playgroundDir)

// await $`pnpm install`
await $`git add -A .`
try {
  await $`git commit -m "version ${version} snapshot" > /dev/null 2>&1`
} catch (e) {
  if (!e.stdout.includes('nothing to commit')) {
    throw e
  }
}

await $`git push -f origin HEAD:main`

const projectRoot = path.resolve(__dirname, '../')
cd(projectRoot)
await $`git add playground`
await $`git commit -m 'chore: update snapshot' --allow-empty`
await $`git push`
