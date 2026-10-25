import { build } from 'vite'
import { copyFile, cp, readFile, rm, writeFile } from 'node:fs/promises'

await copyFile('index.template.html', 'index.html')
await build()

const builtIndex = await readFile('dist/index.html', 'utf8')
await writeFile('index.html', builtIndex)
await rm('assets', { recursive: true, force: true })
await cp('dist/assets', 'assets', { recursive: true, force: true })