const user = require("../models/user");
const otpChecking = require("../models/otpChecking");
const forgotOtpChecking = require("../models/forgotOtpChecking");
const ArticleCategory = require("../models/articleCategory");
const AdsFoliofitSlider1 = require("../models/ads/foliofit/slider1");
const AdsMedfeedSlider1 = require("../models/ads/medfeed/slider1");
const medfeedMainSections = require("../models/medfeedMainSection");
const Articles = require("../models/article");
const HealthcareVideoCategory = require("../models/healthcareVideoCategory");
const HealthcareVideos = require("../models/healthCareVideo");
const Like = require("../models/like");
const Save = require("../models/save");
const AdsMedfeedMainQuizExpert = require("../models/ads/medfeed/mainQuizExpert");
const HealthExpertAdvice = require("../models/healthExpertAdvice");
const healthExpertQnReplay = require("../models/healthExpertQnReplay");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const LiveUpdate = require("../models/articleLiveUpdate");
const DietPlan = require("../models/dietPlan");
const DietDay = require("../models/dietDay");
const foliofitMainSections = require("../models/foliofitMainSection");
const nutrichartCategory = require("../models/nutrichartCategory");
const nutrichartVitamin = require("../models/foliofit/nutrichartVitamin");
const nutrichartCategoryBased = require("../models/foliofit/nutrichartCategoryBased");
const AdsFoliofitBanner = require("../models/ads/foliofit/banner");
const nutrichartFood = require("../models/nutrichartFood");
const healthReminder = require("../models/healthReminder");
const healthCalculator = require("../models/HealthCalculator");
const AdsFoliofitSlider2 = require("../models/ads/foliofit/slider2");
const AdsFoliofitAd1Slider = require("../models/ads/foliofit/ad1slider");
const AdsFoliofitSlider3 = require("../models/ads/foliofit/slider3");
const foliofitHomePage = require("../models/foliofit/foliofitMasterHome");
const FoliofitMasterYogaHome = require("../models/foliofit/foliofitMasterYogaHome");
const AdsFoliofitMainCategory = require("../models/ads/foliofit/mainCategory");
const foliofitRating = require('../models/foliofitRating')

const axios = require("axios")


const nutrichart = "nutrichart";
const imgPath = process.env.BASE_URL;

/* Get Foliofit Home 
============================================= */

const FoliofitMasterFitnessMainHomeFullbodyHealthy = require("../models/foliofit/foliofitMasterFitnessHomeFullbodyHealthy");
const foliofitWeeklyWorkout = require("../models/foliofit/foliofitMasterWeekly");
const AdsHomeYogaFitnessExpert = require("../models/ads/home/yogaFitnessExpert");
//const AdsFoliofitBanner = require("../models/ads/foliofit/banner");
var fitnessTypeBanner = "fitness";
// const AdsFoliofitAd1Slider = require("../models/ads/foliofit/ad1slider");

var fitnessTypeHome = "homeworkouts";
var fitnessTypeFullBody = "fullbodyworkouts";
var fitnessTypeHealthyJourney = "healthyjourney";
var fitnessTypeMain = "maincategory";
// End Get Foliofit Home

/* Get Yoga Home 
============================================= */
const FoliofitMasterYogaMainCategory = require("../models/foliofit/foliofitMasterYogaMain");
const FoliofitMasterYogaHealthyRecommended = require("../models/foliofit/foliofitMasterYogaHealthyRecommended");
const FoliofitTestimonial = require("../models/foliofit/foliofitTestimonial");
const HealthTip = require("../models/healthTip");
const FolifitFitnessClub = require("../models/foliofit/foliofitFitnessClub");
const { response } = require("express");
const yoga = "yoga";
const yogaTypeHealthy = "healthy";
const yogaTypeRecommended = "recommended";
const foliofitType = "foliofit";


// End Get Foliofit Home
const FoliofitMasterYogaWeekly = require("../models/foliofit/foliofitMasterYogaWeekly");
const FoliofitYoga = require("../models/foliofit/foliofitYoga");
const bmiCount = require("../models/bmiCount");
const proCategory = require("../models/proCategory");
const product = require("../models/Product");


/* Master settings - Medimall - categoires
============================================= */
const MasterCategory = require("../models/mastersettings/category");
const MasterSubCategoryHealthcare = require("../models/mastersettings/subCategoryHealthcare");
const AdsMedimallTopIconCatHealth = require("../models/ads/medimall/topIconCatHealth");
const Inventory = require("../models/inventory");
const MasterSubSubCategoryHealthcare = require("../models/mastersettings/subSubCategory");
const MasterUOMValue = require("../models/mastersettings/uomValue");
const AdsMedimallSliderTopWishRecent = require("../models/ads/medimall/sliderTopWishRecent");

const Store = require('../models/store');
const InventoryFavourite = require("../models/inventoryFavourites");
const InventorySuggested = require("../models/inventorySuggested");
const StoreProduct = require("../models/store_products");

var categoryTypeHealth = "healthcare";
const bannerWishlist = "wishlist"
const bannerRecentlist = "recentlyviewed"

let APIKEY = process.env.OTPAPIKEY;
const TwoFactor = new (require("2factor"))(APIKEY);

const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return "few seconds ago";
}

function chunkArray(myArray, chunk_size) {
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}

