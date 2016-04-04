const crypto = require('crypto');

module.exports = function(req, res, next){
  var hash = crypto.createHash('sha1');
  var write = res.write, end = res.end;
  var ended = false;
  /**
   * [function description]
   * @param  {[type]} chunk    [description]
   * @param  {[type]} encoding [description]
   * @return {[type]}          [description]
   */
  res.write = function(chunk, encoding){
    if (ended) {
      return false;
    }
    hash.update(chunk, encoding);
    write.apply(res, arguments);
  };
  /**
   * [function description]
   * @param  {[type]} chunk    [description]
   * @param  {[type]} encoding [description]
   * @return {[type]}          [description]
   */
  res.end = function(chunk, encoding){
    if(chunk) hash.update(chunk, encoding);
    var str = hash.digest('hex');
    ended = true;
    if(str == req.headers[ 'if-none-match' ]){
      res.writeHead(304);
      end.call(res);
      return res;
    }
    res.setHeader('ETag', str);
    end.apply(res, arguments);
  };
  next();
};
