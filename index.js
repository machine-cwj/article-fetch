const Article = require('./article')

// 大王饶命
const article_url = 'https://www.biquge.info/40_40289/'
// 我是大玩家
// const article_url = 'https://m.biqudu.com/booklist/48192.html'
// 英雄联盟之灾变时代
//const article_url = 'https://m.biqudu.com/booklist/16849.html'

// 创建一个抓取进程
const _process = new Article(article_url)

// 注册笔趣阁解析
_process.registry('www.biquge.info', require('./libs/biquge'))
// 注册m.biquge.com
_process.registry('m.biqudu.com', require('./libs/mbiquge'))

// 开始抓取
console.log('Start')
_process.process().catch(e => {
  console.error(e)
}).then(() => {
  _process.close()
  console.log('Finish.')
})
