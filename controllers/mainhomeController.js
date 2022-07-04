const mongoose = require("mongoose");
const TopCategory = require("../models/ads/home/topAd1MainAd6Ad8");
const sliders = require("../models/ads/home/slider1234ad25");
const TrendingCategory = require("../models/ads/home/trendingCategory");
const SpotLight = require("../models/ads/home/spotlight");
const PartnerPromotion = require("../models/ads/cart/partnerPromotion");
const EditorsChoice = require("../models/ads/seasonal-offers/editorsChoiceVocalLocalEnergizeYourWorkout");
const Article = require("../models/article");
const mainHome = require("../models/ads/home/yogaFitnessExpert");
const FoliofitYoga =require("../models/foliofit/foliofitYoga");
const FolifitFitnessClub = require("../models/foliofit/foliofitFitnessClub");
const nutrichartVitamin = require("../models/foliofit/nutrichartVitamin");
const Brand = require("../models/mastersettings/brand");
const Promotion = require("../models/ads/cart/promotion");
const ad3 = require("../models/ads/home/ad3");
const HealthCareVideo = require("../models/healthCareVideo");
const HealthExpertAdvice = require("../models/healthExpertAdvice");
const healthExpertQnReplay = require("../models/healthExpertQnReplay");
const Like = require("../models/like");
const User = require("../models/userModel");
const ad4 = require("../models/ads/home/ad4");
const PlanYourDiets = require("../models/ads/home/planYourDiet");
const ad7 = require("../models/ads/home/ad7");
const nutrichartFood = require("../models/nutrichartFood");
const slider5 = require("../models/ads/home/slider5");
const medicineCategory = require("../models/mastersettings/category");


const imgPath = process.env.BASE_URL;
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

