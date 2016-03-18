const crypto = require('crypto');

module.exports = function(req, res, next){
  var hash = crypto.createHash('sha1');
  var write = res.write, end = res.end;
  /**
   * [function description]
   * @param  {[type]} chunk    [description]
   * @param  {[type]} encoding [description]
   * @return {[type]}          [description]
   */
  res.write = function(chunk, encoding){
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
