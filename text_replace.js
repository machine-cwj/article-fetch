module.exports = text => text.replace(/\s+/, '').replace(/\<br\s*\/?\>/, '\n').replace('&lt;', '<').replace('&gt;', '>').replace('&nbsp;', ' ')
