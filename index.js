const Article = require('./article')

// 章节目录地址
const article_url = 'https://www.biquge.info/40_40289/'

// 纵横小说
// const options = require('./zongheng')
const options = require('./biquge')

// 创建一个抓取进程
const _process = new Article(article_url, options)
// 开始抓取
console.log('Start')
_process.process().catch(e => {
  console.error(e)
}).then(() => {
  _process.close()
  console.log('Finish.')
})