module.exports = {
    phoneVerification: async (req, res, next) => {
        try {
            if (req.body.phone) {
                let existing = await user.findOne({ phone: req.body.phone });

                if (!existing) {
                    if (req.body.phone.length == 10) {
                        let otp = Math.floor(1000 + Math.random() * 9000);

                        TwoFactor.sendOTP(req.body.phone, {
                            otp: otp,
                            template: "MEDIMALL",
                        }).then(
                            async (sessionId) => {
                                let tempAdded = await otpChecking.findOne({
                                    phone: req.body.phone,
                                });
                                if (tempAdded != null) {
                                    otpChecking
                                        .updateOne({ phone: req.body.phone }, { $set: { otpId: sessionId } })
                                        .then((response) => {
                                            res.status(200).json({
                                                error: false,
                                                message: "OTP has sent to your phone number",
                                                data: { mode: 0 },
                                            });
                                        });
                                } else {
                                    let schemaObj = otpChecking({
                                        otpId: sessionId,
                                        phone: req.body.phone,
                                    });
                                    schemaObj.save().then((response) => {
                                        res.status(200).json({
                                            error: false,
                                            message: "OTP has sent to your phone number",
                                            data: { mode: 0 },
                                        });
                                    });
                                }
                            },
                            (error) => {
                                res.status(200).json({
                                    error: true,
                                    message: "" + error,
                                    data: { mode: 2 },
                                });
                            }
                        );
                    } else {
                        res.status(200).json({
                            error: true,
                            message: "invalid phone number",
                            data: { mode: 2 },
                        });
                    }
                } else {
                    // Normal registered user
                    if (existing.email && existing.password && existing.name) {
                        res.status(200).json({
                            error: false,
                            message: "Registered user",
                            data: { mode: 1 },
                        });
                    } else {
                        // Registered user who didn't added profile details(email, password)
                        let otp = Math.floor(1000 + Math.random() * 9000);

                        TwoFactor.sendOTP(req.body.phone, {
                            otp: otp,
                            template: "MEDIMALL",
                        }).then(
                            async (sessionId) => {
                                console.log("new otp id", sessionId);
                                let tempAdded = await otpChecking.findOne({
                                    phone: req.body.phone,
                                });
                                console.log("temp::", tempAdded);

                                if (tempAdded != null) {
                                    otpChecking
                                        .updateOne(
                                            { phone: req.body.phone },
                                            { $set: { otpId: sessionId, isSigningIn: true } }
                                        )
                                        .then((response) => {
                                            res.status(200).json({
                                                error: false,
                                                message: "OTP has sent to the registered user who didn't updated profile",
                                                data: { mode: 0 },
                                            });
                                        });
                                } else {
                                    let schemaObj = otpChecking({
                                        otpId: sessionId,
                                        phone: req.body.phone,
                                        isSigningIn: true,
                                    });
                                    schemaObj.save().then((response) => {
                                        res.status(200).json({
                                            error: false,
                                            message: "OTP has sent to the registered user who didn't updated profile",
                                            data: { mode: 0 },
                                        });
                                    });
                                }
                            },
                            (error) => {
                                res.status(200).json({
                                    error: true,
                                    message: "otp error-" + error,
                                    data: { mode: 2 },
                                });
                            }
                        );
                    }
                }
            } else {
                res.status(200).json({
                    error: true,
                    message: "phone number missing",
                    data: { mode: 2 },
                });
            }
        } catch (error) {
            next(error);
        }
    },
    verifyOTP: async (req, res, next) => {
        try {
            if (req.body.otp && req.body.phone) {
                let tempOtpDetails = await otpChecking.findOne({
                    phone: req.body.phone,
                });
                console.log("temp saved::", tempOtpDetails);
                TwoFactor.verifyOTP(tempOtpDetails.otpId, req.body.otp).then(
                    async (response) => {
                        await otpChecking.deleteOne({ phone: req.body.phone });

                        if (tempOtpDetails.isSigningIn) {
                            user.findOne({ phone: req.body.phone })
                                .then((response) => {
                                    const token = createToken(response._id);
                                    res.status(200).json({
                                        error: false,
                                        message: "Verified",
                                        data: {
                                            fcmId: "fcmId",
                                            token: token,
                                        },
                                    });
                                })
                                .catch((error) => {
                                    res.status(200).json({
                                        error: true,
                                        message: error + "",
                                        data: {
                                            fcmId: "",
                                            token: "",
                                        },
                                    });
                                });
                        } else {
                            let schemaObj = user({ phone: req.body.phone });
                            schemaObj
                                .save()
                                .then((response) => {
                                    const token = createToken(response._id);
                                    res.status(200).json({
                                        error: false,
                                        message: "user created",
                                        data: {
                                            fcmId: "fcmId",
                                            token: token,
                                        },
                                    });
                                })
                                .catch((error) => {
                                    res.status(200).json({
                                        error: true,
                                        message: "" + error,
                                        data: {
                                            fcmId: "",
                                            token: "",
                                        },
                                    });
                                });
                        }
                    },
                    (error) => {
                        res.status(200).json({
                            error: true,
                            message: "" + error,
                            data: {
                                fcmId: "",
                                token: "",
                            },
                        });
                    }
                );
            } else {
                res.status(200).json({
                    error: true,
                    message: "otp or mobile number missing",
                    data: {
                        fcmId: "",
                        token: "",
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    },
    update_profile: async (req, res, next) => {
        try {
            let body = req.body;
            if (body.name && body.email && body.password && body.reEnterPassword) {
                if (body.password.length >= 8) {
                    if (body.password === body.reEnterPassword) {
                        let existingEmail = await user.findOne({ email: body.email });

                        if (!existingEmail) {
                            let data = {
                                name: body.name,
                                email: body.email,
                                password: body.password,
                            };

                            data.password = await bcrypt.hash(data.password, 12);

                            let userDetails = await user.findOne({
                                _id: mongoose.Types.ObjectId(req.user._id),
                            });
                            user.updateOne({ phone: userDetails.phone }, data)
                                .then((response) => {
                                    if (response.nModified == 1) {
                                        res.status(200).json({
                                            error: false,
                                            message: "details added | logged in successfully",
                                        });
                                    } else {
                                        res.status(200).json({
                                            error: true,
                                            message: "details not updated",
                                        });
                                    }
                                })
                                .catch((error) => {
                                    res.status(200).json({
                                        error: true,
                                        message: error + "",
                                    });
                                });
                        } else {
                            res.status(200).json({
                                error: true,
                                message: "Email already exists",
                            });
                        }
                    } else {
                        res.status(200).json({
                            error: true,
                            message: "confirm password not matched",
                        });
                    }
                } else {
                    res.status(200).json({
                        error: true,
                        message: "password should be atleast 8 characters",
                    });
                }
            } else {
                res.status(200).json({
                    error: true,
                    message: "Please fill all neccessary data",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    signin: async (req, res, next) => {
        try {
            if (req.body.password && req.body.phone) {
                let userDetail = await user.findOne({ phone: req.body.phone });
                if (userDetail) {
                    let verified = await bcrypt.compare(req.body.password, userDetail.password);
                    if (verified) {
                        const token = createToken(userDetail._id);
                        phone = "";
                        res.status(200).json({
                            error: false,
                            message: "Logged in successfully",
                            data: {
                                fcmId: "fcmId",
                                token: token,
                            },
                        });
                    } else {
                        res.status(200).json({
                            error: true,
                            message: "invalid password",
                            data: {
                                fcmId: "",
                                token: "",
                            },
                        });
                    }
                } else {
                    res.status(200).json({
                        error: true,
                        message: "Phone number missing | user not found",
                        data: {
                            fcmId: "",
                            token: "",
                        },
                    });
                }
            } else {
                res.status(200).json({
                    error: true,
                    message: "Credentials missing",
                    data: {
                        fcmId: "",
                        token: "",
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    },
    signinWithOtp: async (req, res, next) => {
        try {
            if (req.body.phone.length == 10) {
                let otp = Math.floor(1000 + Math.random() * 9000);
                TwoFactor.sendOTP(req.body.phone, {
                    otp: otp,
                    template: "MEDIMALL",
                }).then(
                    async (sessionId) => {
                        let tempAdded = await otpChecking.findOne({
                            phone: req.body.phone,
                        });

                        console.log("templLL", tempAdded);
                        if (tempAdded != null) {
                            otpChecking
                                .updateOne({ phone: req.body.phone }, { $set: { otpId: sessionId, isSigningIn: true } })
                                .then((response) => {
                                    console.log("response:", response);
                                    res.status(200).json({
                                        error: false,
                                        message: "OTP has sent to your phone number",
                                    });
                                });
                        } else {
                            let schemaObj = otpChecking({
                                otpId: sessionId,
                                phone: req.body.phone,
                                isSigningIn: true,
                            });
                            schemaObj.save().then((response) => {
                                console.log("response:", response);
                                res.status(200).json({
                                    error: false,
                                    message: "OTP has sent to your phone number",
                                });
                            });
                        }
                    },
                    (error) => {
                        res.status(200).json({
                            error: true,
                            message: "otp error-" + error,
                        });
                    }
                );
            } else {
                res.status(200).json({
                    error: true,
                    message: "phone number missing or invalid phone number",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    forgotSendOtp: async (req, res, next) => {
        try {
            if (req.body.phone) {
                let validNumber = await user.findOne({ phone: req.body.phone });
                if (validNumber) {
                    let otp = Math.floor(1000 + Math.random() * 9000);
                    TwoFactor.sendOTP(req.body.phone, {
                        otp: otp,
                        template: "MEDIMALL",
                    }).then(
                        async (sessionId) => {
                            let tempAdded = await forgotOtpChecking.findOne({
                                phone: req.body.phone,
                            });

                            if (tempAdded != null) {
                                forgotOtpChecking
                                    .updateOne({ phone: req.body.phone }, { $set: { sessionId: sessionId } })
                                    .then((response) => {
                                        res.status(200).json({
                                            error: false,
                                            message: "OTP has sent to your phone number",
                                        });
                                    });
                            } else {
                                let schemaObj = forgotOtpChecking({
                                    sessionId: sessionId,
                                    phone: req.body.phone,
                                });
                                schemaObj.save().then((response) => {
                                    res.status(200).json({
                                        error: false,
                                        message: "OTP has sent to your phone number",
                                    });
                                });
                            }
                        },
                        (error) => {
                            res.status(200).json({
                                error: true,
                                message: "otp error-" + error,
                            });
                        }
                    );
                } else {
                    res.status(200).json({
                        error: true,
                        message: "invalid phone number",
                    });
                }
            } else {
                res.status(200).json({
                    error: true,
                    message: "Phone number missing",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            if (req.body.otp && req.body.phone && req.body.new_password && req.body.confirm_new_password) {
                let tempOtpDetails = await forgotOtpChecking.findOne({
                    phone: req.body.phone,
                });
                TwoFactor.verifyOTP(tempOtpDetails.sessionId, req.body.otp).then(
                    async (response) => {
                        console.log("verified::::");
                        await forgotOtpChecking.deleteOne({ phone: req.body.phone });

                        let data = req.body;

                        if (data.new_password.length >= 8) {
                            if (data.new_password == data.confirm_new_password) {
                                let newPassword = await bcrypt.hash(data.new_password, 12);

                                user.updateOne({ phone: req.body.phone }, { $set: { password: newPassword } })
                                    .then((response) => {
                                        user.findOne({ phone: req.body.phone })
                                            .then((response) => {
                                                const token = createToken(response._id);
                                                res.status(200).json({
                                                    error: false,
                                                    message: "Password changed",
                                                    data: {
                                                        fcmId: "fcmId",
                                                        token: token,
                                                    },
                                                });
                                            })
                                            .catch((error) => {
                                                res.status(200).json({
                                                    error: true,
                                                    message: error + "",
                                                    data: {
                                                        fcmId: "",
                                                        token: "",
                                                    },
                                                });
                                            });
                                    })
                                    .catch((error) => {
                                        res.status(200).json({
                                            error: true,
                                            message: error + "",
                                            data: {
                                                fcmId: "",
                                                token: "",
                                            },
                                        });
                                    });
                            } else {
                                res.status(200).json({
                                    error: true,
                                    message: "confirm password not matched",
                                    data: {
                                        fcmId: "",
                                        token: "",
                                    },
                                });
                            }
                        } else {
                            res.status(200).json({
                                error: true,
                                message: "password should be atleast 8 characters",
                                data: {
                                    fcmId: "",
                                    token: "",
                                },
                            });
                        }
                    },
                    (error) => {
                        res.status(200).json({
                            error: true,
                            message: "" + error,
                            data: {
                                fcmId: "",
                                token: "",
                            },
                        });
                    }
                );
            } else {
                res.status(200).json({
                    error: true,
                    message: "Neccessary details missing",
                    data: {
                        fcmId: "",
                        token: "",
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getExpertAdviceWithBanner: async (req, res, next) => {
        try {
            let banner = await AdsMedfeedMainQuizExpert.aggregate([
                { $match: { sliderType: "expertadvise" } },
                {
                    $project: { id: "$_id", image: 1 },
                },
            ]);

            if (banner.length) {
                delete banner[0]._id;
                banner[0].image = process.env.BASE_URL.concat(banner[0].image);
            }
            let health_advice = await HealthExpertAdvice.aggregate([
                {
                    $project: {
                        id: "$_id",
                        question: 1,
                        // userId: 1,
                        posted_on: "$createdAt",
                        type: "advice",
                        user_pic: "$userImage",
                        posted_by: "$userName",
                    },
                },
            ]);
            let user = req.user._id;
            let count = await HealthExpertAdvice.countDocuments({
                userId: mongoose.Types.ObjectId(user),
            });
            console.log("health advice", health_advice);
            for (j = 0; j < health_advice.length; j++) {
                if (health_advice[j].user_pic) {
                    health_advice[j].user_pic = process.env.BASE_URL.concat(health_advice[j].user_pic);
                }

                delete health_advice[j]._id;
                health_advice[j].like_count = await Like.countDocuments({
                    contentId: mongoose.Types.ObjectId(health_advice[j].id),
                });
                // result[j] = result[j].toJSON();
                // is added wishlist (liked)
                let isLiked = await Like.findOne({
                    type: "advice",
                    contentId: mongoose.Types.ObjectId(health_advice[j].id),
                    userId: req.user._id,
                });

                console.log(j, "q isliked:", isLiked);

                if (isLiked) {
                    health_advice[j].is_liked = 1;
                } else {
                    health_advice[j].is_liked = 0;
                }

                let since = timeSince(health_advice[j].posted_on);

                health_advice[j].posted_on = since;
                let objdata = await healthExpertQnReplay.aggregate([
                    {
                        $match: {
                            question_id: mongoose.Types.ObjectId(health_advice[j].id),
                        },
                    },
                    {
                        $project: {
                            reply_id: "$_id",
                            answer: "$reply",
                            replied_by: "$repliedBy",
                            replay_posted_on: "$createdAt",
                            reply_type: "adviceReply",
                            // posted_by: "$userId",
                            image: 1,
                        },
                    },
                ]);

                // health_advice_replay.push(objdata);
                if (objdata.length) {
                    delete objdata[0]._id;

                    objdata[0].reply_like_count = await Like.countDocuments({
                        contentId: mongoose.Types.ObjectId(objdata[0].reply_id),
                    });
                    console.log("count_replay@@@@@@", objdata[0].reply_like_count);

                    // result[j] = result[j].toJSON();
                    // is added wishlist (liked)
                    var reply_isLiked = await Like.findOne({
                        type: "adviceReply",
                        contentId: mongoose.Types.ObjectId(objdata[0].reply_id),
                        userId: req.user._id,
                    });
                    console.log("replay_isLiked", reply_isLiked);
                    if (reply_isLiked) {
                        objdata[0].reply_isLiked = 1;
                    } else {
                        objdata[0].reply_isLiked = 0;
                    }
                    if (objdata[0].image) {
                        health_advice[j].admin_image = process.env.BASE_URL.concat(objdata[0].image);
                    } else {
                        health_advice[j].admin_image = process.env.BASE_URL.concat("medfeed/head.jpeg");
                    }
                    let time = timeSince(objdata[0].replay_posted_on);

                    health_advice[j].replay_posted_on = time;
                    // health_advice_replay.push(count_replay,replay_isLiked)
                    health_advice[j].answer = objdata[0].answer;
                    health_advice[j].replied_by = objdata[0].replied_by;
                    // health_advice[j].reply_posted_on = objdata[0].replay_posted_on
                    health_advice[j].reply_like_count = objdata[0].reply_like_count;
                    health_advice[j].reply_isLiked = objdata[0].reply_isLiked;
                    health_advice[j].reply_id = objdata[0].reply_id;
                    health_advice[j].reply_type = objdata[0].reply_type;
                }
            }
            // let health_advice = await HealthExpertAdvice.aggregate([
            //   {
            //     $project: {
            //       id: "$_id",
            //       question: 1,
            //       answer: "$reply",
            //       replied_by: "$repliedBy",
            //       posted_by: "$userId",
            //       posted_on: "$createdAt",
            //     },
            //   },
            // ]);

            // console.log("health_advice", health_advice);
            // console.log("rrrr", req.user);
            // for (j = 0; j < health_advice.length; j++) {
            //   delete health_advice[j]._id;
            //   let count = await Like.countDocuments({
            //     contentId: mongoose.Types.ObjectId(health_advice[j]._id),
            //   });
            //   // health_advice[j] = health_advice[j].toJSON();
            //   health_advice[j].like_count = count;
            //   console.log("health_advice[111]", health_advice[j]);
            //   // is added wishlist (liked)
            //   let isLiked = await Like.findOne({
            //     type: "advice",
            //     contentId: mongoose.Types.ObjectId(health_advice[j]._id),
            //     userId: req.user._id,
            //   });

            //   if (isLiked) {
            //     health_advice[j].is_liked = 1;
            //   } else {
            //     health_advice[j].is_liked = 0;
            //   }
            //   let user = await User.findOne({
            //     _id: mongoose.Types.ObjectId(health_advice[j].posted_by),
            //   });
            //   console.log("user", user);
            //   if (health_advice[j].user_pic) {
            //     health_advice[j].user_pic = process.env.BASE_URL.concat(user.image);
            //   } else {
            //     health_advice[j].user_pic = "./public/images/default/user_pic.jpg";
            //   }

            //   health_advice[j].posted_by = user.name;
            // }

            res.status(200).json({
                error: false,
                message: "success",
                data: {
                    banner: banner[0],
                    health_advice: health_advice.reverse(),
                    count,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    getHealthCareVideoCategories: async (req, res, next) => {
        try {
            let mainCategories = await HealthcareVideoCategory.find({ parent: "main" }, { name: 1 });

            console.log("main cats:", mainCategories);

            let structure = [];

            for (i = 0; i < mainCategories.length; i++) {
                let subCategories = await HealthcareVideoCategory.find(
                    { parent: mongoose.Types.ObjectId(mainCategories[i]._id) },
                    { name: 1, image: 1 }
                );

                for (j = 0; j < subCategories.length; j++) {
                    subCategories[j].image = process.env.BASE_URL.concat(subCategories[j].image);
                }

                let splittedArray = chunkArray(subCategories, 3);

                mainCategories[i] = mainCategories[i].toJSON();
                mainCategories[i].sub_category = splittedArray;

                structure.push(mainCategories[i]);
            }

            res.status(200).json({
                error: false,
                message: "success",
                data: { category: structure },
            });
        } catch (error) {
            next(error);
        }
    },
    medfeedHome: async (req, res, next) => {
        try {
            // Bookmark Count
            let bookmarkCount = await Save.countDocuments({
                userId: mongoose.Types.ObjectId(req.user._id),
            });

            // Banner *******
            let banner = await AdsMedfeedSlider1.find(
                {},
                {
                    isDisabled: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0,
                }
            );

            banner.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
                e = e.toJSON();
                e.redirection_id = 0;
            });

            // Main Sections *******
            let mainSections = await AdsMedfeedMainQuizExpert.find(
                { sliderType: "maincategory", isDisabled: false },
                {
                    image: { $concat: [imgPath, "$image"] },
                }
            ).lean();
            let newArray = mainSections.slice(0, 4);
            let liveUpdateImage = await LiveUpdate.find(
                {},
                {
                    image: { $concat: [imgPath, "$image"] },
                }
            ).lean();
            newArray.push(liveUpdateImage[0]);
            newArray.push(mainSections[4]);
            let liveUpdate = await LiveUpdate.find().populate({
                path: "category",
                select: ["_id", "name"],
            });
            for (let item of newArray) {
                delete item._id;
                item.name = "";
            }
            // mainSections.map((e, i) => {
            //     // e.image = process.env.BASE_URL.concat(e.image);
            //     delete e._id
            //     // if (e.name == "Live Updates") {
            //     //     e.image = process.env.BASE_URL.concat(liveUpdate[0].image);
            //     // }
            // });

            // liveUpdate[0].category_id = liveUpdate[0]._id
            // liveUpdate[0].category_name = liveUpdate[0].name

            // delete liveUpdate[0]._id
            // delete liveUpdate[0].name

            // Articles *******
            let categories = await ArticleCategory.find(
                { homepage: true },
                {
                    isDisabled: 0,
                    parent: 0,
                    homepage: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0,
                }
            );

            let ids = [];

            categories.map((e, i) => {
                ids.push(e._id + "");
            });

            let structure = [];
            let videoStructure = [];

            //articles
            for (i = 0; i < ids.length; i++) {
                let articles = await Articles.find(
                    { categories: ids[i] },
                    {
                        _id: 1,
                        heading: 1,
                        readTime: 1,
                        createdAt: 1,
                        image: 1,
                    }
                );
                articles.reverse();

                if (articles.length) {
                    articles = articles.slice(0, 3);
                    let category = await ArticleCategory.findOne(
                        { _id: mongoose.Types.ObjectId(ids[i]) },
                        {
                            _id: 1,
                            name: 1,
                            parent: 1,
                        }
                    ).lean();

                    if (category.parent != "main") {
                        let maincategory = await ArticleCategory.findOne({
                            _id: mongoose.Types.ObjectId(category.parent),
                        });

                        category.maincategory_id = maincategory._id;
                        category.maincategory_name = maincategory.name;
                    }

                    delete category.parent;

                    for (j = 0; j < articles.length; j++) {
                        let count = await Like.countDocuments({
                            contentId: mongoose.Types.ObjectId(articles[j]._id),
                        });
                        articles[j] = articles[j].toJSON();
                        articles[j].like_count = count;

                        let isSaved = await Save.findOne({
                            type: "article",
                            contentId: mongoose.Types.ObjectId(articles[j]._id),
                            userId: req.user._id,
                        });

                        if (isSaved) {
                            articles[j].is_saved = 1;
                        } else {
                            articles[j].is_saved = 0;
                        }

                        // is liked
                        let isLiked = await Like.findOne({
                            type: "article",
                            contentId: mongoose.Types.ObjectId(articles[j]._id),
                            userId: req.user._id,
                        });

                        if (isLiked) {
                            articles[j].is_liked = 1;
                        } else {
                            articles[j].is_liked = 0;
                        }

                        articles[j].image = process.env.BASE_URL.concat(articles[j].image);

                        articles[j].title = articles[j].heading;
                        delete articles[j].heading;

                        articles[j].type = "article";

                        let since = timeSince(articles[j].createdAt);

                        articles[j].createdAt = since;
                    }

                    let temp = category;
                    console.log("articles::", articles);
                    temp.article_list = articles;

                    structure.push(temp);
                }
            }

            //videos
            let videoCategories = await HealthcareVideoCategory.find(
                { homepage: true },
                {
                    name: 1,
                }
            );

            let videoIds = [];

            videoCategories.map((e, i) => {
                videoIds.push(e._id + "");
            });

            for (i = 0; i < videoIds.length; i++) {
                let healthcareVideos = await HealthcareVideos.find(
                    { subCategories: { $in: [videoIds[i]] } },
                    {
                        subCategories: 0,
                        homepageMain: 0,
                        homepageSub: 0,
                        updatedAt: 0,
                        __v: 0,
                    }
                );
                healthcareVideos.reverse();

                if (healthcareVideos.length) {
                    console.log("id:", ids[i]);
                    healthcareVideos = healthcareVideos.slice(0, 3);
                    let videoCategory = await HealthcareVideoCategory.findOne(
                        { _id: mongoose.Types.ObjectId(videoIds[i]) },
                        {
                            _id: 1,
                            name: 1,
                            parent: 1,
                        }
                    ).lean();

                    if (videoCategory.parent != "main") {
                        let maincategory = await HealthcareVideoCategory.findOne({
                            _id: mongoose.Types.ObjectId(videoCategory.parent),
                        });

                        videoCategory.maincategory_id = maincategory._id;
                        videoCategory.maincategory_name = maincategory.name;
                    }

                    delete videoCategory.parent;

                    for (j = 0; j < healthcareVideos.length; j++) {
                        let count = await Like.countDocuments({
                            contentId: mongoose.Types.ObjectId(healthcareVideos[j]._id),
                        });
                        healthcareVideos[j] = healthcareVideos[j].toJSON();
                        healthcareVideos[j].like_count = count;

                        let isSaved = await Save.findOne({
                            type: "healthcareVideo",
                            contentId: mongoose.Types.ObjectId(healthcareVideos[j]._id),
                            userId: req.user._id,
                        });

                        if (isSaved) {
                            healthcareVideos[j].is_saved = 1;
                        } else {
                            healthcareVideos[j].is_saved = 0;
                        }

                        // is liked
                        let isLiked = await Like.findOne({
                            type: "healthcareVideo",
                            contentId: mongoose.Types.ObjectId(healthcareVideos[j]._id),
                            userId: req.user._id,
                        });

                        if (isLiked) {
                            healthcareVideos[j].is_liked = 1;
                        } else {
                            healthcareVideos[j].is_liked = 0;
                        }

                        healthcareVideos[j].type = "healthcareVideo";

                        let since = timeSince(healthcareVideos[j].createdAt);

                        healthcareVideos[j].createdAt = since;

                        healthcareVideos[j].title = healthcareVideos[j].name;
                        delete healthcareVideos[j].name;

                        healthcareVideos[j].thumbnail = process.env.BASE_URL.concat(healthcareVideos[j].thumbnail);
                    }

                    console.log("cate:", videoCategory);

                    let temp = videoCategory;
                    temp.videos_list = healthcareVideos;

                    videoStructure.push(temp);
                }
            }

            let data = {
                bookmark_count: bookmarkCount,
                banner: banner,
                category: newArray,
                live_updates: liveUpdate[0].category,
                articles: structure,
                health_videos: videoStructure,
            };

            // let articles = await Articles.find({ categories:{ $elemMatch: {$in:array}}})
            // console.log('aa',articles)
            res.status(200).json({
                message: "success",
                error: false,
                data: data,
            });
        } catch (error) {
            next(error);
        }
    },
    getMedcoinCount: async (req, res, next) => {
        try {
            let medCoin = await user.findOne({ _id: req.user._id }, { medCoin: 1 });
            res.status(200).json({
                status: true,
                data: medCoin,
            });
        } catch (error) {
            next(error);
        }
    },
    getFoliofitHome: async (req, res, next) => {
        try {
            console.log("haii");

            // Fetching ads slider 1
            let foliofitSlider1 = await AdsFoliofitSlider1.aggregate([
                { $project: { id: "$_id", image: 1, type: 1, redirection_title: "$redirectTo" } },
            ]);
            console.log("foliofitSlider1", foliofitSlider1);
            foliofitSlider1.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
                // e.redirection_id = 0;
                delete e._id;
            });

            // Foliofit main sections
            let mainSections = await AdsFoliofitMainCategory.aggregate([
                {
                    $project: {
                        category_id: "$_id",
                        category_name: "$name",
                        cat_image: "$image",
                    },
                },
            ]);
            console.log("mainsections", mainSections);
            mainSections.map((e, i) => {
                e.cat_image = process.env.BASE_URL.concat(e.cat_image);
                delete e._id;
            });
            // Fetching ads slider 2
            let foliofitSlider2 = await AdsFoliofitSlider2.aggregate([
                {
                    $project: {
                        id: "$_id",
                        type: "$type",
                        redirection_id: "$typeId",
                        image: "$image",
                    },
                },
            ]);
            console.log("foliofitSlider2", foliofitSlider2);
            console.log("foliofitSlider2", foliofitSlider2.type);
            if (foliofitSlider2.length) {
                for (i = 0; i < foliofitSlider2.length; i++) {
                    if (foliofitSlider2[i].type == 0) {
                        let result1 = await product.find(
                            { _id: mongoose.Types.ObjectId(foliofitSlider2[i].redirection_id) },
                            { title: 1 }
                        );
                        if (result1.length) {
                            foliofitSlider2[i].redirection_title = result1[0].title;
                        }
                    } else {
                        let result2 = await proCategory.find(
                            { _id: mongoose.Types.ObjectId(foliofitSlider2[i].redirection_id) },
                            { title: 1 }
                        );
                        if (result2.length) {
                            foliofitSlider2[i].redirection_title = result2[0].title;
                        }
                    }
                }
            }
            foliofitSlider2.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
                // e.redirection_id = 0;
                delete e._id;
            });

            // Fetching ads ad 1
            let foliofitAd1 = await AdsFoliofitAd1Slider.aggregate([
                {
                    $match: {
                        sliderType: "ad1",
                    },
                },
                {
                    $project: {
                        type: "$type",
                        id: "$_id",
                        redirection_id: "$typeId",
                        image: "$image",
                    },
                },
            ]);
            if (foliofitAd1.length) {
                for (i = 0; i < foliofitAd1.length; i++) {
                    if (foliofitAd1[i].type == 0) {
                        let result5 = await product.find(
                            { _id: mongoose.Types.ObjectId(foliofitAd1[i].redirection_id) },
                            { title: 1 }
                        );
                        if (result5.length) {
                            foliofitAd1[i].redirection_title = result5[0].title;
                        }
                    } else {
                        let result6 = await proCategory.find(
                            { _id: mongoose.Types.ObjectId(foliofitAd1[i].redirection_id) },
                            { title: 1 }
                        );
                        if (result6.length) {
                            foliofitAd1[i].redirection_title = result6[0].title;
                        }
                    }
                }
            }

            foliofitAd1.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
                // e.redirection_id = 0;
                delete e._id;
            });
            // Fetching ads slider 3
            let FoliofitSlider3 = await AdsFoliofitSlider3.aggregate([
                {
                    $project: {
                        id: "$_id",
                        redirection_id: "$productId",
                        image: "$image",
                    },
                },
            ]);
            if (FoliofitSlider3.length) {
                for (i = 0; i < FoliofitSlider3.length; i++) {
                    let result3 = await product.find(
                        { _id: mongoose.Types.ObjectId(FoliofitSlider3[i].redirection_id) },
                        { title: 1 }
                    );
                    if (result3.length) {
                        FoliofitSlider3[i].redirection_title = result3[0].title;
                    }
                }
            }
            FoliofitSlider3.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
                // e.redirection_id = 0;
                delete e._id;
            });
            let catId = await foliofitHomePage.find({});
            console.log("33333", catId);
            let workout_routine = [];
            let result;
            let resultMain = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findById(catId[0].category).lean();
            if (resultMain) result = resultMain;
            let resultOther = await foliofitWeeklyWorkout.findById(catId[0].category).lean();
            if (resultOther) result = resultOther;
            console.log("#####3", result);
            for (let id of result.videos) {
                let video = await FolifitFitnessClub.findOne(
                    { _id: id },
                    {
                        title: 1,
                        video: 1,
                        image: { $concat: [imgPath, "$thumbnail"] },
                    }
                ).lean();
                // console.log(video);
                if (video) {
                    video.categoryId = catId[0].category;
                    workout_routine.push(video);
                }
            }
            let yoga_asanas = [];
            let category = await FoliofitMasterYogaHome.find({});
            // if(category){
            //   var categoryId =category[0].categoryId
            // }
            // yoga_asanas.push(categoryId=category[0].categoryId)
            let yoga;
            resultMain = await FoliofitMasterYogaMainCategory.find(
                { _id: mongoose.Types.ObjectId(category[0].categoryId) },
                { videos: 1 }
            );
            resultOther = await FoliofitMasterYogaHealthyRecommended.find(
                { _id: mongoose.Types.ObjectId(category[0].categoryId) },
                { videos: 1 }
            );

            resultWeekly = await FoliofitMasterYogaWeekly.find(
                { _id: mongoose.Types.ObjectId(category[0].categoryId) },
                { videos: 1 }
            );
            if (resultMain) {
                yoga = resultMain;
            } else if (resultOther) {
                yoga = resultOther;
            } else {
                yoga = resultWeekly;
            }
            console.log("yogaa", yoga);
            if (yoga) {
                for (let item of yoga) {
                    for (let ids of item.videos) {
                        let video = await FoliofitYoga.findOne(
                            { _id: mongoose.Types.ObjectId(ids) },
                            {
                                title: 1,
                                video: 1,
                                thumbnail: { $concat: [imgPath, "$thumbnail"] },
                                workoutTime: 1,
                            }
                        ).lean();
                        if (video) {
                            video.categoryId = category[0].categoryId;

                            yoga_asanas.push(video);
                        }
                    }
                }
                //  let  video = await FoliofitYoga.find({"_id" : {"$in" : yoga.videos}},
                //   {
                //       title:1,
                //       image:{ $concat: [ imgPath,"$thumbnail" ] },
                //       video:1,
                //       workoutTime:1,
                //   }).lean()
                //   if(video){
                //     if(categoryId){
                //    video[0].categoryId=categoryId
                //     }
                //    yoga_asanas.push(video[0])
                //   } else{
                //     yoga_asanas = []
                //   }
            }

            let home_testimonial = await FoliofitTestimonial.aggregate([
                { $match: { testimonialType: foliofitType, isDisabled: false } },
                { $project: { _id: 1, image: { $concat: [imgPath, "$image"] } } },
            ]);
            let userData = {};
            req.user = req.user.toJSON();
            if (req.user) {
                userData.userId = req.user._id;
                userData.userName = req.user.name;
                if (req.user.image) {
                    userData.userImage = process.env.BASE_URL.concat(req.user.image);
                } else {
                    userData.userImage = process.env.BASE_URL.concat("medfeed/head.jpeg");
                }
                let count1 = await Save.countDocuments({
                    userId: mongoose.Types.ObjectId(req.user._id),
                    type: "fitnessClub",
                });
                let count2 = await Save.countDocuments({ userId: mongoose.Types.ObjectId(req.user._id), type: "yoga" });
                userData.fav_count = count1 + count2;
            } else {
                userData.userName = "guest";
                userData.userImage = process.env.BASE_URL.concat("medfeed/head.jpeg");
                userData.fav_count = 0;
            }

            res.status(200).json({
                message: "success",
                error: false,
                data: {
                    banner: foliofitSlider1,
                    category: mainSections,
                    home_ads: foliofitSlider2,
                    workout_routine: workout_routine,
                    yoga_asanas: yoga_asanas,
                    home_ads1: FoliofitSlider3,
                    home_testimonial: home_testimonial,
                    foliofitAd1: foliofitAd1[0],
                    userData: userData,
                    // home_ads: [{
                    //     category_id: 0,
                    //     category_name: "Fitness club",
                    //     cat_image: "Image path",
                    // }, ],
                    // workout_routine: [{
                    //     id: 1,
                    //     title: "Session1",
                    //     image: "image path",
                    //     video: "video path",
                    // }, ],
                    // yoga_asanas: [{
                    //         id: 1,
                    //         title: "Session1",
                    //         image: "image path",
                    //         video: "video path",
                    //     },
                    //     {
                    //         id: 1,
                    //         title: "Session2",
                    //         image: "image path",
                    //         video: "video path",
                    //     },
                    // ],
                    // home_ads1: [{
                    //         id: 1,
                    //         image: "image path",
                    //         redirection_type: "yoga",
                    //         redirection_id: "0",
                    //     },
                    //     {
                    //         id: 1,
                    //         image: "image path",
                    //         redirection_type: "gym",
                    //         redirection_id: "0",
                    //     },
                    // ],
                    // home_testimonial: [{
                    //         id: 1,
                    //         image: "image path",
                    //     },
                    //     {
                    //         id: 1,
                    //         image: "image path",
                    //     },
                    // ],
                },
            });
        } catch (error) {
            next(error);
        }
    },
    getDietRegimeCat: async (req, res, next) => {
        try {
            const data = await DietPlan.aggregate([
                { $match: { isDisabled: false } },
                {
                    $project: {
                        name: 1,
                        image: 1,
                    },
                },
            ]);
            data.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
            });

            let isRated = await foliofitRating
                .findOne({ type: "dietRegime", userId: mongoose.Types.ObjectId(req.user._id) })
                .lean();
            let is_rating_added = false;

            if (isRated) {
                is_rating_added = true;
            }

            if (data) {
                res.status(200).json({
                    message: "success",
                    error: false,
                    data: data,
                    is_rating_added: is_rating_added,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getDietDays: async (req, res, next) => {
        try {
            let pageSize = req.body.limit;
            let pageNo = req.body.page;
            var aggregateQuery = DietDay.aggregate([
                { $match: { dietPlan: new mongoose.Types.ObjectId(req.body.id) } },
                {
                    $project: {
                        day: 1,
                        title: 1,
                        image: 1,
                    },
                },
            ]);
            const customLabels = {
                totalDocs: "TotalRecords",
                docs: "diet_days",
                limit: "PageSize",
                page: "CurrentPage",
            };

            const aggregatePaginateOptions = {
                page: pageNo,
                limit: pageSize,
                customLabels: customLabels,
            };
            let response = await DietDay.aggregatePaginate(aggregateQuery, aggregatePaginateOptions);

            // Attach day ang image url in response
            let dayDet = "Day ";
            response.diet_days.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
                e.day = dayDet.concat(e.day);
            });

            res.status(200).json({
                message: "success",
                error: false,
                data: response,
            });
        } catch (error) {
            next(error);
        }
    },
    getDietDaysDetails: async (req, res, next) => {
        try {
            const result = await DietDay.findOne({ _id: req.params.id }, { __v: 0, createdAt: 0, updatedAt: 0 });

            result.image = process.env.BASE_URL.concat(result.image);
            let dayDet = "Day";
            result.day = dayDet.concat(result.day);
            result.morning.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
            });
            result.afterNoon.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
            });
            result.evening.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
            });
            result.night.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
            });

            if (!result) res.status(200).json({ message: "Id not found", error: true });
            res.status(200).json({
                message: "success",
                error: false,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    getNutriChart: async (req, res, next) => {
        try {
            const banner = await AdsFoliofitBanner.findOne(
                { bannerType: nutrichart, isDisabled: false },
                {
                    categoryId: 1,
                    image: 1,
                    bannerType: 1,
                }
            ).lean();
            banner.image = process.env.BASE_URL.concat(banner.image);
            let result1 = await nutrichartCategory.findOne(
                {
                    _id: mongoose.Types.ObjectId(banner.categoryId),
                },
                { title: 1 }
            );
            let result2 = await nutrichartVitamin.findOne(
                {
                    _id: mongoose.Types.ObjectId(banner.categoryId),
                },
                { title: 1 }
            );
            let result3 = await nutrichartCategoryBased.findOne(
                {
                    _id: mongoose.Types.ObjectId(banner.categoryId),
                },
                { title: 1 }
            );

            if (result1) {
                banner.title = result1.title;
            } else if (result2) {
                banner.title = result2.title;
            } else {
                banner.title = result3.title;
            }
            const catagories = await nutrichartCategory.find(
                {},
                {
                    title: 1,
                    image: 1,
                }
            );
            for (i = 0; i < catagories.length; i++) {
                catagories[i].image = process.env.BASE_URL.concat(catagories[i].image);
            }
            const vitamins = await nutrichartVitamin.find(
                {},
                {
                    title: 1,
                    image: 1,
                }
            );
            for (k = 0; k < vitamins.length; k++) {
                vitamins[k].image = process.env.BASE_URL.concat(vitamins[k].image);
            }
            const category_based = await nutrichartCategoryBased.find(
                {},
                {
                    title: 1,
                    image: 1,
                }
            );
            for (x = 0; x < category_based.length; x++) {
                category_based[x].image = process.env.BASE_URL.concat(category_based[x].image);
            }
            const items = await nutrichartFood.find(
                { recommended: true },
                {
                    image: 1,
                    title: 1,
                }
            );
            for (y = 0; y < items.length; y++) {
                items[y].image = process.env.BASE_URL.concat(items[y].image);
            }
            const data = {
                banner: banner,
                catagories: catagories,
                vitamins: vitamins,
                category_based: category_based,
                items: items,
            };
            const response = {
                message: "Success",
                error: false,
                data: data,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    },
    addHealthReminder: async (req, res, next) => {
        try {
            let existing = await healthReminder.findOne({ userId: req.user._id, type: req.body.type });
            if (existing) {
                const data = {
                    type: req.body.type,
                    userId: req.user._id,
                    session: req.body.session,
                };
                await healthReminder.updateOne({ userId: req.user._id, type: req.body.type }, data).then((response) => {
                    console.log(response);
                    res.status(200).json({
                        error: false,
                        message: "Health Reminder Added",
                        data: {},
                    });
                });
            } else {
                const data = {
                    type: req.body.type,
                    userId: req.user._id,
                    session: req.body.session,
                };
                const obj = new healthReminder(data);
                obj.save((_) => {
                    res.status(200).json({
                        error: false,
                        message: "Health Reminder Added",
                        data: {},
                    });
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getHealthReminder: async (req, res, next) => {
        try {
            let result;
            let result1 = await healthReminder.findOne(
                { userId: req.user._id, type: req.body.type },
                {
                    type: 1,
                    session: 1,
                }
            );
            if (result1) {
                result = result1;
            } else {
                result = {};
            }
            res.status(200).json({
                error: false,
                message: "Success",
                data: {
                    result,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    addHealthCalculator: async (req, res, next) => {
        try {
            const bmi = await healthCalculator.findOne({ userId: mongoose.Types.ObjectId(req.user._id) });
            if (!bmi) {
                const data = {
                    userId: req.user._id,
                    bmi: req.body.status,
                };
                const obj = new healthCalculator(data);
                obj.save((_) => {
                    const response = {
                        message: "Successfully Updated",
                        error: false,
                    };
                    res.status(200).json(response);
                });
            } else {
                const result = await healthCalculator.updateOne({ userId: req.user._id }, { bmi: req.body.status });
                if (result.nModified == 1) {
                    const response = {
                        message: "Successfully Updated",
                        error: false,
                    };
                    res.status(200).json(response);
                } else {
                    const response = {
                        message: "Not Updated",
                        error: false,
                    };
                    res.status(200).json(response);
                }
            }
        } catch (error) {
            next(error);
        }
    },

    /* Get Foliofit Home 
    ============================================= */

    getFitnessClub: async (req, res, next) => {
        try {
            const imgPath = process.env.BASE_URL;
            // Fetching foliofit master main category
            let category = await FoliofitMasterFitnessMainHomeFullbodyHealthy.aggregate([
                { $match: { fitnessType: fitnessTypeMain, isDisabled: false } },
                {
                    $project: {
                        category_name: "$title",
                        cat_image: { $concat: [imgPath, "$icon"] },
                    },
                },
            ]);

            // Fetching foliofit master home workout
            let home_workout = await FoliofitMasterFitnessMainHomeFullbodyHealthy.aggregate([
                { $match: { fitnessType: fitnessTypeHome, isDisabled: false } },
                {
                    $project: {
                        name: "$title",
                        image: { $concat: [imgPath, "$icon"] },
                    },
                },
            ]);

            // Fetching foliofit master full body workout
            let fullbody_workout = await FoliofitMasterFitnessMainHomeFullbodyHealthy.aggregate([
                { $match: { fitnessType: fitnessTypeFullBody, isDisabled: false } },
                {
                    $project: {
                        name: "$title",
                        image: { $concat: [imgPath, "$icon"] },
                    },
                },
            ]);

            // Fetching foliofit master Healthy Journey workout
            let healthy_journey = await FoliofitMasterFitnessMainHomeFullbodyHealthy.aggregate([
                {
                    $match: {
                        fitnessType: fitnessTypeHealthyJourney,
                        isDisabled: false,
                    },
                },
                {
                    $project: {
                        name: "$title",
                        image: { $concat: [imgPath, "$icon"] },
                    },
                },
            ]);

            // Fetching foliofit master weekly workout
            let weekly_workout = await foliofitWeeklyWorkout.aggregate([{ $project: { name: "$title" } }]);

            // Fetching foliofit fitness club banner (ads floiofit fitness club banner)
            let banner = await AdsFoliofitBanner.aggregate([
                { $match: { bannerType: fitnessTypeBanner, isDisabled: false } },
                {
                    $project: {
                        image: { $concat: [imgPath, "$image"] },
                        redirection_type: "$categoryId",
                    },
                },
            ]);

            // Fetching foliofit fitness club Slider (ads floiofit fitness club slider)
            let slider = await AdsFoliofitAd1Slider.aggregate([
                { $match: { sliderType: fitnessTypeBanner, isDisabled: false } },
                {
                    $project: {
                        image: "$image",
                        redirection_id: "$type",
                        redirection_type: "$typeId",
                    },
                },
            ]);

            slider.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
                if (e.redirection_id == "0") {
                    e.redirection_id = "product";
                } else {
                    e.redirection_id = "category";
                }
            });

            // Checking whether user rated for yoga or not
            let isRated = await foliofitRating
                .findOne({ type: "fitness", userId: mongoose.Types.ObjectId(req.user._id) })
                .lean();
            let is_rating_added = false;

            if (isRated) {
                is_rating_added = true;
            }

            res.status(200).json({
                message: "success",
                error: false,
                data: {
                    category: category,
                    home_workout: home_workout,
                    fullbody_workout: fullbody_workout,
                    weekly_workout: weekly_workout,
                    healthy_journey: healthy_journey,
                    banner: banner[0],
                    slider: slider,
                    is_rating_added: is_rating_added,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    /* Nutri chart category (Foliofit -Nutrichart ) 
    ============================================= */
    viewAllNutrichartFoods: async (req, res, next) => {
        try {
            let result1 = await nutrichartCategory.findOne({
                _id: mongoose.Types.ObjectId(req.body.id),
            });
            let result2 = await nutrichartVitamin.findOne({
                _id: mongoose.Types.ObjectId(req.body.id),
            });
            let result3 = await nutrichartCategoryBased.findOne({
                _id: mongoose.Types.ObjectId(req.body.id),
            });
            let result;
            if (result1) {
                result = result1;
            } else if (result2) {
                result = result2;
            } else {
                result = result3;
            }
            if (result) {
                let veg = await nutrichartFood.aggregate([
                    {
                        $match: {
                            $and: [
                                {
                                    $or: [
                                        {
                                            category: mongoose.Types.ObjectId(req.body.id),
                                        },
                                        {
                                            categoriesBased: { $in: [req.body.id] },
                                        },
                                        {
                                            niceToAvoid: { $in: [req.body.id] },
                                        },
                                        {
                                            vitamins: { $in: [req.body.id] },
                                        },
                                    ],
                                },
                                {
                                    veg: true,
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            image: 1,
                            category: 1,
                        },
                    },
                ]);
                veg.map((e, i) => {
                    e.image = process.env.BASE_URL.concat(e.image);
                });
                let non = await nutrichartFood.aggregate([
                    {
                        $match: {
                            $and: [
                                {
                                    $or: [
                                        {
                                            category: mongoose.Types.ObjectId(req.body.id),
                                        },
                                        {
                                            categoriesBased: { $in: [req.body.id] },
                                        },
                                        {
                                            niceToAvoid: { $in: [req.body.id] },
                                        },
                                        {
                                            vitamins: { $in: [req.body.id] },
                                        },
                                    ],
                                },
                                {
                                    veg: false,
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            image: 1,
                            category: 1,
                        },
                    },
                ]);
                non.map((e, i) => {
                    e.image = process.env.BASE_URL.concat(e.image);
                });
                res.status(200).json({
                    status: true,
                    data: { veg, non },
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid category id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    // getNutrichartCategory: async (req, res, next) => {
    //     try {
    //         let result = await nutrichartCategory.find({}, { title: 1, image: 1 });

    //         result.map((e, i) => {
    //             e.image = process.env.BASE_URL.concat(e.image);
    //         });
    //         res.status(200).json({
    //             status: true,
    //             data: result,
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // },

    //viewAllNutrichartFoodsByCalorie
    viewAllNutrichartFoodsByCalorie: async (req, res, next) => {
        try {
            let category = await nutrichartCategoryBased.findOne({
                _id: mongoose.Types.ObjectId(req.body.id),
            });
            if (category) {
                let veg = await nutrichartFood.aggregate([
                    {
                        $match: {
                            $and: [
                                {
                                    $or: [
                                        {
                                            category: mongoose.Types.ObjectId(req.body.id),
                                        },
                                        {
                                            categoriesBased: { $in: [req.body.id] },
                                        },
                                        {
                                            niceToAvoid: { $in: [req.body.id] },
                                        },
                                    ],
                                },
                                {
                                    veg: true,
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            image: 1,
                            category: 1,
                        },
                    },
                ]);
                veg.map((e, i) => {
                    e.image = process.env.BASE_URL.concat(e.image);
                });
                let non = await nutrichartFood.aggregate([
                    {
                        $match: {
                            $and: [
                                {
                                    $or: [
                                        {
                                            category: mongoose.Types.ObjectId(req.body.id),
                                        },
                                        {
                                            categoriesBased: { $in: [req.body.id] },
                                        },
                                        {
                                            niceToAvoid: { $in: [req.body.id] },
                                        },
                                    ],
                                },
                                {
                                    veg: false,
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            image: 1,
                            category: 1,
                        },
                    },
                ]);
                non.map((e, i) => {
                    e.image = process.env.BASE_URL.concat(e.image);
                });
                let niceToAvoid = await nutrichartFood.aggregate([
                    {
                        $match: {
                            niceToAvoid: { $in: [req.body.id] },
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            image: 1,
                            category: 1,
                        },
                    },
                ]);
                niceToAvoid.map((e, i) => {
                    e.image = process.env.BASE_URL.concat(e.image);
                });
                // let niceToAvoid = await nutrichartFood.find({
                //   niceToAvoid: { $in: req.body.id },
                // });
                // res.status(200).json({
                //   status: true,
                //   data: { veg, non, niceToAvoid },
                // });
                res.status(200).json({
                    status: true,
                    data: { veg, non, niceToAvoid },
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid category id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    /* Nutri chart Details  (Foliofit -Nutrichart ) 
    ============================================= */
    getNutrichartDetails: async (req, res, next) => {
        try {
            let imgPath = process.env.BASE_URL;
            let result = await nutrichartFood.findOne(
                { _id: mongoose.Types.ObjectId(req.body.id) },
                {
                    title: 1,
                    description: 1,
                    image: { $concat: [imgPath, "$image"] },
                    banner: { $concat: [imgPath, "$banner"] },
                }
            );
            if (result) {
                res.status(200).json({
                    status: true,
                    data: result,
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: "invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Get Foliofit Home 
    ============================================= */

    getYogaHome: async (req, res, next) => {
        try {
            let imgPath = process.env.BASE_URL;
            // Fetching foliofit master yoga main category
            let category = await FoliofitMasterYogaMainCategory.aggregate([
                { $match: { isDisabled: false } },
                {
                    $project: { title: "$title", image: { $concat: [imgPath, "$icon"] } },
                },
            ]);

            // Fetching foliofit master Yoga Start Your Healthy
            let start_healthy = await FoliofitMasterYogaHealthyRecommended.aggregate([
                { $match: { yogaType: yogaTypeHealthy, isDisabled: false } },
                { $project: { image: { $concat: [imgPath, "$icon"] } } },
            ]);

            // Fetching foliofit master Recommended
            let weekly_workout = await FoliofitMasterYogaHealthyRecommended.aggregate([
                { $match: { yogaType: yogaTypeRecommended, isDisabled: false } },
                {
                    $project: {
                        title: "$title",
                        image: { $concat: [imgPath, "$icon"] },
                    },
                },
            ]);

            let weekly_workout_days = await FoliofitMasterYogaWeekly.aggregate([
                { $match: { isDisabled: false } },
                {
                    $project: {
                        title: "$title",
                    },
                },
            ]);

            // Fetching foliofit yoga  banner (ads floiofit yoga banner)
            let banner = await AdsFoliofitBanner.aggregate([
                { $match: { bannerType: yoga, isDisabled: false } },
                { $project: { image: "$image", redirection_type: "$categoryId" } },
            ]);

            banner.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
                e.type = "category";
            });

            //Fetching foliofit yoga Slider (ads floiofit yoga slider)
            let slider = await AdsFoliofitAd1Slider.aggregate([
                { $match: { sliderType: yoga, isDisabled: false } },
                {
                    $project: { image: "$image", type: "$type", redirect_id: "$typeId" },
                },
            ]);

            slider.map((e, i) => {
                e.image = process.env.BASE_URL.concat(e.image);
                if (e.type == "0") {
                    e.type = "product";
                } else {
                    e.type = "category";
                }
            });

            // Fetching foliofit Testimonial
            let testimonial = await FoliofitTestimonial.aggregate([
                { $match: { testimonialType: yoga, isDisabled: false } },
                { $project: { _id: 0, image: { $concat: [imgPath, "$image"] } } },
            ]);

            // Checking whether user rated for yoga or not
            let isRated = await foliofitRating
                .findOne({ type: "yoga", userId: mongoose.Types.ObjectId(req.user._id) })
                .lean();
            let is_rating_added = false;

            if (isRated) {
                is_rating_added = true;
            }

            res.status(200).json({
                message: "success",
                error: false,
                data: {
                    category: category,
                    start_healthy: start_healthy,
                    weekly_workout: weekly_workout,
                    weekly_workout_days: weekly_workout_days,
                    testimonial: testimonial,
                    banner: banner[0],
                    slider: slider,
                    is_rating_added: is_rating_added,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    searchMedfeed: async (req, res, next) => {
        try {
            let keyword = req.body.keyword;
            // console.log(keyword)
            if (keyword) {
                let articleResult = [];
                let HealthCareResult = [];
                let HealthTipResult = [];

                let article = await Articles.find(
                    {
                        $or: [{ $text: { $search: `"\"${keyword}\""` } }],
                    },
                    {
                        _id: 1,
                        title: "$heading",
                        image: 1,
                        readTime: 1,
                        createdAt: 1,
                    }
                ).lean();
                for (let item of article) {
                    let count = await Like.countDocuments({
                        contentId: mongoose.Types.ObjectId(item._id),
                    });
                    item.like_count = count;
                    // is liked
                    let isLiked = await Like.findOne({
                        type: "article",
                        contentId: mongoose.Types.ObjectId(item._id),
                        userId: req.user._id,
                    });

                    if (isLiked) {
                        item.is_liked = 1;
                    } else {
                        item.is_liked = 0;
                    }
                    let isSaved = await Save.findOne({
                        type: "article",
                        contentId: mongoose.Types.ObjectId(item._id),
                        userId: req.user._id,
                    });

                    if (isSaved) {
                        item.is_saved = 1;
                    } else {
                        item.is_saved = 0;
                    }
                    item.image = process.env.BASE_URL.concat(item.image);
                    item.video = "";
                    item.thumbnail = "";
                    item.duration = "";
                    item.description = "";
                    let since = timeSince(item.createdAt);
                    item.createdAt = since;
                    item.type = "article";
                    articleResult.push(item);
                }
                let healthcareVideo = await HealthcareVideos.find(
                    {
                        $or: [{ $text: { $search: `"\"${keyword}\""` } }],
                    },
                    {
                        _id: 1,
                        title: "$name",
                        thumbnail: 1,
                        video: 1,
                        createdAt: 1,
                        duration: 1,
                    }
                ).lean();
                for (let itemVideo of healthcareVideo) {
                    let count = await Like.countDocuments({
                        contentId: mongoose.Types.ObjectId(itemVideo._id),
                    });
                    itemVideo.like_count = count;
                    // is liked
                    let isLiked = await Like.findOne({
                        type: "healthcareVideo",
                        contentId: mongoose.Types.ObjectId(itemVideo._id),
                        userId: req.user._id,
                    });

                    if (isLiked) {
                        itemVideo.is_liked = 1;
                    } else {
                        itemVideo.is_liked = 0;
                    }

                    let isSaved = await Save.findOne({
                        type: "healthcareVideo",
                        contentId: mongoose.Types.ObjectId(itemVideo._id),
                        userId: req.user._id,
                    });

                    if (isSaved) {
                        itemVideo.is_saved = 1;
                    } else {
                        itemVideo.is_saved = 0;
                    }
                    let since = timeSince(itemVideo.createdAt);
                    itemVideo.createdAt = since;
                    itemVideo.thumbnail = process.env.BASE_URL.concat(itemVideo.thumbnail);
                    itemVideo.readTime = "";
                    itemVideo.image = "";
                    itemVideo.description = "";
                    itemVideo.type = "healthcareVideo";
                    HealthCareResult.push(itemVideo);
                }
                let healthTip = await HealthTip.find(
                    {
                        $or: [{ $text: { $search: `"\"${keyword}\""` } }],
                    },
                    {
                        _id: 1,
                        title: "$heading",
                        image: 1,
                        description: 1,
                        createdAt: 1,
                        readTime: 1,
                    }
                ).lean();
                for (let itemTip of healthTip) {
                    let count = await Like.countDocuments({
                        contentId: mongoose.Types.ObjectId(itemTip._id),
                    });
                    // is liked
                    let isLiked = await Like.findOne({
                        type: "healthTip",
                        contentId: mongoose.Types.ObjectId(itemTip._id),
                        userId: req.user._id,
                    });

                    if (isLiked) {
                        itemTip.is_liked = 1;
                    } else {
                        itemTip.is_liked = 0;
                    }
                    itemTip.isSaved = 0;
                    itemTip.like_count = count;
                    let since = timeSince(itemTip.createdAt);
                    itemTip.createdAt = since;
                    itemTip.image = process.env.BASE_URL.concat(itemTip.image);
                    itemTip.video = "";
                    itemTip.thumbnail = "";
                    itemTip.type = "healthTip";
                    itemTip.duration = "";
                    HealthTipResult.push(itemTip);
                }
                let allResult = [...HealthTipResult, ...HealthCareResult, ...articleResult];
                res.status(200).json({
                    message: "success",
                    error: false,
                    data: {
                        allResult,
                    },
                });
            } else {
                res.status(200).json({
                    error: true,
                    data: "Please enter search keyword",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getFitnessClubSession: async (req, res, next) => {
        try {
            let session = [];
            let category;
            let id = req.body.cat_id;
            console.log(id);
            let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne(
                { _id: id },
                {
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    banner: { $concat: [imgPath, "$banner"] },
                    videos: 1,
                }
            ).lean();
            if (fitness) category = fitness;
            let workout = await foliofitWeeklyWorkout
                .findOne(
                    { _id: id },
                    {
                        title: 1,
                        subTitle: 1,
                        benefits: 1,
                        banner: { $concat: [imgPath, "$banner"] },
                        videos: 1,
                    }
                )
                .lean();
            if (workout) {
                category = workout;
            }
            for (let ids of category.videos) {
                let video = await FolifitFitnessClub.findById(ids, {
                    title: 1,
                    time: "$workoutTime",
                    thumbnail: { $concat: [imgPath, "$thumbnail"] },
                    gif: 1,
                    video: 1,
                    descriptionEnglish: 1,
                    descriptionMalayalam: 1,
                }).lean();
                if (video) {
                    let fav = await Save.findOne({ contentId: video._id, type: "fitnessClub", userId: req.user._id });
                    if (fav) {
                        video.is_fav = 1;
                    } else {
                        video.is_fav = 0;
                    }
                    session.push(video);
                }
            }
            if (category) {
                delete category.videos;
            }
            for (let item of session) {
                if (item.gif.type == 1) {
                    item.gif.gifImage = process.env.BASE_URL.concat(item.gif.gifImage);
                } else {
                    item.gif.gifVideo = process.env.BASE_URL.concat(item.gif.gifVideo);
                }
            }

            res.status(200).json({
                error: true,
                data: {
                    category,
                    session,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    getFitnessClubSessionById: async (req, res, next) => {
        try {
            let video = await FolifitFitnessClub.findById(req.body.sess_id, {
                title: 1,
                time: "$workoutTime",
                thumbnail: { $concat: [imgPath, "$thumbnail"] },
                gif: 1,
                video: 1,
                descriptionEnglish: 1,
                descriptionMalayalam: 1,
            }).lean();
            if (video) {
                if (video.gif.type == 1) {
                    video.gif.gifImage = process.env.BASE_URL.concat(video.gif.gifImage);
                } else {
                    video.gif.gifVideo = process.env.BASE_URL.concat(video.gif.gifVideo);
                }
                res.status(200).json({
                    error: true,
                    data: {
                        session: video,
                    },
                });
            } else {
                res.status(200).json({
                    error: true,
                    data: {
                        session: {},
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    },
    getFitnessClubSessionDetails: async (req, res, next) => {
        try {
            let session = [];
            let category;
            let id = req.body.cat_id;
            let sessionVideo = {};
            console.log(id);
            let fitness = await FoliofitMasterFitnessMainHomeFullbodyHealthy.findOne(
                { _id: id },
                {
                    title: 1,
                    videos: 1,
                }
            ).lean();
            if (fitness) category = fitness;
            let workout = await foliofitWeeklyWorkout
                .findOne(
                    { _id: id },
                    {
                        title: 1,
                        videos: 1,
                    }
                )
                .lean();
            if (workout) {
                category = workout;
            }
            for (let ids of category.videos) {
                let video = await FolifitFitnessClub.findById(ids, {
                    title: 1,
                    time: "$workoutTime",
                    thumbnail: { $concat: [imgPath, "$thumbnail"] },
                    gif: 1,
                    video: 1,
                    descriptionEnglish: 1,
                    descriptionMalayalam: 1,
                }).lean();
                if (video) {
                    if (video._id == req.body.sess_id) {
                        sessionVideo = video;
                    }
                    let fav = await Save.findOne({ contentId: video._id, type: "fitnessClub", userId: req.user._id });
                    if (fav) {
                        video.is_fav = 1;
                    } else {
                        video.is_fav = 0;
                    }
                    session.push(video);
                }
            }
            if (category) {
                delete category.videos;
            }
            for (let item of session) {
                if (item.gif.type == 1) {
                    item.gif.gifImage = process.env.BASE_URL.concat(item.gif.gifImage);
                } else {
                    item.gif.gifVideo = process.env.BASE_URL.concat(item.gif.gifVideo);
                }
            }

            res.status(200).json({
                error: true,
                data: {
                    category,
                    sessionDetails: sessionVideo,
                    allSession: session,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    getYogaSessions: async (req, res, next) => {
        try {
            let session = [];
            let category;
            let id = req.body.cat_id;
            let yoga = await FoliofitMasterYogaMainCategory.findOne(
                { _id: id },
                {
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    banner: { $concat: [imgPath, "$banner"] },
                    videos: 1,
                }
            ).lean();
            if (yoga) category = yoga;
            let healthy = await FoliofitMasterYogaHealthyRecommended.findOne(
                { _id: id },
                {
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    banner: { $concat: [imgPath, "$banner"] },
                    videos: 1,
                }
            ).lean();
            if (healthy) {
                category = healthy;
            }
            let weekly = await FoliofitMasterYogaWeekly.findOne(
                { _id: id },
                {
                    title: 1,
                    subTitle: 1,
                    benefits: 1,
                    banner: { $concat: [imgPath, "$image"] },
                    videos: 1,
                }
            ).lean();
            if (weekly) {
                category = weekly;
            }

            for (let ids of category.videos) {
                let video = await FoliofitYoga.findById(ids, {
                    title: 1,
                    time: "$workoutTime",
                    thumbnail: { $concat: [imgPath, "$thumbnail"] },
                    video: 1,
                }).lean();
                if (video) {
                    let fav = await Save.findOne({ contentId: video._id, type: "yoga", userId: req.user._id });
                    if (fav) {
                        video.is_fav = 1;
                    } else {
                        video.is_fav = 0;
                    }
                    // session.push(video);
                    session.push(video);
                }
            }
            if (category) {
                delete category.videos;
            }
            let count1 = await Save.countDocuments({ userId: mongoose.Types.ObjectId(req.user._id), type: "fitnessClub" });
            let count2 = await Save.countDocuments({ userId: mongoose.Types.ObjectId(req.user._id), type: "yoga" });
            category.fav_count = count1 + count2;
            res.status(200).json({
                error: true,
                data: {
                    category,
                    session,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    getYogaSessionById: async (req, res, next) => {
        try {
            let video = await FoliofitYoga.findById(req.body.sess_id, {
                title: 1,
                time: "$workoutTime",
                thumbnail: { $concat: [imgPath, "$thumbnail"] },
                video: 1,
            }).lean();
            if (video) {
                // if(video.gif.type==1){
                //   video.gif.gifImage = process.env.BASE_URL.concat(video.gif.gifImage)
                // }else{
                //   video.gif.gifVideo = process.env.BASE_URL.concat(video.gif.gifVideo)
                // }
                res.status(200).json({
                    error: true,
                    data: {
                        session: video,
                    },
                });
            } else {
                res.status(200).json({
                    error: true,
                    data: {
                        session: {},
                    },
                });
            }
        } catch (error) {
            next(error);
        }
    },

    getFitnessClubBookmark: async (req, res, next) => {
        try {
            let result = [];
            let fitness = await Save.find({ userId: mongoose.Types.ObjectId(req.user._id), type: "fitnessClub" });
            let yog = await Save.find({ userId: mongoose.Types.ObjectId(req.user._id), type: "yoga" });
            let saved_list = [...fitness, ...yog];
            console.log(saved_list);
            for (let item of saved_list) {
                console.log(item.type);
                let fitnessVideo = await FolifitFitnessClub.findOne(
                    { _id: mongoose.Types.ObjectId(item.contentId) },
                    {
                        title: 1,
                        time: "$workoutTime",
                        thumbnail: { $concat: [imgPath, "$thumbnail"] },
                    }
                ).lean();
                let yogaVideo = await FoliofitYoga.findById(
                    { _id: mongoose.Types.ObjectId(item.contentId) },
                    {
                        title: 1,
                        time: "$workoutTime",
                        thumbnail: { $concat: [imgPath, "$thumbnail"] },
                    }
                ).lean();

                if (fitnessVideo) {
                    console.log();
                    fitnessVideo.type = item.type;
                    result.push(fitnessVideo);
                }
                if (yogaVideo) {
                    yogaVideo.type = item.type;
                    result.push(yogaVideo);
                }
            }
            res.status(200).json({
                error: true,
                data: {
                    result,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    getBmiDetails: async (req, res, next) => {
        try {
            let existing = await bmiCount.find();
            if (existing.length == 0) {
                console.log("in if");
                const data = {
                    count: 1000000,
                };
                const obj = bmiCount(data);
                obj.save();
            } else {
                await bmiCount.updateOne({ _id: existing[0]._id }, { $inc: { count: 1 } });
            }
            let counts = await bmiCount.find();
            let userName = await user.findOne({ _id: mongoose.Types.ObjectId(req.user._id) });
            let bmiStatus = await healthCalculator.findOne({ userId: req.user._id });

            res.status(200).json({
                error: true,
                data: {
                    count: counts[0].count,
                    name: userName.name,
                    status: bmiStatus.bmi,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    getFoliofitClubBookmarkByType: async (req, res, next) => {
        try {
            let result = [];
            if (req.body.type == "fitnessClub") {
                let saved_list = await Save.find({ userId: mongoose.Types.ObjectId(req.user._id), type: "fitnessClub" });
                for (let item of saved_list) {
                    let fitnessVideo = await FolifitFitnessClub.findOne(
                        { _id: mongoose.Types.ObjectId(item.contentId) },
                        {
                            title: 1,
                            time: "$workoutTime",
                            thumbnail: { $concat: [imgPath, "$thumbnail"] },
                        }
                    ).lean();
                    if (fitnessVideo) {
                        result.push(fitnessVideo);
                    }
                }
            }
            if (req.body.type == "yoga") {
                let saved_list = await Save.find({ userId: mongoose.Types.ObjectId(req.user._id), type: "yoga" });
                for (let item of saved_list) {
                    let yogaVideo = await FoliofitYoga.findById(
                        { _id: mongoose.Types.ObjectId(item.contentId) },
                        {
                            title: 1,
                            time: "$workoutTime",
                            thumbnail: { $concat: [imgPath, "$thumbnail"] },
                            video: 1,
                        }
                    ).lean();
                    if (yogaVideo) {
                        result.push(yogaVideo);
                    }
                }
            }
            res.status(200).json({
                error: true,
                data: {
                    result,
                },
            });
        } catch (error) {}
    },
    getVimeoGif: async (req, res, next) => {
        try {
            let config = {
                headers: {
                    Authorization: "Bearer " + process.env.VIMEO_ACCESS_TOKEN,
                },
            };
            axios
                .get(`https://api.vimeo.com/videos/${req.body.gifId}`, config)
                .then((response) => {
                    console.log(response.data);
                    res.status(200).json({
                        error: true,
                        data: "hi",
                    });
                })
                .catch((error) => {
                    console.log(error);
                    res.status(200).json({
                        error: true,
                        data: {},
                    });
                });
        } catch (error) {}
    },

    /* Master settings 
    ============================================= */
    getCategories: async (req, res, next) => {
        try {
        // let healthcareBanner = []
        let category =[]
        let productDetails = [];  // most buyed products.Pending

        let healthcareBanner  = ""
        var limit = 0
        if(req.body.limit){
            limit = parseInt(req.body.limit);
        }         
        
        if (limit == 0) limit = 12;
        var skip = (parseInt(req.body.page) - 1) * parseInt(limit);

        // --------Ads medimall healthcare banner
        healthcareBanner = await AdsMedimallTopIconCatHealth.findOne(
            { sliderType: categoryTypeHealth, isDisabled: false },
            {
                image: { $concat: [imgPath, "$image"] },
                _id: 0,
            }
        ).sort("-id")
        .limit(limit)
        .skip(skip)

            if(healthcareBanner){
                healthcareBanner = healthcareBanner.image
            }else{
                healthcareBanner =""
            }


        // --------active category in healthcare (master settings)
        
    
        category = await MasterCategory.find(
            { categoryType: categoryTypeHealth, isDisabled: false },
            {
                title: 1,
                image: { $concat: [imgPath, "$image"] },
            }
        ).sort("-id")
        .limit(limit)
        .skip(skip)
        .exec(async function(err, category) {
            var productDetails =[]
            // for (let ids of category) {
                productDetails = await Inventory.find(
                    {type:"healthcare"},
                    {
                        name: 1,                      
                        "pricing.image": 1,
                        "pricing.price": 1,
                        "pricing.specialPrice": 1,
                        "pricing.uom": 1,
                        "pricing.sku": 1,
                        "pricing.stock": 1,
                        "pricing._id": 1,
                        }
                    ).sort("-id")
                    .limit(limit)
                    .skip(skip)
                    let items =[]
                    for (let item of productDetails) {

                        // let uomTitle =""
                    
                        // let uom  = await MasterUOMValue.findOne(
                        //     { _id: mongoose.Types.ObjectId(item.pricing[0].sku) },
                        //     {
                        //         uomValue: 1                                
                        //     }
                        // )
                    
                        // if(uom){
                        //     uomTitle = uom.uomValue
                        // }
                        // let data = {
                        //     _id: item._id,
                        //     image : item.pricing[0].image[0],
                        //     title : item.name,
                        //     price : item.pricing[0].price,                            
                        //     spl_price : item.pricing[0].specialPrice,
                        //     uom : uomTitle,
                        // }
                        // items.push(data)
                        
                        var checkStock  = false
                        let uomTitle =""  
                       
                        var data = {
                            _id:item._id,
                            title : item.name,
                        }        
                                  
                        for (let pricing of item.pricing){
                            if(!checkStock){
                                if(pricing.stock>0){ 
                                    checkStock = true                                                  
                                    let uom  = await MasterUOMValue.findOne(
                                        { _id: mongoose.Types.ObjectId(pricing.sku) },
                                        {
                                            uomValue: 1                                
                                        }
                                    )                     
                                    if(uom){
                                        uomTitle = uom.uomValue
                                    }
                                    data.image = ""
                                    data.discount = ""
                                  
                                    if(pricing.image[0]){
                                        data.image =imgPath.concat(pricing.image[0])
                                    }
                                    
                                    let discountPercentage = ((pricing.price - pricing.specialPrice)/pricing.price)* 100
                                    if(discountPercentage >0 && discountPercentage <100){
                                        data.discount = discountPercentage + "%"    
                                    }
                                    data.product_variantId = pricing._id
                                    data.price = pricing.price
                                    data.spl_price = pricing.specialPrice
                                    data.uom = uomTitle
                                   
                                    items.push(data)
                                   
                                }

                            }
                           
                        }
                    } 
            res.status(200).json({
            error: false,
            message: "Categories are",
            data: {
                image:healthcareBanner,
                category: category,
                products: items,
            },
            });
        })
        
        
        } catch (error) {
            next(error);
        }
    },


    getSubCategories: async (req, res, next) => {
        try {
            let products = []
            let category = []

            var limit = 0
            if(req.body.limit){
              limit = parseInt(req.body.limit);
            }
            if (limit == 0) limit = 10;
            var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
            
            
            category = await MasterCategory.findOne(
                { _id: req.body.cat_id, isDisabled: false },
                {
                    title: 1,
                    image: { $concat: [imgPath, "$image"] },
                }
            ).sort("-id")
                .limit(limit)
                .skip(skip)
           
            if (category) {
              
              let sub_category = []
            
                 sub_category = await MasterSubCategoryHealthcare.find(
                    { categoryId:req.body.cat_id, isDisabled: false },
                    {
                        title: 1,
                        image: { $concat: [imgPath, "$image"] }
                    }
                ).sort("-id")
                .limit(limit)
                .skip(skip)
                .exec(async function(err, sub_category) {
                    var productDetails =[]
                    // for (let ids of category) {
                        productDetails = await Inventory.find(
                            {type:"healthcare" },
                            {
                                name: 1,                      
                                "pricing.image": 1,
                                "pricing.price": 1,
                                "pricing.specialPrice": 1,
                                "pricing.uom": 1,
                                "pricing.sku": 1,
                                "pricing.stock": 1,
                                "pricing._id": 1,
                                }
                            ).sort("-id")
                            .limit(limit)
                            .skip(skip)

                    let items =[]
                    for (let item of productDetails) {
                        // let uomTitle =""
                    
                        // let uom  = await MasterUOMValue.findOne(
                        //     { _id: mongoose.Types.ObjectId(item.pricing[0].sku) },
                        //     {
                        //         uomValue: 1                                
                        //     }
                        // )
                     
                        // if(uom){
                        //     uomTitle = uom.uomValue
                        // }
                        // let data = {
                        //     _id: item._id,
                        //     image : item.pricing[0].image[0],
                        //     title : item.name,
                        //     price : item.pricing[0].price,                            
                        //     spl_price : item.pricing[0].specialPrice,
                        //     uom : uomTitle,
                        // }
                        // items.push(data)

                        var checkStock  = false
                        let uomTitle =""  
                       
                        var data = {
                            _id:item._id,
                            title : item.name,
                        }        
                                  
                        for (let pricing of item.pricing){
                            if(!checkStock){
                                if(pricing.stock>0){ 
                                    checkStock = true                                                  
                                    let uom  = await MasterUOMValue.findOne(
                                        { _id: mongoose.Types.ObjectId(pricing.sku) },
                                        {
                                            uomValue: 1                                
                                        }
                                    )                     
                                    if(uom){
                                        uomTitle = uom.uomValue
                                    }
                                    data.image = ""
                                    data.discount = ""
                                  
                                    if(pricing.image[0]){
                                        data.image =imgPath.concat(pricing.image[0])
                                    }
                                    
                                    let discountPercentage = ((pricing.price - pricing.specialPrice)/pricing.price)* 100
                                    if(discountPercentage >0 && discountPercentage <100){
                                        data.discount = discountPercentage + "%"    
                                    }
                                    data.product_variantId = pricing._id
                                    data.price = pricing.price
                                    data.spl_price = pricing.specialPrice
                                    data.uom = uomTitle
                                   
                                    items.push(data)
                                   
                                }

                            }
                           
                        }
                    } 




                  res.status(200).json({
                    error: false,
                    message: "Sub categories are",
                    data: {
                        image: category.image,
                        category: category.title,
                        sub_category: sub_category,
                        products: items,
                    },
                });
                })
            }else{              
              res.status(200).json({
                error: false,
                message: "No data found",
                data: {
                    image:"",
                    category:[],
                    sub_category: [],
                    products:[],
                },
            });

            }

            // Most buyed product listing - Pending
        } catch (error) {
            next(error);
        }
    },


    getProducts: async (req, res, next) => {
      try {
          let products = []
          let category = []
          let banner =""
         let subcategoryBanner = await MasterSubCategoryHealthcare.find(
            { _id: req.body.cat_id, isDisabled: false },
            {               
                banner: { $concat: [imgPath, "$banner"] }
            }
         );

         if(subcategoryBanner.length!=0){
             banner = subcategoryBanner[0].banner
         }

         var limit = 0
         if(req.body.limit){
           limit = parseInt(req.body.limit);
         }         
       
         if (limit == 0) limit = 10;
         var skip = (parseInt(req.body.page) - 1) * parseInt(limit);

         let subSubcategory = await MasterSubSubCategoryHealthcare.find(
              { subCategoryId: req.body.cat_id, isDisabled: false },
              {
                  title: 1,
                  image: { $concat: [imgPath, "$image"] }
              }
          ).sort("-id")
          .limit(limit)
          .skip(skip)
       
           // subSubcategory.push({id:req.body.cat_id})

         //   console.log(subSubcategory)

        

            let items =[]
            for (let ids of subSubcategory) {                 
                let productDetails = await Inventory.find(
                    {categories: ids.id },
                    {
                        name: 1,                      
                        "pricing.image": 1,
                        "pricing.price": 1,
                        "pricing.specialPrice": 1,
                        "pricing.uom": 1,
                        "pricing.sku": 1,
                        "pricing.stock": 1,
                        "pricing._id": 1,
                        }
                    ).sort("-id")
                    .limit(limit)
                    .skip(skip)
                     
                    for (let item of productDetails) { 
                        var checkStock  = false
                        let uomTitle =""  
                       
                        var data = {
                            _id:item._id,
                            title : item.name,
                        }                     
                        for (let pricing of item.pricing){
                            if(!checkStock){
                                if(pricing.stock>0){  
                                    checkStock = true                                                  
                                    let uom  = await MasterUOMValue.findOne(
                                        { _id: mongoose.Types.ObjectId(pricing.sku) },
                                        {
                                            uomValue: 1                                
                                        }
                                    )                     
                                    if(uom){
                                        uomTitle = uom.uomValue
                                    }
                                    data.image = ""
                                    data.discount = ""
                                    if(pricing.image[0]){
                                        data.image =imgPath.concat(pricing.image[0])
                                    }
                                    
                                    let discountPercentage = ((pricing.price - pricing.specialPrice)/pricing.price)* 100
                                    if(discountPercentage >0 && discountPercentage <100){
                                        data.discount = discountPercentage + "%"    
                                    }
                                   
                                    data.price = pricing.price
                                    data.spl_price = pricing.specialPrice
                                    data.uom = uomTitle
                                   
                                    items.push(data)

                                }

                            }
                           
                        }
                       

                     
                    } 
                }
          res.status(200).json({
            error: false,
            message: "Products are",
            data: {
              banner:banner,
              sub_subcategory: subSubcategory,
              products: items,
            },
          });
         


      } catch (error) {
          next(error);
      }
    },


    getProductDetails: async (req, res, next) => {
        try {
            let productDetails = []
                    
            productDetails = await Inventory.aggregate([
                { 
                    $match: { 
                        _id: mongoose.Types.ObjectId(req.body.id)
                    }
                },
                {
                    $project: {
                        title: '$name',
                        direction_use:'$directionsOfUse',
                        "pricing._id": 1,
                        "pricing.image": 1,
                        "pricing.expiryDate": 1,
                        "pricing.price": 1,
                        "pricing.specialPrice": 1,
                        "pricing.uom": 1,
                        "pricing.sku": 1,
                        "pricing.stock": 1,
                        "description": 1,
                        "substitutions": 1,
                        "relatedProducts":1
                    }
                },
            ])
           

            for (let items of productDetails) {
                let reProducts = []
                let subProducts = []
                let pricings = []
                let pricingDetails = []


                for (let item of items.relatedProducts) {                    
                    let product  = await Inventory.findOne(
                        { _id: mongoose.Types.ObjectId(item) },
                        {
                            name: 1,                      
                            "pricing.image": 1,
                            "pricing.price": 1,
                            "pricing.specialPrice": 1,
                            "pricing.uom": 1,
                            "pricing.sku": 1,
                            "pricing.stock": 1,
                            "pricing._id": 1,                          
                        }
                    )  
                    
                    if(product){
                        let data = {
                            _id:product._id,
                            title : product.name,
                        } 
                        for (let pricing of product.pricing) {
                            if(pricing.stock > 0) {
                                data.image = ""
                                data.discount = ""
                                if(pricing.image[0]){
                                    data.image =imgPath.concat(pricing.image[0])
                                }
                                
                                let discountPercentage = ((pricing.price - pricing.specialPrice)/pricing.price)* 100
                                if(discountPercentage >0 && discountPercentage <100){
                                    data.discount = discountPercentage + "%"    
                                }
                                data.price = pricing.price
                                data.spl_price = pricing.specialPrice
                                
                                break;
                            }
                        }
                        reProducts.push(data)
                    }
                   
                }
                items.relatedProducts = reProducts

                for (let subItem of items.substitutions) {                    
                    let product  = await Inventory.findOne(
                        { _id: mongoose.Types.ObjectId(subItem) },
                        {
                            name: 1,                      
                            "pricing.image": 1,
                            "pricing.price": 1,
                            "pricing.specialPrice": 1,
                            "pricing.uom": 1,
                            "pricing.sku": 1,
                            "pricing.stock": 1,
                            "pricing._id": 1,                          
                        }
                    )  
                    if(product){
                        let subData = {
                            _id:product._id,
                            title : product.name,
                        } 
                   
                        for (let pricing of product.pricing) {
                            if(pricing.stock > 0) {
                                subData.image = ""
                                subData.discount = ""
                                if(pricing.image[0]){
                                    subData.image =imgPath.concat(pricing.image[0])
                                }
                                
                                let discountPercentage = ((pricing.price - pricing.specialPrice)/pricing.price)* 100
                                if(discountPercentage >0 && discountPercentage <100){
                                    subData.discount = discountPercentage + "%"    
                                }
                                subData.price = pricing.price
                                subData.spl_price = pricing.specialPrice
                                
                                break;
                            }
                        }
                        subProducts.push(subData)
                    }
                   
                }
                items.substitutions = subProducts



                for (let pricing of items.pricing){                                           
                      
                     pricingDetails = {
                        _id:pricing._id
                    }   
                   let uomTitle =""
                    let uom  = await MasterUOMValue.findOne(
                        { _id: mongoose.Types.ObjectId(pricing.sku) },
                        {
                            uomValue: 1                                
                        }
                    )                     
                    if(uom){
                        uomTitle = uom.uomValue
                    }
                    
                    // Checking varient is in favourite
                    let is_fav =0
                  
                    let favourite  = await InventoryFavourite.findOne(
                        { productUomId: mongoose.Types.ObjectId(pricing._id), userId: mongoose.Types.ObjectId(req.user._id) },
                       
                    ).countDocuments()       
                                 
                    if(favourite>0){
                        is_fav = 1
                    }
                    
                    
                    pricingDetails.image = ""
                    pricingDetails.discount = ""
                    pricingDetails.expire_on = ""
                    pricingDetails.is_fav = is_fav
                    if(pricing.image[0]){
                        pricingDetails.image =imgPath.concat(pricing.image[0])
                    }
                    if(pricing.expiryDate){
                        pricingDetails.expire_on = "will be expired on " + pricing.expiryDate
                    }
                    
                    let discountPercentage = ((pricing.price - pricing.specialPrice)/pricing.price)* 100
                    if(discountPercentage >0 && discountPercentage <100){
                        pricingDetails.discount = discountPercentage + "%"    
                    }
                    
                    pricingDetails.price = pricing.price
                    pricingDetails.spl_price = pricing.specialPrice
                    pricingDetails.uom = uomTitle

                    pricingDetails.is_cart = 0
                  
                    
                    pricings.push(pricingDetails)

                }

                items.pricing = pricings

                items.star_rating =
                [
                    {
                      "1": "20%",
                      "2": "40%",
                      "3": "50%",
                      "4": "100%",
                      "5": "50%"
                    }
                ]
          
                  
            }




            res.status(200).json({
              error: false,
              message: "Products details are",
              data: {
                products: productDetails,
              },
            });
        } catch (error) {
            next(error);
        }
    },


    
    /* check pincode availble or not
    ============================================= */
    pincodeCheck: async (req, res, next) => {
        try {
            let pincode = req.body.pincode
            let storeProductDetails =""
            let result = await Store.find(
                { 
                    isDisabled:false,
                    "serviceablePincodes": { 
                        "$elemMatch": {
                            "code": pincode,
                            "active": true,                                                     
                        }
                    }
                },
                {
                    name:1

                }              
            );            
            if (result.length) { 
                for (let store of result){
                    storeProductDetails = await StoreProduct.findOne(
                        { 
                            storeId:store._id,
                            varientId:req.body.varientId,
                            stock: { $gte: 1 }                            
                        },
                        {
                            name:1
        
                        }              
                    ); 
                    break;
                }
                if(storeProductDetails){
                    res.status(200).json({
                        error: false,
                        message: "Delivery Available",
                        data: {
                           pincode:pincode
                        },
                      });

                }else{
                    res.status(200).json({
                        error: true,
                        message: "Delivery not Available",
                        data: {
                           pincode:pincode
                        },
                      });

                }
                
            } else {
                res.status(200).json({
                    error: true,
                    message: "Delivery not Available",
                    data: {
                       pincode:pincode
                    },
                  });
            }
        } catch (error) {
            next(error);
        }
    },


   /* Update or remove products in favourite list
    ============================================= */
    updateFavorites: async (req, res, next) => {
        try {
            let data = req.body;
            let userId  = req.user._id
            let existFavourite = await InventoryFavourite.findOne({ userId: userId, productUomId:data.uom_id});
            if (!existFavourite) {      
                data.userId = userId     
                data.productUomId = data.uom_id  
                let schemaObj = new InventoryFavourite(data);
                schemaObj
                    .save()
                    .then((response) => {
                        res.status(200).json({
                            error: false,
                            message: "Favorites added successfully",
                        });
                    })
                    .catch(async (error) => {
                        res.status(200).json({
                            status: false,
                            data: error,
                        });
                    });
            } else {
                InventoryFavourite.deleteOne({ _id: mongoose.Types.ObjectId(existFavourite._id) }).then(
                    (response) => {
                        res.status(200).json({
                            error: false,
                            message: "Favourites removed successfully",
                        });
                    }
                );
               
            }
        } catch (error) {
            next(error);
        }
    },

    getFavourite: async (req, res, next) => {
        try {
            let products = []
            let category = []
            let banner =""
            let banner_redtype =""
            let banner_redid =""
            let recentview_ad =""
            let recent_redtype =""
            let recent_redid =""

            var limit = 0
            if(req.body.limit){
              limit = parseInt(req.body.limit);
            }         
          
            if (limit == 0) limit = 10;
            var skip = (parseInt(req.body.page) - 1) * parseInt(limit);


            //  Get banner image in medimall wishlist
           let bannerImage = await AdsMedimallSliderTopWishRecent.find(
              { sliderType: bannerWishlist, isDisabled: false },
              {               
                type: 1,
                typeId: 1,
                image: { $concat: [imgPath, "$image"] },
                sliderType: 1,
              }
           ).sort("-id")
            .limit(limit)
            .skip(skip)
  
           if(bannerImage.length!=0){
               banner = bannerImage[0].image
               if(bannerImage[0].type==0)  banner_redtype = "product"
               else banner_redtype = "category"              
               banner_redid =bannerImage[0].typeId
           }

            //  Get banner image in medimall recently viewed
           let bannerRecentImage = await AdsMedimallSliderTopWishRecent.find(
            { sliderType: bannerRecentlist, isDisabled: false },
            {               
              type: 1,
              typeId: 1,
              image: { $concat: [imgPath, "$image"] },
              sliderType: 1,
            }
         ).sort("-id")
          .limit(limit)
          .skip(skip)

         if(bannerRecentImage.length!=0){
            recentview_ad = bannerRecentImage[0].image
             if(bannerRecentImage[0].type==0)  recent_redtype = "product"
             else recent_redtype = "category"              
             recent_redid =bannerRecentImage[0].typeId
         }
  
        
  
           let favourites = await InventoryFavourite.find(
                { userId: req.user._id },
                {
                    productUomId: 1
                }
            ).sort("-id")
            .limit(limit)
            .skip(skip)
  
              let items =[]
              
              for (let ids of favourites) {      
              
                  let productDetails = await Inventory.find(
                    {"pricing._id":mongoose.Types.ObjectId(ids.productUomId)},
                    //  { pricing: { $elemMatch: { _id:mongoose.Types.ObjectId( ids.productUomId)} } },
                        {
                           name: 1,                      
                          "pricing.image": 1,
                          "pricing.price": 1,
                          "pricing.specialPrice": 1,
                          "pricing.uom": 1,
                          "pricing.sku": 1,
                          "pricing.stock": 1,
                          "pricing._id": 1,
                        }
                      ).sort("-id")
                      .limit(limit)
                      .skip(skip)
                    
                       
                      for (let item of productDetails) { 
                          
                          let uomTitle =""  
                         
                          var data = {
                              _id:item._id,
                              title : item.name,
                          }                     
                          for (let pricing of item.pricing){                          
                            if( pricing.id == ids.productUomId){                                
                             // if(!checkStock){
                                 // if(pricing.stock>0){  
                                                                            
                                      let uom  = await MasterUOMValue.findOne(
                                          { _id: mongoose.Types.ObjectId(pricing.sku) },
                                          {
                                              uomValue: 1                                
                                          }
                                      )                     
                                      if(uom){
                                          uomTitle = uom.uomValue
                                      }
                                      data.image = ""
                                      data.discount = ""
                                      if(pricing.image[0]){
                                          data.image =imgPath.concat(pricing.image[0])
                                      }
                                      
                                      let discountPercentage = ((pricing.price - pricing.specialPrice)/pricing.price)* 100
                                      if(discountPercentage >0 && discountPercentage <100){
                                          data.discount = discountPercentage + "%"  
                                      }
                                     
                                      data.price = pricing.price
                                      data.spl_price = pricing.specialPrice
                                      data.uom = uomTitle
                                     
                                      items.push(data)
  
                                  //}
  
                              }                             
                          }                       
  
                       
                      } 
                  }
            res.status(200).json({
              error: false,
              message: "Products are",
              data: {
                banner:banner,
                banner_redid: banner_redid,
                banner_redtype:banner_redtype,
                recentview_ad:recentview_ad,
                recent_redtype: recent_redtype,
                recent_redid:recent_redid,
                products: items,
              },
            });
           
  
  
        } catch (error) {
            next(error);
        }
    },





    suggestProduct: async (req, res, next) => {
        try {
            let data = req.body;
                 
            let result = await InventorySuggested.find({})
            if(!result)  {
                let schemaObj = new InventorySuggested(data);
                schemaObj
                    .save()
                    .then((response) => {
                        res.status(200).json({
                            error: false,
                            message: "Product requested",
                        });
                    })
                    .catch(async (error) => {
                        res.status(200).json({
                            status: false,
                            data: error,
                        });
                    });

            }else{
                res.status(200).json({
                    status: false,
                    data: "Title already exist",
                });
            }
           
            
        } catch (error) {
            next(error);
        }
    },





};
