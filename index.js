const Article = require('./article')

// 章节目录地址
const article_url = 'http://book.zongheng.com/showchapter/708968.html'

const zhuang_huan = [
  { regx: /&nbsp;/g, text: ' ' },
  { regx: /<br[^>]*\/?>/g, text: '\n' },
  { regx: /&lt;/g, text: '<' },
  { regx: /&gt;/g, text: '>' },
  { regx: /&amp;/g, text: '&' },
  { regx: /&quot;/g, text: '"' },
  { regx: /&copy;/g, text: '©' },
  { regx: /&reg;/g, text: '®' },
  { regx: /&times;/g, text: '×' },
  { regx: /&divide;/g, text: '÷' }
]

const _replace = text => {
  let tmp = text
  zhuang_huan.forEach(item => {
    tmp = tmp.replace(item.regx, i.text)
  })
  return tmp
}

const options = {
  /**
   * 解析标题处理函数
   * @param {*} html 章节目录页面html
   */
  title: html => {
    let title = _replace(/<h1>([\S\s]*)<\/h1>/.exec(html)[1])
    console.log(`Title: ${title}`)
    return title
  },
  /**
   * 提取章节列表url
   */
  chapterList: html => {
    let listHtml = /<ul[^>]*class="chapter-list[\s\S]*"[^>]*>[\s\S]*<\/ul>/.exec(html)[0]
    let aregx = /<a[^>]*href="([^"]*)"[^>]*>[^<>]*<\/a>/g
    let tmp = null
    let list = []
    while (tmp = aregx.exec(listHtml)) {
      list.push(_replace(tmp[1]))
    }
    console.log(`Chapter Count: ${list.length}`)
    return list
  },
  /**
   * 提取章节标题
   */
  chapterTitle: html => {
    let title = _replace(/<div[^>]*class="title_txtbox"[^>]*>([^<>]*)<\/div>/.exec(html)[1])
    console.log(`Chapter Title: ${title}`)
    return title
  },
  /**
   * 提取章节内容
   */
  chapterContent: html => {
    let contentHtml = /<div[^>]*class="content"[^>]*>([\s\S]*?)<\/div>/.exec(html)[1]
    let regx = /<p>([\s\S]*?)<\/p>/g
    let list = []
    let tmp = null
    while (tmp = regx.exec(contentHtml)) {
      list.push(`\t${_replace(tmp[1].trim())}`)
    }
    return list.join('\n')
  }
}

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
