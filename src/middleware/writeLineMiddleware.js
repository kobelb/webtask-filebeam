// assuming *nix at this point, I wasn't able to determine
// the requestor's OS based on the user-agent because curl doesn't send that part
const newline = '\n';

module.exports = function writeLineMiddleware (req, res, next) {
  res.writeLine = function (txt) {
    txt = txt || '';
    res.write(txt + newline);
  };

  next();
}