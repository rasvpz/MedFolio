const sizeOf = require("image-size");                 
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

module.exports.checkFoliofitFitnessCLubFile = (req, res, next) => {
    function unlinkImage(video, thumbnail,gif) {    
        if (video) {
            video.map(async(e) => {
                if (fs.existsSync(`./public/images/foliofit/${e.filename}`)){
                    await unlinkAsync(e.path);
                }
            });
        }
        if (thumbnail) {
            thumbnail.map(async(e) => {
                if (fs.existsSync(`./public/images/foliofit/${e.filename}`)){
                    await unlinkAsync(e.path);
                }
            });
        }
        if (gif) {
            gif.map(async(e) => {
                if (fs.existsSync(`./public/images/foliofit/${e.filename}`)){
                    await unlinkAsync(e.path);
                }
            });
        }
    }

    if(req.files.video){
        if (
            req.files.video[0].mimetype === "video/mp4" ||
            req.files.video[0].mimetype === "video/avi" ||
            req.files.video[0].mimetype === "video/x-flv" ||
            req.files.video[0].mimetype === "video/x-ms-wmv" ||
            req.files.video[0].mimetype === "video/3gpp"
        ){}else{
            unlinkImage(req.files.video,req.files.thumbnail,req.files.gif)
            return  res.status(422).json({
             status: false,
             data: "Video file type is not supported check with another file type. ",
         });
        }
    }
    if(req.files.thumbnail){
        if (
            req.files.thumbnail[0].mimetype == "image/png" ||
            req.files.thumbnail[0].mimetype == "image/jpeg" ||
            req.files.thumbnail[0].mimetype == "image/svg+xml" ||
            req.files.thumbnail[0].mimetype == "image/jpg" ||
            req.files.thumbnail[0].mimetype == "image/gif"
        ){
           let dimensions = sizeOf(req.files.thumbnail[0].path);           
            if (dimensions.width != 1501 && dimensions.height != 815) {   
                unlinkImage(req.files.video,req.files.thumbnail,req.files.gif)
                return  res.status(422).json({
                    status: false,
                    data: "please upload thumbnail with size(1501 * 815)",
                });
            }
        }else { 
            unlinkImage(req.files.video,req.files.thumbnail,req.files.gif)
            return  res.status(422).json({
                status: false,
                data: "Image file type is not supported check with another file type. ",
            });
        }
    }
    next()
}