const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const sizeOf = require("image-size");
const AdsFoliofitSlider1 = require("../../models/ads/foliofit/slider1");
const AdsFoliofitSlider2 = require("../../models/ads/foliofit/slider2");
const AdsFoliofitSlider3 = require("../../models/ads/foliofit/slider3");
const AdsFoliofitBanner = require("../../models/ads/foliofit/banner");
const AdsCartHandpick = require("../../models/ads/cart/handpick");
const adsAd1Subscription = require("../../models/ads/cart/ad1Subscription")
const adsCartOrderReview = require("../../models/ads/cart/orderreview")
const adsOrderMedicine3Icon = require("../../models/ads/cart/ordermedicine3icon")
const adsHowToOrderMedicine = require("../../models/ads/cart/howToOrderMedicine")
const adsOrderMedicineSlider = require("../../models/ads/cart/ordermedicineslider")
const adsPartnerPromotion = require("../../models/ads/cart/partnerPromotion")
const adsPromotion = require("../../models/ads/cart/promotion")

const ProCategory = require("../../models/proCategory");
const Product = require("../../models/Product");
const imgPath = process.env.BASE_URL;



const fitness = "fitness";
const yoga = "yoga";
const nutrichart = "nutrichart";
var dimensions = "";
var imageType = "";
var imageError = "false";

function checkImageSize(imageType, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (imageType == "handpick") {
        if (dimensions.width != 1376 && dimensions.height != 675) {
            imageError = "Please upload image of size 1376 * 675";
        }
    } else if (imageType == "ad1") {
        if (dimensions.width != 1500 && dimensions.height != 454) {
            imageError = "Please upload image of size 1500 * 454";
        }
    } else if (imageType == "subscription") {
        if (dimensions.width != 786 && dimensions.height != 122) {
            imageError = "Please upload image of size 786 * 122";
        }
    } else if (imageType == "orderreview") {
        if (dimensions.width != 1508 && dimensions.height != 630) {
            imageError = "Please upload image of size 1508 * 630";
        }
    }else if (imageType == "orderreview2") {
        if (dimensions.width != 742 && dimensions.height != 266) {
            imageError = "Please upload image of size 742 * 266";
        }
    }
     else if (imageType == "orderMedicine3Icon") {
        if (dimensions.width != 688 && dimensions.height != 186) {
            imageError = "Please upload image of size 688 * 186";
        }
    } else if (imageType == "howToOrderMedicineThumbnail") {
        if (dimensions.width != 1076 && dimensions.height != 444) {
            imageError = "Please upload image of size 1076 * 444";
        }
    } else if (imageType == "OrderMedicineSlider") {
        if (dimensions.width != 242 && dimensions.height != 298) {
            imageError = "Please upload image of size 242 * 298";
        }
    } else if (imageType == "PartnerPromotion") {
        if (dimensions.width != 278 && dimensions.height != 248) {
            imageError = "Please upload image of size 278 * 248";
        }
    } else if (imageType == "Promotion") {
        if (dimensions.width != 646 && dimensions.height != 124) {
            imageError = "Please upload image of size 646 * 124";
        }
    }  else {
        imageError = "false";
    }
    if (imageError != "false") {
        imageSizeError(fileInfo);
    }
}

function imageSizeError(fileInfo) {
    fs.unlink(fileInfo.path, (err) => {
        if (err) throw err;
    });
}

