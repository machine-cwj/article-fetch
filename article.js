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
  async parseArticle () {
    let { data } = await this.get(this.url)
    this.title = this.option.title(data)
    this.chapterList = this.option.chapterList(data)
  }

  /**
   * 解析章节，获取章节标题和内容
   */
  async parseChapter () {
    for (let tmp of this.chapterList) {
      let { data } = await this.get(_url.resolve(this.url, tmp))
      this.storage({
        title: this.option.chapterTitle(data),
        content: this.option.chapterContent(data)
      })
    }
  }

  /**
   * 保存章节内容到流
   * @param {*} chapter 章节内容，含title和content属性
   */
  storage (chapter) {
    this.stream.write(`${chapter.title}\n\n${chapter.content}\n\n`)
  }

  /**
   * 开始抓取
   */
  async process (url) {
    this.url = url
    this.option = this.options[_url.parse(url).host]
    if (!this.option)
      throw Error('The host does not match the option.')
    await this.parseArticle()
    await this.readyStream()
    await this.parseChapter()
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
