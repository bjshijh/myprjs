var path = require('path');
var fs = require('fs');
var uuid = require('uuid');

var FileUploader= function () {
}

FileUploader.prototype.saveFile = function (file, tgtPath, callback ) {
    var filename = file.name;
    var filetype = file.type;
    
    // extention name
    var fts = filetype.split("/");
    var ext = fts[fts.length-1 ];
    var fname = uuid.v4() + '.' + ext;
    
    var tgtpath = tgtPath+ '/'+fname; 
    fs.rename(file.path, tgtpath, function (err, result) {
        callback( err, fname );
    } );
}


module.exports = new FileUploader();