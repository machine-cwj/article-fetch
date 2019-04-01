const Article = require('./article')

// 创建一个抓取进程
const _process = new Article()
_process.registry('www.biquge.info', require('./libs/biquge'))
_process.registry('www.biquge.cc', require('./libs/biqugecc'))
_process.registry('m.biqudu.com', require('./libs/mbiquge'))
_process.registry('book.zongheng.com', require('./libs/zongheng'))

// 开始抓取
console.log('Start')
_process.process('https://www.biquge.cc/html/54/54656/').catch(e => {
  console.error(e)
}).then(() => {
  _process.close()
  console.log('Finish.')
})
