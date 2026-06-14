import fs from 'fs'
import path from 'path'

const projectRoot = process.cwd()

function walkDir(dir: string, callback: (filePath: string) => void) {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        walkDir(filePath, callback)
      }
    } else if (stat.isFile() && file.endsWith('layout.tsx')) {
      callback(filePath)
    }
  })
}

console.log('Finding all layout.tsx files...')
walkDir(path.join(projectRoot, 'app'), filePath => {
  console.log(path.relative(projectRoot, filePath))
  const content = fs.readFileSync(filePath, 'utf8')
  if (!content.includes('ToastProvider')) {
    console.log(`  -> Does NOT include ToastProvider`)
  } else {
    console.log(`  -> Includes ToastProvider`)
  }
})
