module.exports = text => {
  return text.replace(/\s+/g, '').replace(/\<br\s*\/?\>/g, '\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\n+/g, '\n')
}
