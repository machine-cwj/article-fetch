const request = require('request')
const fs = require('fs')
const url = require('url')

export default class Article {
  constructor (url, options) {
    Object.defineProperties(this, {
      url: { get: () => url },
      options: { get: () => options }
    })
  }

  get (url) {
    return new Promise((resolve, reject) => {
      request(url, (error, {statusCode, statusMessage, body}) => {
        if (error) reject(error)
        else resolve({ code: statusCode, data: body, msg: statusMessage })
      })
    })
  }

  /**
   * 解析目录网页，提取小说标题和目录列表
   */
  parseArticle () {
    return this.get(this.url).then(({data}) => {
      this.title = this.options.title(data)
      this.chapterList = this.options.chapterList(data)
    })
  }

  /**
   * 解析章节，获取章节标题和内容
   */
  async parseChapter () {
    for (let tmp of this.chapterList) {
      let {data} = await this.get(url.resolve(this.url, tmp))
      this.storage({
        title: this.options.chapterTitle(data),
        content: this.options.chapterContent(data)
      })
    }
  }

  /**
   * 保存章节内容到流
   * @param {*} chapter 章节内容，含title和content属性
   */
  storage (chapter) {
    this.stream.write(`${chapter.title}\n${chapter.content}\n`)
  }

  /**
   * 开始抓取
   */
  process () {
    return this.parseArticle().then(() => this.readyStream()).then(() => {
      return this.parseChapter()
    })
  }

  /**
   * 准备流
   */
  readyStream () {
    return new Promise((resolve, reject) => {
      let stream = fs.createWriteStream(`./${this.title}.txt`, 'utf8')
      stream.on('error', reject)
      this.stream = stream
      resolve()
    })
  }

  /**
   * 关闭，抓取完成后执行
   */
  close () {
    if (this.stream) {
      this.stream.close()
      this.stream.destroy()
    }
  }
}
