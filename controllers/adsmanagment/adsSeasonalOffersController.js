const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const sizeOf = require("image-size");
const AdsSeasonalOfferSetYourDeal = require("../../models/ads/seasonal-offers/setYourDeal");
const AdsSeasonalOfferSetYourDealSub = require("../../models/ads/seasonal-offers/setYourDealSub");
const AdseditorsChoiceVocalLocalEnergizeYourWorkout = require("../../models/ads/seasonal-offers/editorsChoiceVocalLocalEnergizeYourWorkout");
const AdsSeasonalOfferSetNewOffer = require("../../models/ads/seasonal-offers/SetNewOffer");
const AdsSeasonalOfferSetNewOfferSub = require("../../models/ads/seasonal-offers/setNewOfferSub");
const AdsSeasonalOfferImmunityBooster = require("../../models/ads/seasonal-offers/immunityBooster");
const AdsSeasonalOfferTopCategories = require("../../models/ads/seasonal-offers/topCategories");
const AdsSeasonalOfferBudgetStore = require("../../models/ads/seasonal-offers/budgetStore");




var dimensions = "";
var imageType = "";
var imageError = "false";

function checkImageSize(imageType, fileInfo) {
    if (fileInfo) {
        dimensions = sizeOf(fileInfo.path);
    }
    if (imageType == "editorsChoice") {
        if (dimensions.width != 257 && dimensions.height != 230) {
            imageError = "Please upload image of size 257 * 230";
        }
    } else if (imageType == "VocalLocal") {
        if (dimensions.width != 287 && dimensions.height != 192) {
            imageError = "Please upload image of size 287 * 192";
        }
    } else if (imageType == "EnergizeYourWorkout") {
        if (dimensions.width != 298 && dimensions.height != 298) {
            imageError = "Please upload image of size 298 * 298";
        }
    } else if (imageType == "TopCategories") {
        if (dimensions.width != 1228 && dimensions.height != 1228) {
            imageError = "Please upload image of size 1228 * 1228";
        }
    }else if (imageType == "BudgetStore") {
        if (dimensions.width != 330 && dimensions.height != 304) {
            imageError = "Please upload image of size 330 * 304";
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
    } else if (imageType == "SetNewOfferSub") {
        if (dimensions.width != 242 && dimensions.height != 298) {
            imageError = "Please upload image of size 242 * 298";
        }
    } else if (imageType == "PartnerPromotion") {
        if (dimensions.width != 1330 && dimensions.height != 388) {
            imageError = "Please upload image of size 1330 * 388";
        }
    } else if (imageType == "Promotion") {
        if (dimensions.width != 1330 && dimensions.height != 388) {
            imageError = "Please upload image of size 1330 * 388";
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
    addSetYourDeal: async (req, res, next) => {
        try {
            let data = req.body;
            console.log('AdsSeasonalOfferSetYourDeal',data)
                if (data.sliderId) {
                    let slider = await AdsSeasonalOfferSetYourDeal.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                    if (slider) {
                        data.updatedAt = new Date();
                        AdsSeasonalOfferSetYourDeal.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                            data: "invalid Slider Id",
                        });
                    }
                } else {
                    data.sliderType = "SetYourDeal";
                        let schemaObj = new AdsSeasonalOfferSetYourDeal(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "SetYourDeal added successfully",
                                });
                            })
                }
            
        } catch (error) {
            next(error);
        }
    },
    getSetYourDeal: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferSetYourDeal.find(
                { sliderType: "SetYourDeal", isDisabled: false }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSingleSetYourDeal: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferSetYourDeal.findOne(
                { _id:mongoose.Types.ObjectId(req.params.id)} 
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    deleteSetYourDeal: async (req, res, next) => {
        try {
           
            AdsSeasonalOfferSetYourDeal.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {

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
        } catch (error) {
            next(error);
        }
    },
     /* Ads seasonal offers setyour deal sub
    ============================================= */
    getSetYourDealSub: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferSetYourDealSub.find(
                { catId: mongoose.Types.ObjectId(req.params.id), isDisabled: false }
            ).populate({
                path: "productId",
                select: ["_id", "title", "image"],
                       })
                       if(result.length){
                     for(i=0;i<result.length;i++){
                            result[i].productId.image= process.env.BASE_URL.concat(result[i].productId.image)
                     }
                    }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSingleSetYourDealSub: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferSetYourDealSub.find(
                {_id:mongoose.Types.ObjectId(req.params.id)}
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    addSetYourDealSub: async (req, res, next) => {
        try {
            let data = req.body;
           
            console.log('AdsSeasonalOfferSetYourDealSub',data)
            // let existingHandpick = await AdsCartHandpick.findOne({
            //     sliderType: "handpick",
            // });
            // console.log('handpick',existingHandpick)
            // if (existingHandpick) {
                if (data.sliderId) {
                    let slider = await AdsSeasonalOfferSetYourDealSub.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

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
                        let existingAds = await AdsSeasonalOfferSetYourDealSub.findOne({
                            categoryId: mongoose.Types.ObjectId(req.body.categoryId),
                            productId: mongoose.Types.ObjectId(req.body.productId),
                            catId :slider.catId,
                            _id: { $ne: slider._id } 
                        });
                        if (!existingAds) {
                        AdsSeasonalOfferSetYourDealSub.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                                data: "Existing ads",
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
                    // if (req.file) {
                    //     await unlinkAsync(req.file.path);
                    // }
                    // res.status(200).json({
                    //     status: false,
                    //     data: "Handpick already exist",
                    // });
                    // data.sliderType = "SetYourDealSub";
                    let existingSetYourDealSub = await AdsSeasonalOfferSetYourDealSub.findOne({
                        productId:data.productId,
                        categoryId:data.categoryId,
                        catId:data.catId});
                    if (!existingSetYourDealSub) {
                        let schemaObj = new AdsSeasonalOfferSetYourDealSub(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "AdsSeasonalOfferSetYourDealSub added successfully",
                                });
                            })
                        } else {
                            res.status(200).json({
                                    status: false,
                                    data: "SetYourDealSub already exist",
                                });
                        }
                }
           
           
        } catch (error) {
            next(error);
        }
    },
    deleteSetYourDealSub: async (req, res, next) => {
        try {
            // let Type= await AdsCartHandpick.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            // if (Type) {
                AdsSeasonalOfferSetYourDealSub.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
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
     /* Ads  getAdseditorsChoiceVocalLocalEnergizeYourWorkout
    ============================================= */
    getAdseditorsChoiceVocalLocalEnergizeYourWorkout: async (req, res, next) => {
        try {
            let result = await AdseditorsChoiceVocalLocalEnergizeYourWorkout.find(
                {isDisabled: false },
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
    getAdsSingleeditorsChoiceVocalLocalEnergizeYourWorkout: async (req, res, next) => {
        try {
            let result = await AdseditorsChoiceVocalLocalEnergizeYourWorkout.find(
                { _id:mongoose.Types.ObjectId(req.params.id)},
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
    editAdseditorsChoiceVocalLocalEnergizeYourWorkout: async (req, res, next) => {
        try {
            let data = req.body;
                if (data.sliderId) {
                    let slider = await AdseditorsChoiceVocalLocalEnergizeYourWorkout.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

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
                        AdseditorsChoiceVocalLocalEnergizeYourWorkout.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        imageType =req.body.sliderType;
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            imageError = "false";
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            let schemaObj = new AdseditorsChoiceVocalLocalEnergizeYourWorkout(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "data added successfully",
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
    deleteAdseditorsChoiceVocalLocalEnergizeYourWorkout: async (req, res, next) => {
        try {
            let Type= await AdseditorsChoiceVocalLocalEnergizeYourWorkout.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                AdseditorsChoiceVocalLocalEnergizeYourWorkout.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
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
    editSetNewOffer: async (req, res, next) => {
        try {
            let data = req.body;
            console.log('AdsSeasonalOfferSetNewOffer',data)
                if (data.sliderId) {
                    let slider = await AdsSeasonalOfferSetNewOffer.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                    if (slider) {
                        data.updatedAt = new Date();
                        AdsSeasonalOfferSetNewOffer.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                            data: "invalid Slider Id",
                        });
                    }
                } else {
                    data.sliderType = "SetNewOffer";
                        let schemaObj = new AdsSeasonalOfferSetNewOffer(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "SetNewOffer added successfully",
                                });
                            })
                }
            
        } catch (error) {
            next(error);
        }
    },
    getSetNewOffer: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferSetNewOffer.find(
                { sliderType: "SetNewOffer", isDisabled: false }
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSingleSetNewOffer: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferSetNewOffer.findOne(
                { _id:mongoose.Types.ObjectId(req.params.id)} 
            );
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    deleteSetNewOffer: async (req, res, next) => {
        try {
           
            AdsSeasonalOfferSetNewOffer.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {

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
        } catch (error) {
            next(error);
        }
    },
    editSetNewOfferSub: async (req, res, next) => {
        try {
            let data = req.body;
            console.log('1111111111',data)
            
            if (data.sliderId) {
                let slider = await AdsSeasonalOfferSetNewOfferSub.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                if (slider) {
                    data.updatedAt = new Date();
                    let existingAds = await AdsSeasonalOfferSetNewOfferSub.findOne({
                        categoryId: mongoose.Types.ObjectId(req.body.categoryId),
                        ProductId: mongoose.Types.ObjectId(req.body.ProductId),
                        CatId :slider.CatId,
                        _id: { $ne: slider._id } 
                    });
                    if (!existingAds) {
                    AdsSeasonalOfferSetNewOfferSub.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                            data: "Existing ads",
                        });
                    }
                } else {
                    res.status(200).json({
                        status: false,
                        data: "invalid Slider Id",
                    });
                }
            } else {
                let existingSetNewOfferSub = await AdsSeasonalOfferSetNewOfferSub.findOne({
                    ProductId:req.body.ProductId,
                    categoryId:req.body.categoryId,
                    CatId:req.body.CatId});
                if (!existingSetNewOfferSub) {


                        let schemaObj = new AdsSeasonalOfferSetNewOfferSub(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "SetNewOffer added successfully",
                                });
                            })
                            .catch(async (error) => {

                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });         
                        } else {
                            res.status(200).json({
                                    status: false,
                                    data: "SetNewOffer already exist",
                                });
                        }
            }
       
        
    } catch (error) {
        next(error);
    }
},
    // getSetNewOfferSub: async (req, res, next) => {
    //     try {
    //         let result = await AdsSeasonalOfferSetNewOfferSub.find(
    //             {  isDisabled: false  }
    //         ).populate({
    //             path: "ProductId",
    //             select: ["_id", "title", "image"],
    //           })
    //           for (i = 0; i < result.length; i++) {
    //             result[i].ProductId.image= process.env.BASE_URL.concat(result[i].ProductId.image);
    //         }
    //         res.status(200).json({
    //             status: true,
    //             data: result,
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // },
    getSingleSetNewOfferSub: async (req, res, next) => {
        try {
            
          
            let result = await AdsSeasonalOfferSetNewOfferSub.findOne(
                { _id:mongoose.Types.ObjectId(req.params.id)} 
            ).populate({
                path: "ProductId",
                select: ["_id", "title", "image"],
                       })
              if(result)   {
                  console.log('#',result)
                res.status(200).json({
                    status: true,
                    data: result,
                })
              }      
           

        } catch (error) {
            next(error);
        }
    },
    getCatSetNewOfferSub: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferSetNewOfferSub.find(
                { CatId:mongoose.Types.ObjectId(req.params.id)} 
            ).populate({
                path: "ProductId",
                select: ["_id", "title", "image"],
                       })
                       console.log('eeee',result)
                       if(result.length){
                     for(i=0;i<result.length;i++){
                            result[i].ProductId.image= process.env.BASE_URL.concat(result[i].ProductId.image)
                     }
                    }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    deleteSetNewOfferSub: async (req, res, next) => {
        try {
           
            AdsSeasonalOfferSetNewOfferSub.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {

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
        } catch (error) {
            next(error);
        }
    },
    editImmunityBooster: async (req, res, next) => {
        try {
            let data = req.body;
            console.log('AdsSeasonalOfferSetNewOfferSub',data)
            let existingImmunityBooster = await AdsSeasonalOfferImmunityBooster.findOne({
                ProductId:data.ProductId,
            },{
                categoryId:data.categoryId,
            });
            if (!existingImmunityBooster) {
                if (data.sliderId) {
                    let slider = await AdsSeasonalOfferImmunityBooster.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

                    if (slider) {
                        data.updatedAt = new Date();
                        AdsSeasonalOfferImmunityBooster.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                            data: "invalid Slider Id",
                        });
                    }
                } else {
                    // data.sliderType = "SetYourDeal";
                        let schemaObj = new AdsSeasonalOfferImmunityBooster(data);
                        schemaObj
                            .save()
                            .then((response) => {
                                res.status(200).json({
                                    status: true,
                                    data: "AdsSeasonalOfferImmunityBooster added successfully",
                                });
                            })
                }
            } else {
                res.status(200).json({
                        status: false,
                        data: "ImmunityBooster already exist",
                    });
            }
            
        } catch (error) {
            next(error);
        }
    },
    getImmunityBooster: async (req, res, next) => {
        try {

            let result = await AdsSeasonalOfferImmunityBooster.find({isDisabled:false}).populate({
                path: "ProductId",
                select: ["_id", "title", "image"],
                       })
                       if(result.length){
                     for(i=0;i<result.length;i++){
                            result[i].ProductId.image= process.env.BASE_URL.concat(result[i].ProductId.image)
                     }
                    }
                // { $match: { isDisabled: false } },
                // {
                //     $lookup: {
                //         from: 'product',
                //         localField: 'ProductId',
                //         foreignField: '_id',
                //         as: 'pro_details'
                //     }
                // },
                // {
                //     $project:{
                //         categoryId: '$categoryId',
                //         ProductId: '$ProductId',
                //         title:'$pro_details.title',
                //         image:'$pro_details.image'
                //     }
                // },
                // {
                //     $unwind: '$pro_details'
                // },
                // {
                //  $match:{
                //     'pro_details._id':'$ProductId'
                //  }
                // },
                // {
                //     $group:{
                //         _id: '$_id',
                //         categoryId: { "$first": "$categoryId" },
                //         ProductId:{ "$first": "$ProductId" },
                //         title:{ "$first": '$pro_details.title' },
                //         image:{ "$first": '$pro_details.image' },
                        
                //     }
                // }
            // ])
            // for (i=0;i<result.length;i++){
            //     result.ProductId[i].image=process.env.BASE_URL.concat(result.ProductId[i].image)
            // }
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getSingleImmunityBooster: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferImmunityBooster.findOne(
                { _id:mongoose.Types.ObjectId(req.params.id)} 
            )
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    deleteImmunityBooster: async (req, res, next) => {
        try {
           
            AdsSeasonalOfferImmunityBooster.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
                    .then((response) => {

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
        } catch (error) {
            next(error);
        }
    },
     /* Ads topCategories
    ============================================= */
    getTopCategories: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferTopCategories.find(
                { sliderType: "TopCategories", isDisabled: false }
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
    getSingleTopCategories: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferTopCategories.find(
                { _id:mongoose.Types.ObjectId(req.params.id)}
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
    editTopCategories: async (req, res, next) => {
        try {
            let data = req.body;
                if (data.sliderId) {
                    let slider = await AdsSeasonalOfferTopCategories.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

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
                        AdsSeasonalOfferTopCategories.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        imageType = "TopCategories";
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            imageError = "false";
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            data.sliderType = "TopCategories";
                            let schemaObj = new AdsSeasonalOfferTopCategories(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "adsTopCategories added successfully",
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
    deleteTopCategories: async (req, res, next) => {
        try {
            let Type= await AdsSeasonalOfferTopCategories.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                AdsSeasonalOfferTopCategories.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
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
     /* Ads budgetStore
    ============================================= */
    getBudgetStore: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferBudgetStore.find(
                { sliderType: "BudgetStore", isDisabled: false }
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
    getSingleBudgetStore: async (req, res, next) => {
        try {
            let result = await AdsSeasonalOfferBudgetStore.find(
                { _id:mongoose.Types.ObjectId(req.params.id)}
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
    editBudgetStore: async (req, res, next) => {
        try {
            let data = req.body;
                if (data.sliderId) {
                    let slider = await AdsSeasonalOfferBudgetStore.findOne({ _id: mongoose.Types.ObjectId(data.sliderId) });

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
                        AdsSeasonalOfferBudgetStore.updateOne({ _id: mongoose.Types.ObjectId(data.sliderId) }, data)
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
                        imageType = "BudgetStore";
                        checkImageSize(imageType, fileInfo);
                        if (imageError != "false") {
                            res.status(200).json({
                                status: false,
                                data: imageError,
                            });
                            imageError = "false";
                        } else {
                            data.image = `ads/${req.file.filename}`;
                            data.sliderType = "BudgetStore";
                            let schemaObj = new AdsSeasonalOfferBudgetStore(data);
                            schemaObj
                                .save()
                                .then((response) => {
                                    res.status(200).json({
                                        status: true,
                                        data: "Ads BudgetStore added successfully",
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
    deleteBudgetStore: async (req, res, next) => {
        try {
            let Type= await AdsSeasonalOfferBudgetStore.findOne({ _id:mongoose.Types.ObjectId(req.params.id)});

            if (Type) {
                AdsSeasonalOfferBudgetStore.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id)})
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
    }

}
