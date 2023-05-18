class Exception extends Error {
  constructor (code, msg) {
    super(msg)
    this.code = code
    this.msg = msg
    this.name = 'Exception'
  }
}

module.exports = Exception