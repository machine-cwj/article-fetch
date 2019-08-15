module.exports = text => {
  // 转义文字
  let result = text.replace(/\s+/g, '')
      .replace(/\<br\s*\/?\>/g, '\n')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\n+/g, '\n')
  // 移除注释内容
  result = result.replace(/<!--[\s\S]*?-->/g, '')
  return result
}
