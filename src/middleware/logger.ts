const log = (req: any, res: any, next: any) => {
  console.log("logging")
  next()
}

module.exports = log