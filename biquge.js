const _replace = require('./text_replace')

module.exports = {
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
    let listHtml = /<div[^>]*id="list"[^>]*>[\s\S]*<\/div>/.exec(html)[0]
    let aregx = /<a[^>]*href="([^"]*)"[^>]*>[^<>]*<\/a>/g
    let tmp = null
    let list = []
    while (tmp = aregx.exec(listHtml)) {
      list.push(tmp[1])
    }
    console.log(`Chapter Count: ${list.length}`)
    return list
  },
  /**
   * 提取章节标题
   */
  chapterTitle: html => {
    let title = _replace(/<h1>([\S\s]*)<\/h1>/.exec(html)[1])
    console.log(`Chapter Title: ${title}`)
    return title
  },
  /**
   * 提取章节内容
   */
  chapterContent: html => {
    return _replace(/<div[^>]*id="content"[^>]*>([\s\S]*?)<\/div>/.exec(html)[1])
  }
}
