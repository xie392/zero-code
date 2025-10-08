const fs = require('fs')
const path = require('path')

/**
 * 自动更新 API index.ts 文件，添加 export * 语句
 * 这个脚本会在 openapi2ts 生成后自动运行
 */
function updateApiIndex() {
    const apiDir = path.join(__dirname, '../src/api')
    const indexPath = path.join(apiDir, 'index.ts')
    
    if (!fs.existsSync(indexPath)) {
        console.log('❌ API index.ts 文件不存在')
        return
    }
    
    let content = fs.readFileSync(indexPath, 'utf-8')
    
    // 检查是否已经包含 export * 语句
    if (content.includes('export * from')) {
        console.log('✅ API index.ts 已经包含 export * 语句')
        return
    }
    
    // 提取所有的 import 语句
    const importRegex = /import \* as (\w+) from '\.\/(\w+)'/g
    const imports = []
    let match
    
    while ((match = importRegex.exec(content)) !== null) {
        imports.push({
            name: match[1],
            file: match[2]
        })
    }
    
    if (imports.length === 0) {
        console.log('❌ 未找到任何 import 语句')
        return
    }
    
    // 构建新的内容
    const lines = content.split('\n')
    const importEndIndex = lines.findIndex(line => line.startsWith('export default'))
    
    if (importEndIndex === -1) {
        console.log('❌ 未找到 export default 语句')
        return
    }
    
    // 在 export default 之前插入新的导出语句
    const newLines = [
        ...lines.slice(0, importEndIndex),
        '',
        '// 导出所有模块，支持 import { functionName } from \'@/api\' 的方式',
        ...imports.map(imp => `export * from './${imp.file}'`),
        '',
        '// 同时保持原有的命名空间导出方式',
        `export { ${imports.map(imp => imp.name).join(', ')} }`,
        '',
        '// 默认导出（保持向后兼容）',
        ...lines.slice(importEndIndex)
    ]
    
    const newContent = newLines.join('\n')
    fs.writeFileSync(indexPath, newContent, 'utf-8')
    
    console.log('✅ 成功更新 API index.ts 文件，现在支持直接导入函数')
    console.log(`📦 导出的模块: ${imports.map(imp => imp.name).join(', ')}`)
}

// 如果直接运行此脚本
if (require.main === module) {
    updateApiIndex()
}

module.exports = { updateApiIndex }