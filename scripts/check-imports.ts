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
    } else if (stat.isFile() && /\.(tsx|ts|js|jsx)$/.test(file)) {
      callback(filePath)
    }
  })
}

console.log('Searching for toast imports...')
walkDir(projectRoot, filePath => {
  const content = fs.readFileSync(filePath, 'utf8')
  if (content.includes('toast-context') || content.includes('useToast') || content.includes('ToastProvider')) {
    const lines = content.split('\n')
    lines.forEach((line, index) => {
      if (line.includes('import') && (line.includes('toast-context') || line.includes('useToast') || line.includes('ToastProvider'))) {
        console.log(`${path.relative(projectRoot, filePath)}:${index + 1}: ${line.trim()}`)
      }
    })
  }
})
