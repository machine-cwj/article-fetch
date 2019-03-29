const request = require('request')
const fs = require('fs')
const _url = require('url')

module.exports = class Article {
  get (url) {
    return new Promise((resolve, reject) => {
      request(url, { rejectUnauthorized: false }, (error, response) => {
        if (error) reject(error)
        else {
          const { statusCode, statusMessage, body } = response
          resolve({ code: statusCode, data: body, msg: statusMessage })
        }
      })
    })
  }

  // 将对应的网址注册到对象中
  registry (host, option) {
    this.options = this.options || {}
    this.options[host] = option
  }

  /**
   * 解析目录网页，提取小说标题和目录列表
   */
  parseArticle () {
    return this.get(this.url).then(({ data }) => {
      this.title = this.options[this.urlObj.host].title(data)
      this.chapterList = this.options[this.urlObj.host].chapterList(data)
    })
  }

  /**
   * 解析章节，获取章节标题和内容
   */
  async parseChapter () {
    for (let tmp of this.chapterList) {
      let { data } = await this.get(_url.resolve(this.url, tmp))
      this.storage({
        title: this.options[this.urlObj.host].chapterTitle(data),
        content: this.options[this.urlObj.host].chapterContent(data)
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
  process (url) {
    Object.defineProperties(this, {
      url: { get: () => url },
      urlObj: { get: () => _url.parse(url) }
    })
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
