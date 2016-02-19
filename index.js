var path           = require('path');
var through2       = require('through2');
var gutil          = require('gulp-util');
var assign         = require('object-assign');

var PluginError    = gutil.PluginError;

module.exports = function (options) {
    options = assign({}, {
        data: {},
    }, options);

    function convert(contents){
        var str = contents.toString('utf8');

        Object.keys(options.data).forEach(function(key){
            var regex = new RegExp(''+ key +'','gi');
            str = str.replace(regex,function($0,$1) {
                return options.data[key];
            });
        });
        return new Buffer(str);
    }    

    return through2.obj(function(file, enc, cb) {
        if (file.isNull()) {
          return cb(null, file);
        }

        if (file.isStream()) {
          return cb(new PluginError('gulp-file-ver', 'Streaming not supported'));
        }
        var str = file.contents.toString();
        file.contents = convert(file.contents);
        this.push(file);
        cb();
    });
}