module.exports = {

    /* Ads cart handpick
    ============================================= */
    getAdsCartHandpick: async (req, res, next) => {
        try {
            let result = await AdsCartHandpick.find(
                { sliderType: "handpick", isDisabled: false },
                {
                    type: 1,
                    typeId: 1,
                    // image: 1,
                    sliderType: 1,
                }
            ).populate({
                path: "typeId",
                select: ["_id", "title", "image"],
              })
              console.log('result',result)
              for (i = 0; i < result.length; i++) {
                result[i].typeId.image= process.env.BASE_URL.concat(result[i].typeId.image);
            }
            res.status(200).json({
                status: true,
                data: result,
            });
            // if (!result) {
            //     res.status(200).json({
            //         status: false,
            //         data: "Invalid Id",
            //     });
            // } else {
            //     if (result.type == 0) {
            //         let product = await Product.findOne(
            //             {
            //                 _id: mongoose.Types.ObjectId(result.typeId),
            //             },
            //             {
            //                 title: 1,
            //                 image: { $concat: [imgPath, "$image"] }
            //             }
            //         );
            //         if (product) {
            //             result.typeTitle = product.title;
            //             result.typeImage = product.image;

            //         }
            //     }
            //     if (result.type == 1) {
            //         let category = await ProCategory.findOne(
            //             {
            //                 _id: mongoose.Types.ObjectId(result.typeId),
            //             },
            //             {
            //                 title: 1,
            //                 image: { $concat: [imgPath, "$image"] }
            //             }
            //         );
            //         if (category) {
            //             result.typeTitle = category.title;
            //             result.typeImage = product.image;

                        
                        
            //         }
            //     }
            //     res.status(200).json({
            //         status: true,
            //         data: result,
            //     });
            // }
            // .populate({
            //     path: "typeId",
            //     select: ["_id", "title", "image"],
            //   })
            //   for (i = 0; i < result.length; i++) {
            //     result[i].typeId.image= process.env.BASE_URL.concat(result[i].typeId.image);
            // }
        } catch (error) {
            next(error);
        }
    },
    editAdsCartHandpick: async (req, res, next) => {
        try {
            let data = req.body;
            console.log('handpick',data)
            // console.log('handpick',existingHandpick)
                if (data.sliderId) {
                    let slider = await AdsCartHandpick.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                    if (slider) {
                        // if (req.file) {
                        //     data.image = `ads/${req.file.filename}`;
                        //     // deleting old image
                        //     let splittedImageRoute = slider.image.split("/");
                        //     let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        //     if (fs.existsSync(path)) {
                        //         fs.unlink(path, function (err) {
                        //             if (err) throw err;
                        //         });
                        //     }
                        // }
                        data.updatedAt = new Date();
                        let existingAds = await AdsCartHandpick.findOne({
                            type: mongoose.Types.ObjectId(req.body.type),
                            typeId: mongoose.Types.ObjectId(req.body.typeId),
                            sliderType :slider.sliderType,
                            _id: { $ne: slider._id } 
                        });
                        if(!existingAds){
                        AdsCartHandpick.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
                            .then((response) => {
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Not updated",
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "already existingAds",
                            });
                        }
                    } else {
                        // if (req.file) {
                        //     await unlinkAsync(req.file.path);
                        // }
                        res.status(200).json({
                            status: false,
                            data: "invalid Slider Id",
                        });
                    }
                } else {
                    let existingHandpick = await AdsCartHandpick.findOne({
                        typeId:data.typeId,
                    },{
                        type:data.type,
                    });
                    if (!existingHandpick) {
                        data.sliderType = "handpick";
                        let schemaObj = new AdsCartHandpick(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "Handpick added successfully",
                                });
                            })
                    }
                 else {
                    res.status(200).json({
                        status: false,
                        data: "Handpick already exist",
                    });
                }
                    // if (req.file) {
                    //     await unlinkAsync(req.file.path);
                    // }
                    // res.status(200).json({
                    //     status: false,
                    //     data: "Handpick already exist",
                    // });
                    
                }
            
                // if (req.file) {
                //     var fileInfo = req.file;
                //     imageType = "ad1";
                //     checkImageSize(imageType, fileInfo);
                //     if (imageError != "false") {
                //         res.status(200).json({
                //             status: false,
                //             data: imageError,
                //         });
                //         imageError = "false";
                //     } else {
                //         data.image = `ads/${req.file.filename}`;
                        
                            // .catch(async (error) => {
                            //     if (req.file) {
                            //         await unlinkAsync(req.file.path);
                            //     }

                                // res.status(200).json({
                                //     status: false,
                                //     data: error,
                                // });
                            // });
                    // }
                // } else {
                //     res.status(200).json({
                //         status: false,
                //         data: "Please upload image",
                //     });
                // }
               
            
        } catch (error) {
            next(error);
        }
    },
    deleteAdsCartHandpick: async (req, res, next) => {
        try {
            // let Type= await AdsCartHandpick.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            // if (Type) {
                AdsCartHandpick.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {
                        // let splittedImageRoute = Type.image.split("/");
                        // let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        // if (fs.existsSync(path)) {
                        //     fs.unlink(path, function (err) {
                        //         if (err) throw err;
                        //         console.log("old image deleted!");
                        //     });
                        // }

                        res.status(200).json({
                            status: true,
                            data: " removed successfully",
                        });
                    })
                    .catch((error) => {
                        res.status(200).json({
                            status: false,
                            data: error,
                        });
                    });
            // } else {
            //     res.status(200).json({
            //         status: false,
            //         data: "invalid Type",
            //     });
            // }
        } catch (error) {
            next(error);
        }
    },
      /* Ads  ad1Subscription 
    ============================================= */
    editAd1Subscription: async (req, res, next) => {
        try {
            console.log('!@#$%',req.body)
              let types = ["ad1", "subscription","orderreview2"];
              var type = types.find((e) => e === req.body.type);
              if (type) {
                var ExtData = await adsAd1Subscription.findOne({_id:mongoose.Types.ObjectId(req.body._id)});
                if (!ExtData) {
                    let data = req.body;
                if (req.file) {
                    var fileInfo = req.file;
                    imageType = type;
                    checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        let schemaObj = new adsAd1Subscription(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: " added successfully",
                                });
                            })
                            .catch(async (error) => {
                                if (req.file) {
                                    await unlinkAsync(req.file.path);
                                }
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Please upload image",
                    });
                }
                  
                } else {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = type;
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            req.body.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = ExtData.image.split("/");
                            fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                    }
                    if (imageError == "false") {
                        req.body.updatedAt = new Date();
                        adsAd1Subscription.updateOne({ _id:mongoose.Types.ObjectId(req.body._id) }, req.body)
                            .then((response) => {
                                console.log('response',response);
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated successfully",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Not updated",
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                }
              } else {
                res.status(200).json({
                  error: true,
                  message: "invalid type",
                });
              }
          } catch (error) {
            next(error);
          }
        
    },
    getAd1Subscription: async (req, res, next) => {
        try {
            let result = await adsAd1Subscription.find(
                { isDisabled: false },
                {
                    type: 1,
                    image: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].image=process.env.BASE_URL.concat(result[i].image)
            }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    deleteAd1Subscription: async (req, res, next) => {
        try {
            let Type= await adsAd1Subscription.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                adsAd1Subscription.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {
                        let splittedImageRoute = Type.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: " removed successfully",
                        });
                    })
                    .catch((error) => {
                        res.status(200).json({
                            status: false,
                            data: error,
                        });
                    });
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid Type",
                });
            }
        } catch (error) {
            next(error);
        }
        
    },
     /* Ads profile order review
    ============================================= */
    getOrderReview: async (req, res, next) => {
        try {
            let result = await adsCartOrderReview.find(
                { sliderType: "orderreview", isDisabled: false },
                {
                    type: 1,
                    typeId: 1,
                    image: 1,
                    sliderType: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].image=process.env.BASE_URL.concat(result[i].image)
            }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editOrderReview: async (req, res, next) => {
        try {
            let data = req.body;
                if (data.sliderId) {
                    let slider = await adsCartOrderReview.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                    if (slider) {
                        if (req.file) {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                        data.updatedAt = new Date();
                        adsCartOrderReview.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
                            .then((response) => {
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Not updated",
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        if (req.file) {
                            await unlinkAsync(req.file.path);
                        }
                        res.status(200).json({
                            status: false,
                            data: "invalid Slider Id",
                        });
                    }
                } else {
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = "orderreview";
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            imageError = "false";
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            data.sliderType = "orderreview";
                            let schemaObj = new adsCartOrderReview(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "order review added successfully",
                                    });
                                })
                                .catch(async (error) => {
                                    if (req.file) {
                                        await unlinkAsync(req.file.path);
                                    }
    
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Please upload image",
                        });
                    }
                }
            
        } catch (error) {
            next(error);
        }
    },
    deleteOrderReview: async (req, res, next) => {
        try {
            let Type= await adsCartOrderReview.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                adsCartOrderReview.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {
                        let splittedImageRoute = Type.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: " removed successfully",
                        });
                    })
                    .catch((error) => {
                        res.status(200).json({
                            status: false,
                            data: error,
                        });
                    });
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid Type",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    //orderMedicine3Icon
    editOrderMedicine3Icon: async (req, res, next) => {
        try {
            console.log('!@#$%',req.body)
              let types = "orderMedicine3Icon";
              var type = types === req.body.type;
              if (type) {
                var ExtData = await adsOrderMedicine3Icon.findOne({_id:mongoose.Types.ObjectId(req.body._id)});
                if (!ExtData) {
                    let data = req.body;
                if (req.file) {
                    var fileInfo = req.file;
                    console.log('fifileInfo',fileInfo)
                    imageType = req.body.type;
                    console.log('type',type)
                    checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        let schemaObj = new adsOrderMedicine3Icon(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: " added successfully",
                                });
                            })
                            .catch(async (error) => {
                                if (req.file) {
                                    await unlinkAsync(req.file.path);
                                }
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Please upload image",
                    });
                }
                  
                } else {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = type;
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            req.body.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = ExtData.image.split("/");
                            fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                    }
                    if (imageError == "false") {
                        req.body.updatedAt = new Date();
                        adsOrderMedicine3Icon.updateOne({ _id:mongoose.Types.ObjectId(req.body._id) }, req.body)
                            .then((response) => {
                                console.log('response',response);
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated successfully",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Not updated",
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                }
              } else {
                res.status(200).json({
                  error: true,
                  message: "invalid type",
                });
              }
          } catch (error) {
            next(error);
          }
        
    },
    getOrderMedicine3Icon: async (req, res, next) => {
        try {
            let result = await adsOrderMedicine3Icon.find(
                { isDisabled: false },
                {
                    name: 1,
                    image: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].image=process.env.BASE_URL.concat(result[i].image)
            }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
      /* Ads Home In The AdsCartHowToOrderMedicine
    ============================================= */
    addAdsCartHowToOrderMedicine: async (req, res, next) => {
        try {
            // let data = req.body;
            if (req.files.video && req.files.thumbnail) {
                var fileInfoVideo = {};
                var fileInfoThumbnail = {};
                fileInfoVideo = req.files.video[0];
                // imageType = "spotlightImage";
                // checkImageSize(imageType, fileInfoImage);
                fileInfoThumbnail = req.files.thumbnail[0];
                imageType = "howToOrderMedicineThumbnail";
                checkImageSize(imageType, fileInfoThumbnail);

                let data = {
                    
                    type: req.body.type,
                    video: `ads/${fileInfoVideo.filename}`,
                    thumbnail: `ads/${fileInfoThumbnail.filename}`,
                };
                if (imageError != "false") {
                    if (req.files.thumbnail) {
                        req.files.thumbnail.map(async (e) => {
                            await unlinkAsync(e.path);
                        });
                    }
                    if (req.files.video) {
                        req.files.video.map(async (e) => {
                            await unlinkAsync(e.path);
                        });
                    }
                    res.status(200).json({
                        status: false,
                        data: imageError,
                    });
                    imageError = "false";
                } else {
                    let schemaObj = new adsHowToOrderMedicine(data);
                    schemaObj
                        .save()
                        .then((response) => {
                            res.status(200).json({
                                status: true,
                                data: "cart ads HowToOrderMedicine added successfully",
                            });
                        })
                        .catch(async (error) => {
                            if (req.files.thumbnail) {
                                req.files.thumbnail.map(async (e) => {
                                    await unlinkAsync(e.path);
                                });
                            }
                            if (req.files.video) {
                                req.files.video.map(async (e) => {
                                    await unlinkAsync(e.path);
                                });
                            }
                            res.status(200).json({
                                status: false,
                                data: error,
                            });
                        });
                }
            } else {
                if (req.files.thumbnail) {
                    req.files.thumbnail.map(async (e) => {
                        await unlinkAsync(e.path);
                    });
                }
                if (req.files.video) {
                    req.files.video.map(async (e) => {
                        await unlinkAsync(e.path);
                    });
                }
                res.status(200).json({
                    status: false,
                    data: "Please upload video or image",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getAdsCartHowToOrderMedicine: async (req, res, next) => {
        try {
            let result = await adsHowToOrderMedicine.find(
                { isDisabled: false },
                {
                    type: 1,
                    video: 1,
                    thumbnail: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].thumbnail=process.env.BASE_URL.concat(result[i].thumbnail)
                result[i].video=process.env.BASE_URL.concat(result[i].video)
            }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editAdsCartHowToOrderMedicine: async (req, res, next) => {
        try {
            let data = req.body;
            var fileInfo = {};
            if (data.HowToOrderMedicineId) {
                let HowToOrderMedicine = await adsHowToOrderMedicine.findOne({ _id: mongoose.Types.ObjectId(data.HowToOrderMedicineId) });
                if (HowToOrderMedicine) {
                    if (req.files.video) {
                        var fileInfoVideo = {};
                        fileInfoVideo = req.files.video[0];
                        // imageType = "spotlightImage";
                        // checkImageSize(imageType, fileInfoImage);
                        // if (imageError == "false") {
                            data.video = `ads/${fileInfoVideo.filename}`;
                            // deleting old image
                            let splittedVideoRoute = HowToOrderMedicine.video.split("/");
                            console.log("splitted::", splittedVideoRoute);
                            if (
                                fs.existsSync(
                                    `./public/images/ads/${splittedVideoRoute[1]}`
                                )
                            ) {
                                fs.unlink(
                                    `./public/images/ads/${splittedVideoRoute[1]}`,
                                    function(err) {
                                        if (err) throw err;
                                        console.log("old Video deleted!");
                                    }
                                );
                            }                          
                        // }
                    }
                    if (req.files.thumbnail) {
                        var fileInfoThumbnail = {};
                        fileInfoThumbnail = req.files.thumbnail[0];
                        imageType = "howToOrderMedicineThumbnail";
                        checkImageSize(imageType, fileInfoThumbnail);
                        if (imageError == "false") {
                            data.thumbnail = `ads/${fileInfoThumbnail.filename}`;
                            // deleting old thumbnail
                            let splittedThumbnailRoute = HowToOrderMedicine.thumbnail.split("/");
                            if (
                                fs.existsSync(
                                    `./public/images/ads/${splittedThumbnailRoute[1]}`
                                )
                            ) {
                                fs.unlink(
                                    `./public/images/ads/${splittedThumbnailRoute[1]}`,
                                    function(err) {
                                        if (err) throw err;
                                        console.log("old Thumbnail deleted!");
                                    }
                                );
                            }
                         
                        }
                    }
                    if (imageError == "false") {
                        data.updatedAt = new Date();
                        adsHowToOrderMedicine.updateOne({ _id: mongoose.Types.ObjectId(data.HowToOrderMedicineId) }, data)
                            .then((response) => {
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated successfully",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Not updated",
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        if (req.files.thumbnail) {
                            req.files.thumbnail.map(async (e) => {
                                await unlinkAsync(e.path);
                            });
                        }
                        if (req.files.video) {
                            req.files.video.map(async (e) => {
                                await unlinkAsync(e.path);
                            });
                        }
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                } else {
                    if (req.files.thumbnail) {
                        req.files.thumbnail.map(async (e) => {
                            await unlinkAsync(e.path);
                        });
                    }
                    if (req.files.video) {
                        req.files.video.map(async (e) => {
                            await unlinkAsync(e.path);
                        });
                    }
                    res.status(200).json({
                        status: false,
                        data: "invalid HowToOrderMedicineId",
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Please enter HowToOrderMedicineId",
                });
            }
        } catch (error) {
            next(error);
        }
    },
     /* Ads cart orderMedicineSlider
    ============================================= */
    getOrderMedicineSlider: async (req, res, next) => {
        try {
            let result = await adsOrderMedicineSlider.find(
                { sliderType: "OrderMedicineSlider", isDisabled: false },
                {
                    type: 1,
                    typeId: 1,
                    image: 1,
                    sliderType: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].image=process.env.BASE_URL.concat(result[i].image)
            }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    editOrderMedicineSlider: async (req, res, next) => {
        try {
            let data = req.body;

                if (data.sliderId) {
                    let slider = await adsOrderMedicineSlider.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                    if (slider) {
                        if (req.file) {
                            data.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = slider.image.split("/");
                            let path = `./public/images/ads/${splittedImageRoute[1]}`;
                            if (fs.existsSync(path)) {
                                fs.unlink(path, function (err) {
                                    if (err) throw err;
                                });
                            }
                        }
                        data.updatedAt = new Date();
                        adsOrderMedicineSlider.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
                            .then((response) => {
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Not updated",
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        if (req.file) {
                            await unlinkAsync(req.file.path);
                        }
                        res.status(200).json({
                            status: false,
                            data: "invalid Slider Id",
                        });
                    }
                } else {
                    if (req.file) {
                        var fileInfo = req.file;
                        imageType = "OrderMedicineSlider";
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            imageError = "false";
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            data.sliderType = "OrderMedicineSlider";
                            let schemaObj = new adsOrderMedicineSlider(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "ads OrderMedicineSlider added successfully",
                                    });
                                })
                                .catch(async (error) => {
                                    if (req.file) {
                                        await unlinkAsync(req.file.path);
                                    }
    
                                    res.status(200).json({
                                        status: false,
                                        data: error,
                                    });
                                });
                        }
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Please upload image",
                        });
                    }
                }
        } catch (error) {
            next(error);
        }
    },
    deleteOrderMedicineSlider: async (req, res, next) => {
        try {
            let Type= await adsOrderMedicineSlider.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                adsOrderMedicineSlider.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {
                        let splittedImageRoute = Type.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: " removed successfully",
                        });
                    })
                    .catch((error) => {
                        res.status(200).json({
                            status: false,
                            data: error,
                        });
                    });
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid Type",
                });
            }
        } catch (error) {
            next(error);
        }
    },
     //partner promotion
     editPartnerPromotion: async (req, res, next) => {
        try {
            console.log('!@#$%',req.body)
              let types = "PartnerPromotion";
              var type = types === req.body.type;
              if (type) {
                var ExtData = await adsPartnerPromotion.findOne({_id:mongoose.Types.ObjectId(req.body._id)});
                if (!ExtData) {
                    let data = req.body;
                if (req.file) {
                    var fileInfo = req.file;
                    console.log('fifileInfo',fileInfo)
                    imageType = req.body.type;
                    console.log('type',type)
                    checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        let schemaObj = new adsPartnerPromotion(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: " added successfully",
                                });
                            })
                            .catch(async (error) => {
                                if (req.file) {
                                    await unlinkAsync(req.file.path);
                                }
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Please upload image",
                    });
                }
                  
                } else {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = type;
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            req.body.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = ExtData.image.split("/");
                            fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                    }
                    if (imageError == "false") {
                        req.body.updatedAt = new Date();
                        adsPartnerPromotion.updateOne({ _id:mongoose.Types.ObjectId(req.body._id) }, req.body)
                            .then((response) => {
                                console.log('response',response);
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated successfully",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Not updated",
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                }
              } else {
                res.status(200).json({
                  error: true,
                  message: "invalid type",
                });
              }
          } catch (error) {
            next(error);
          }
        
    },
    getPartnerPromotion: async (req, res, next) => {
        try {
            let result = await adsPartnerPromotion.find(
                { isDisabled: false },
                {
                    ExternalLink: 1,
                    image: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].image=process.env.BASE_URL.concat(result[i].image)
            }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    deletePartnerPromotion: async (req, res, next) => {
        try {
            let Type= await adsPartnerPromotion.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                adsPartnerPromotion.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {
                        let splittedImageRoute = Type.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: " removed successfully",
                        });
                    })
                    .catch((error) => {
                        res.status(200).json({
                            status: false,
                            data: error,
                        });
                    });
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid Type",
                });
            }
        } catch (error) {
            next(error);
        }
    },
     //promotion
     editPromotion: async (req, res, next) => {
        try {
            console.log('!@#$%',req.body)
              let types = "Promotion";
              var type = types === req.body.type;
              if (type) {
                // var ExtData = await adsPromotion.findOne({_id:mongoose.Types.ObjectId(req.body._id)});
                var ExtData = await adsPromotion.findOne({_id:mongoose.Types.ObjectId(req.body._id)});
                if (!ExtData) {
                    let data = req.body;
                if (req.file) {
                    var fileInfo = req.file;
                    console.log('fifileInfo',fileInfo)
                    imageType = req.body.type;
                    console.log('type',type)
                    checkImageSize(imageType, fileInfo);
                    if (imageError != "false") {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    } else {
                        data.image = `ads/${req.file.filename}`;
                        let schemaObj = new adsPromotion(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: " added successfully",
                                });
                            })
                            .catch(async (error) => {
                                if (req.file) {
                                    await unlinkAsync(req.file.path);
                                }
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Please upload image",
                    });
                }
                  
                } else {
                    if (req.file) {
                        var fileInfo = {};
                        fileInfo = req.file;
                        imageType = type;
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            fs.unlink(fileInfo.path, (err) => {
                                if (err) throw err;
                            });
                        } else {
                            req.body.image = `ads/${req.file.filename}`;
                            // deleting old image
                            let splittedImageRoute = ExtData.image.split("/");
                            fs.unlink(`./public/images/ads/${splittedImageRoute[1]}`, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }
                    }
                    if (imageError == "false") {
                        req.body.updatedAt = new Date();
                        adsPromotion.updateOne({ _id:mongoose.Types.ObjectId(req.body._id) }, req.body)
                            .then((response) => {
                                console.log('response',response);
                                if (response.nModified == 1) {
                                    res.status(200).json({
                                        status: true,
                                        data: "Updated successfully",
                                    });
                                } else {
                                    res.status(200).json({
                                        status: false,
                                        data: "Not updated",
                                    });
                                }
                            })
                            .catch((error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    } else {
                        res.status(200).json({
                            status: false,
                            data: imageError,
                        });
                        imageError = "false";
                    }
                }
              } else {
                res.status(200).json({
                  error: true,
                  message: "invalid type",
                });
              }
          } catch (error) {
            next(error);
          }
        
    },
    getPromotion: async (req, res, next) => {
        try {
            let result = await adsPromotion.find(
                { isDisabled: false },
                {
                    termsConditions: 1,
                    image: 1,
                }
            );
            for (i=0;i<result.length;i++){
                result[i].image=process.env.BASE_URL.concat(result[i].image)
            }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    deletePromotion: async (req, res, next) => {
        try {
            let Type= await adsPromotion.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                adsPromotion.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {
                        let splittedImageRoute = Type.image.split("/");
                        let path = `./public/images/ads/${splittedImageRoute[1]}`;
                        if (fs.existsSync(path)) {
                            fs.unlink(path, function (err) {
                                if (err) throw err;
                                console.log("old image deleted!");
                            });
                        }

                        res.status(200).json({
                            status: true,
                            data: " removed successfully",
                        });
                    })
                    .catch((error) => {
                        res.status(200).json({
                            status: false,
                            data: error,
                        });
                    });
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid Type",
                });
            }
        } catch (error) {
            next(error);
        }
    },

}