module.exports = {
  GetMainHome: async (req, res, next) => {
    try {
      let TopCategories = await TopCategory.aggregate([
        {
          $match: {
            sliderType: "topcategories",
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] } } },
      ]);
      let Slider1 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider1",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            redirect_type: 1,
            type: 1,
            redirect_id: "$typeId",
          },
        },
      ]);

      let MainCategories = await TopCategory.aggregate([
        {
          $match: {
            sliderType: "maincategory",
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] } } },
      ]);
      
     let MedicineCategory = await medicineCategory.aggregate([
      {
        $match: {
          categoryType: "medicine",
        },
      },
      { $project: { image: { $concat: [imgPath, "$image"] },title:1 } },
    ]);
      let TrendingCategories = await TrendingCategory.aggregate([
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            cat_id: "$categoryId",
            text: "$offerBoxText",
            color: "$offerBoxColor",
          },
        },
      ]);
      //my orders
      let MyOrders=[
        {
          "id": "1",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
          "delivery": "Delivery expected by 28 dec",
          "product": "Himalaya men face wash"
        },
        {
          "id": "2",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
          "delivery": "Delivery expected by 29 dec",
          "product": "Nivea men face wash"
        },
        {
          "id": "2",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
          "delivery": "Delivery expected by 30 dec",
          "product": "Nivea Women face wash"
        }
  
      ];
      let Ad1 = await TopCategory.aggregate([
        {
          $match: {
            sliderType: "ad1",
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] } } },
      ]);
      let SpotLights = await SpotLight.aggregate([
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            thumb_image: { $concat: [imgPath, "$thumbnail"] },
            redirect_type: "$type",
            redirect_id: "$typeId",
            isMedimall: 1,
            text: "$offerBoxText",
            color: "$offerBoxColor",
          },
        },
      ]);
      //hot deals for you
      let ExcitingOffers={
        "details": [
          {
            "id": "21",
            "deal_name": "Hot deals for you",
            "date_time": "13-10-2021 11.30 min"
          },
          {
            "id": "22",
            "deal_name": "Hot deals for you",
            "date_time": "14-10-2021 12.30 min"
          },
          {
            "id": "23",
            "deal_name": "Hot deals for you",
            "date_time": "15-10-2021 9.30 min"
          }
        ],
        "products": [
          {
            "id": "33",
            "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
            "product": "Himalaya men face wash",
            "price": "100",
            "spl_price": "80",
            "discount": "50%"
          },
          {
            "id": "34",
            "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
            "product": "Himalaya women face wash",
            "price": "98",
            "spl_price": "60",
            "discount": "40%"
          },
          {
            "id": "35",
            "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
            "product": "nivea men face wash",
            "price": "99",
            "spl_price": "70",
            "discount": "30%"
          }
        ]
  
  
      }
      // top recommendations
      let TopRecommended=[{
        "id": "5",
        "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
        "product": "Himalaya men face wash",
        "category": "face wash",
        "price": "100",
        "spl_price": "50",
        "discount": "50%"
      },
      {
        "id": "6",
        "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
        "product": "nivea men face wash",
        "category": "face wash",
        "price": "101",
        "spl_price": "60",
        "discount": "40%"
      }
];
      
      let Slider2 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider2",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            redirect_type: 1,
            type: 1,
            redirect_id: "$typeId",
          },
        },
      ]);
      //Recently viewed
      let RecentlyViewed=[
        {
        "id": "2",
        "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
        "product": "Himalaya men face wash"
      },
      {
        "id": "2",
        "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
        "product": "Himalaya men face wash",
        "price": "100",
        "spl_price": "50"
      },
      {
        "id": "2",
        "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
        "product": "Himalaya men face wash",
        "price": "100",
        "spl_price": "50"
      }
];
      let PartnerPromotions = await PartnerPromotion.aggregate([
        { $match: { isDisabled: false } },

        {
          $project: {image:{ $concat: [ imgPath,"$image" ] },
          ExternalLink: 1,}
        },
      ]);
      let EditorsChoices = await EditorsChoice.aggregate([
        {
          $match: {
            sliderType: "editors_choice",
          },
        },
        {
          $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product",
          },
      },
      {
          $unwind: {
              path: "$product",
              preserveNullAndEmptyArrays: true,
          },
      },              
      {
          $project: {
              productName: "$product.title",
              image: { $concat: [imgPath, "$product.image"] },
              price: "$product.price",
              spl_price: "$product.spl_price",
          },
      },
      ]);
      let MainArticles = await Article.aggregate([
        {
          $match: {
            $or:[{homepageMain: true}]
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            heading: 1,
            description: 1
          },
        },
      ]);
      let SubArticles = await Article.aggregate([
        {
          $match: {
            $or:[{homepageSub: true}]
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            heading: 1,
            description: 1
          },
        },
      ]);
      
     
      let mainYoga = await mainHome.aggregate([
        {
          $match: {
            adsType: "mainyoga",
          },
        },
        {
          $project: {
            categoryId: 1,
            subCategoryId: 1,
            adsType: 1,
          },
        },
      ]);
      if (mainYoga.length) {
        var videoDetails;
        if (mainYoga[0].adsType == "mainyoga") {
          videoDetails = await FoliofitYoga.findOne(
            { _id: mainYoga[0].subCategoryId },
            {
              video: 1,
              thumbnail: { $concat: [imgPath, "$thumbnail"] },
            }
          );
        }
        if (videoDetails) {
          mainYoga[0].video = videoDetails.video;
          mainYoga[0].thumbnail = videoDetails.thumbnail;
          delete mainYoga[0].categoryId,
          delete mainYoga[0].subCategoryId,
          delete mainYoga[0].adsType
        }
      }
      let subYoga = await mainHome.aggregate([
        {
          $match: {
            adsType: "subyoga",
          },
        },
        {
          $project: {
            categoryId: 1,
            subCategoryId: 1,
            adsType: 1,
          },
        },
      ]);
      if (subYoga.length) {
        var videoDetails;
        for (i = 0; i < subYoga.length; i++) {
          if (subYoga[i].adsType == "subyoga") {
            videoDetails = await FoliofitYoga.findOne(
              { _id: subYoga[i].subCategoryId },
              {
                video: 1,
                thumbnail: { $concat: [imgPath, "$thumbnail"] },
              }
            );
          }
          if (videoDetails) {
            subYoga[i].video = videoDetails.video;
            subYoga[i].thumbnail = videoDetails.thumbnail;
            delete subYoga[i].categoryId,
            delete subYoga[i].subCategoryId,
            delete subYoga[i].adsType
          }
        }
      }
      let mainFitness = await mainHome.aggregate([
        {
          $match: {
            adsType: "mainfitness",
          },
        },
        {
          $project: {
            categoryId: 1,
            subCategoryId: 1,
            adsType: 1,
          },
        },
      ]);
      if (mainFitness.length) {
        var videoDetails;
        if (mainFitness[0].adsType == "mainfitness") {
          videoDetails = await FolifitFitnessClub.findOne(
            { _id: mainFitness[0].subCategoryId },
            {
              video: 1,
              thumbnail: { $concat: [imgPath, "$thumbnail"] },
            }
          );
        }
        if (videoDetails) {
          mainFitness[0].video = videoDetails.video;
          mainFitness[0].thumbnail = videoDetails.thumbnail;
          delete mainFitness[0].categoryId,
          delete mainFitness[0].subCategoryId,
          delete mainFitness[0].adsType
        }
      }
      let subFitness = await mainHome.aggregate([
        {
          $match: {
            adsType: "subfitness",
          },
        },
        {
          $project: {
            categoryId: 1,
            subCategoryId: 1,
            adsType: 1,
          },
        },
      ]);
      if (subFitness.length) {
        var videoDetails;
        for (i = 0; i < subFitness.length; i++) {
          if (subFitness[i].adsType == "subfitness") {
            videoDetails = await FolifitFitnessClub.findOne(
              { _id: subFitness[i].subCategoryId },
              {
                video: 1,
                thumbnail: { $concat: [imgPath, "$thumbnail"] },
              }
            );
          }
          if (videoDetails) {
            subFitness[i].video = videoDetails.video;
            subFitness[i].thumbnail = videoDetails.thumbnail;
            delete subFitness[i].categoryId,
            delete subFitness[i].subCategoryId,
            delete subFitness[i].adsType
          }
        }
      }
      let nutrichartVitamins = await nutrichartVitamin.aggregate([
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            title: 1,
          },
        },
      ]);
      let Ad2 = await sliders.aggregate([
        {
          $match: {
            sliderType: "ad2",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            redirect_type: 1,
            type: 1,
            redirect_id: "$typeId",
          },
        },
      ]);
      // let Brands = await Brand.aggregate([
        
      //   { $project: { image: { $concat: [imgPath, "$image"] } } },
      // ]);
      
    let Brands =[  {
        "id": "77",
        "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
        "products": [
          {
            "product": "Coconut oil",
            "id": "76",
            "image_url": "http://143.110.240.107:8000/ads/image_1632126237565.png"
          },
          {
            "product": "Coconut oil",
            "id": "75",
            "image_url": "http://143.110.240.107:8000/ads/image_1632126237565.png"
          }
        ]
      },
      {
        "id": "74",
        "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
        "products": [
          {
            "title": "Coconut oil",
            "id": "73",
            "image_url": "http://143.110.240.107:8000/ads/image_1632126237565.png"
          },
          {
            "title": "Coconut oil",
            "id": "72",
            "image_url": "http://143.110.240.107:8000/ads/image_1632126237565.png"
          }
        ]
      }
    ]

      
      let Promotions = await Promotion.aggregate([
        { $match: { isDisabled: false } },

        {
          $project: {image:{ $concat: [ imgPath,"$image" ] }
        }
        },
      ]);
      let Ad3 = await ad3.aggregate([
        {
          $match: {
            isDisabled: false,
          },
        },
        { 
          $project: 
            { image: { $concat: [imgPath, "$image"] },redirect_type:1 }
          
        }
      ]);
      let HealthCareMain = await HealthCareVideo.aggregate([
        {
          $match: {
            homepageMain: true,
          },
        },
        { $project: {
          name:1,
          video: 1,
          thumbnail: { $concat: [imgPath, "$thumbnail"] },
        } },
      ]);
      let HealthCareSub = await HealthCareVideo.aggregate([
        {
          $match: {
            homepageSub: true,
          },
        },
        { $project: {
          name:1,
          video: 1,
          thumbnail: { $concat: [imgPath, "$thumbnail"] },
        } },
      ]);
      let user = req.user._id;
      let health_advice = await HealthExpertAdvice.aggregate([
        {
          $project: {
            id: "$_id",
            question: 1,
            posted_on: "$createdAt",
            posted_by:"$userName",
            userImage:1
          },
        },
      ]).limit(5)
      for (j = 0; j < health_advice.length; j++) {
        health_advice[j].userImage = process.env.BASE_URL.concat(
          health_advice[j].userImage)
        delete health_advice[j]._id;
        health_advice[j].like_count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(health_advice[j].id),
        });
        let isLiked = await Like.findOne({
          type: "advice",
          contentId: mongoose.Types.ObjectId(health_advice[j].id),
          userId: req.user._id,
        });
        if (isLiked) {
          health_advice[j].is_liked = 1;
        } else {
          health_advice[j].is_liked = 0;
        }
        let time = timeSince(health_advice[j].posted_on)
            health_advice[j].posted_on = time;
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
              // image:1
            },
          },
        ]);
          if (objdata.length) {
            delete objdata[0]._id;
          objdata[0].reply_like_count = await Like.countDocuments({
              contentId: mongoose.Types.ObjectId(objdata[0].reply_id),
            });
            // var reply_isLiked = await Like.findOne({
            //   type: "adviceReply",
            //   contentId: mongoose.Types.ObjectId(objdata[0].reply_id),
            //   userId:req.user._id,
            // });
            // if (reply_isLiked) {
            //   objdata[0].reply_isLiked = 1;
            // } else {
            //   objdata[0].reply_isLiked = 0;
            // }
            let sin = timeSince(objdata[0].replay_posted_on)
            // if (objdata[0].image) {
            //   health_advice[j].admin_image = process.env.BASE_URL.concat(
            //     objdata[0].image
            //   );
            // } else {
            //   health_advice[j].admin_image = process.env.BASE_URL.concat(
            //     "medfeed/head.jpeg"
            //   ); 
            // }
            health_advice[j].replay_posted_on = sin;
            health_advice[j].answer  = objdata[0].answer;
            health_advice[j].replied_by = objdata[0].replied_by
            health_advice[j].reply_like_count = objdata[0].reply_like_count
            health_advice[j].reply_isLiked = objdata[0].reply_isLiked
            health_advice[j].reply_id  = objdata[0].reply_id;
        }
        
      }
      let Ad4 = await ad4.aggregate([
        {
          $match: {
            isDisabled: false,
          },
        },
        { 
          $project: 
            { image: { $concat: [imgPath, "$image"] },link:1 }
          
        }
      ]);
      //plan your diet
      let DietPlan= [
        {
          "title": "GM Diet",
          "id": "101",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png"
        },
        {
          "title": "GM Diet",
          "id": "102",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png"
        },
        {
          "title": "GM Diet",
          "id": "103",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png"
        }
      ]
  
      let Slider3 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider3",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            redirect_type: 1,
            type: 1,
            redirect_id: "$typeId",
          },
        },
      ]);
      //combo offer
      let ComboOffers = [
        {
          "id": "201",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
          "product": "Himalaya men face wash",
          "price": "100",
          "spl_price": "40",
          "discount": "40%",
          "is_fav": "1"
        },
        {
          "id": "202",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
          "product": "Himalaya men face wash",
          "category": "face wash",
          "price": "200",
          "spl_price": "70",
          "discount": "30%",
          "is_fav": "1"
        }
      ]
  
      //seasonal offers set new offer
      let NewOffers= [
        {
          "title": "Mega offers",
          "products": [
            {
              "id": "301",
              "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
              "product_id": "26"
            },
            {
              "id": "302",
              "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
              "product_id": "25"
            }
          ]
        }
      ]
  
      //vocal local
      let VocalLocal = [
        {
          "id": "401",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
          "product_id": "26"
        },
        {
          "id": "402",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
          "product_id": "25"
        }
      ]
  
      //immunity booster
      let ImmunnityBooster=[
        {
          "id": "501",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
          "product_id": "26",
          "product": "Himalaya men face wash",
          "discount": "50%"
        },
        {
          "id": "502",
          "image": "http://143.110.240.107:8000/ads/image_1632126237565.png",
          "product_id": "25",
          "product": "Himalaya men face wash",
          "discount": "50%"
        }
      ]
  
      let Ad5= await sliders.aggregate([
        {
          $match: {
            sliderType: "ad5",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            redirect_type: 1,
            type: 1,
            redirect_id: "$typeId",
          },
        },
      ]);
      let Slider4 = await sliders.aggregate([
        {
          $match: {
            sliderType: "slider4",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            redirect_type: 1,
            type: 1,
            redirect_id: "$typeId",
          },
        },
      ]);
      let Ad6 = await TopCategory.aggregate([
        {
          $match: {
            sliderType: "ad6",
          },
        },
        { $project: { image: { $concat: [imgPath, "$image"] } } },
      ]);
      let EnergizeYourWorkout = await EditorsChoice.aggregate([
        {
          $match: {
            sliderType: "energize_workout",
          },
        },
        {
          $project: {
            image: { $concat: [imgPath, "$image"] },
            categoryId: 1,
            ProductId: 1,
          },
        },
      ]);
      let Ad7 = await ad7.aggregate([
        {
          $match: {
            isDisabled: false,
          },
        },
        { 
          $project: 
            { image: { $concat: [imgPath, "$image"] },couponCode:1 }
          
        }
      ]);
      let NutriChart = await nutrichartFood.aggregate([
        {
          $match: {
            recommended: true,recommended_isDeleted:false
          },
        },
        { 
          $project: 
            { image: { $concat: [imgPath, "$image"] },title:1 ,category:1}
          
        }
      ]);
     //cart your med essentials
     let med_essential =[
      {
        "category": "Skin care",
        "id": "25",
        "image": "http://143.110.240.107:8000/ads/image_1632126237565.png"
      },
      {
        "category": "Body care",
        "id": "25",
        "image": "http://143.110.240.107:8000/ads/image_1632126237565.png"
      }
    ]

     let Slier5= await slider5.aggregate([
      {
        $match: {
          isDisabled: false,
        },
      },
      { 
        $project: 
          { image: { $concat: [imgPath, "$image"] },type:1,typeId:1}
        
      }
    ]);
    let TrendingBrands = await Brand.aggregate([
      {
        $match: {
          isTrending: true
        },
      },
      { $project: { image: { $concat: [imgPath, "$image"] } } },
    ]);
    let Ad8 = await TopCategory.aggregate([
      {
        $match: {
          sliderType: "ad8",
        },
      },
      { $project: { image: { $concat: [imgPath, "$image"] } } },
    ]);
      res.status(200).json({
        message: "success",
        error: false,
        data: {
          TopCategories: TopCategories,
          Slider1: Slider1,
          MainCategories: MainCategories,
          MedicineCategory:MedicineCategory,
          TrendingCategories: TrendingCategories,
          MyOrders:MyOrders,
          Ad1: Ad1,
          SpotLights: SpotLights,
          ExcitingOffers:ExcitingOffers,
          TopRecommended:TopRecommended,
          Slider2:Slider2,
          RecentlyViewed:RecentlyViewed,
          PartnerPromotions: PartnerPromotions,
          EditorsChoices: EditorsChoices,
          Articles: {MainArticles:MainArticles},SubArticles,
          yogaVideos: {mainYoga:mainYoga},
          subYoga,
          fitnessVideos: {mainFitness:mainFitness},
          subFitness,
          nutrichartVitamins:nutrichartVitamins,
          Ad2:Ad2,
          Brands:Brands,
          Promotions:Promotions,
          Ad3:Ad3,
          HealthCareVideos: {HealthCareMain:HealthCareMain},
          HealthCareSub,
          health_advice:health_advice,
          Ad4:Ad4,
          DietPlan:DietPlan,
          Slider3:Slider3,
          ComboOffers:ComboOffers,
          NewOffers:NewOffers,
          VocalLocal:VocalLocal,
          ImmunnityBooster:ImmunnityBooster,
          Ad5:Ad5,
          Slider4:Slider4,
          Ad6:Ad6,
          EnergizeYourWorkout:EnergizeYourWorkout,
          Ad7:Ad7,
          NutriChart:NutriChart,
          med_essential:med_essential,
          Slier5:Slier5,
          TrendingBrands:TrendingBrands,
          Ad8:Ad8
         
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
