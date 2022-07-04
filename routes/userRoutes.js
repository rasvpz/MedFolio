const express = require('express');
const router = express.Router();
const multer = require('multer')

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images');
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}.jpg`);
    }
});

let upload = multer({ storage: storage })

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController')
const articleController = require('../controllers/articleController')
const likeSaveController = require('../controllers/likeSaveController')
const quizController = require('../controllers/quizController')
const shareSaveController = require('../controllers/shareController')
const healthExpertController = require('../controllers/healthExpertController')
const healthcareController = require("../controllers/healthCareController");
const healthTipsController = require('../controllers/healthTipController');
const healthCareController = require('../controllers/healthCareController');

const dietController = require('../controllers/dietController')
const ratingController = require('../controllers/ratingController')
const mainHomeController= require('../controllers/mainhomeController')
const CartController= require('../controllers/cartController')

router.post('/verify_number', userController.phoneVerification)
router.post('/verify_OTP', userController.verifyOTP)
router.post('/signin', userController.signin)
router.post('/signin_otp', userController.signinWithOtp)
router.post('/forgot_password_otp', userController.forgotSendOtp)
router.post('/reset_password', userController.resetPassword)
router.use("/medfeed", express.static("public/images"));

// Protect all routes after this middleware
router.use(authController.userProtect);

router.post('/update_profile', userController.update_profile)

//medfeed
router.get('/get_medfeed_home', userController.medfeedHome)
router.get('/get_article_categories', adminController.viewMainArticleCategoriesAndArticles)
router.post('/get_article_listing', articleController.viewSubCategoriesWithArticles)
    // router.get('/get_article_listing/:id', articleController.viewArticleSubCategories)
router.post('/viewArticlesBySubCategory', articleController.viewArticlesBySubcategory)
router.post('/get_article_detail', articleController.viewArticle)
router.post('/like_unlike', likeSaveController.changeLike)
router.post('/save_remove', likeSaveController.changeSave)  
router.post('/searchArticle', articleController.searchArticle)
router.get('/get_medfeed_bookmark', likeSaveController.getMedfeedSavedList)
router.get('/get_medfeed_saved', likeSaveController.getMedfeedSavedList)
router.get('/get_healthTip_categories', adminController.getAllHealthTipCategories)
router.post('/read', likeSaveController.read)


// Healthcare videos
router.get('/get_healthvideo_categories', userController.getHealthCareVideoCategories)
router.post('/get_healthcare_videos', healthcareController.get_healthcare_videos)
router.get('/viewHealthcareMainCategories', adminController.viewHealthCareVideoMainCategories)
router.get('/viewHealthCareVideoSubCategories', adminController.viewHealthCareVideoSubCategories)
router.post('/searchHealthCareVideo', healthCareController.userSearchHealthcareVideo)

//Quiz APIs
router.get('/getMedcoinCount', userController.getMedcoinCount)
router.post('/get_quiz_detail', quizController.getQuizDetail)
router.post('/submit_quiz', quizController.submitQuiz)
router.get('/get_quiz_winners', quizController.getQuizWinnerBanners)
// router.post('/viewQuiz', quizController.findQuiz)

//HEALTH TIPS
router.post('/get_health_tips', healthTipsController.get_health_tips)
router.post('/search_health_tips', healthTipsController.searchHealthTips)

//DietRegime APIs
router.get('/diet_listing')
router.get('/diet_days_listing')
router.get('/day_detail')
    //share
router.post('/share', shareSaveController.changeShare)
router.get('/get_share_count/:id', shareSaveController.getShareCount)
    /*=================================================================================
 HEALTH EXPERT ADVICE
=====================================================================================*/
router.get('/get_expert_advice', userController.getExpertAdviceWithBanner)
router.get('/get_expert_category', adminController.getAllHealthExpertCategories)
router.get('/get_my_questions', healthExpertController.getMyHealthExpertQuestions)
// router.post('/healthexpertcategory', healthExpertController.addHealthExpertCategory)
router.post('/add_expert_question', healthExpertController.sendQuestion)

// MedFeed Search
router.post('/search_medfeed',userController.searchMedfeed )

//************************** FOLIOFIT **************************\\
router.get('/get_foliofit_home', userController.getFoliofitHome)
router.get('/fitness_club')
router.get('/yoga')
router.get('/get_dietregime_category', userController.getDietRegimeCat)
router.post('/get_diet_days', userController.getDietDays)
router.get('/get_diet_days_details/:id', userController.getDietDaysDetails)
router.get('/get_nutrichart', userController.getNutriChart)
router.post('/add_health_reminder',userController.addHealthReminder)
router.post('/get_health_reminder',userController.getHealthReminder)
router.post('/add_bmi', userController.addHealthCalculator)
router.get('/get_bmi_details',userController.getBmiDetails)

//FITNESS CLUB
router.get('/get_fitness_club', userController.getFitnessClub)
router.post('/get_fitnessClub_details',userController.getFitnessClubSession)
router.post('/get_fitnessClub_details_byId',userController.getFitnessClubSessionById)
router.post('/get_fitnessClub_session_details',userController.getFitnessClubSessionDetails)
router.get('/get_foliofit_bookmark', userController.getFitnessClubBookmark)
router.post('/get_foliofit_bookmark_byType', userController.getFoliofitClubBookmarkByType)
router.post('/get_vimeo_gif',userController.getVimeoGif)




// router.get('/get_nutrichart_category', userController.getNutrichartCategory)
router.post('/viewAllNutrichartFoods', userController.viewAllNutrichartFoods)
router.post('/viewAllNutrichartFoodsByCalorie', userController.viewAllNutrichartFoodsByCalorie)
router.post('/get_nutrichart_details', userController.getNutrichartDetails)


router.get('/get_yoga_home', userController.getYogaHome)
router.post('/get_yoga_sessions',userController.getYogaSessions)
router.post('/get_yoga_details_byId',userController.getYogaSessionById)

// Diet Regime
// router.get('/get_diet_plans', dietController.getDietPlansUser)
router.post('/get_diet_day', dietController.getDietDays)
router.post('/get_diet_day_detail', dietController.getDietDayDetail)


// ____ foliofit rating _____ \\
router.post('/add_rating', ratingController.addRating)
router.post('/get_rating', ratingController.getRating) 
//main home
router.get('/get_med_mainhome',mainHomeController.GetMainHome)


//************************** Medimall -master settings **************************\\

router.post('/get_categories', userController.getCategories) 

router.post('/get_subcategories', userController.getSubCategories) 

router.post('/get_products', userController.getProducts) 
router.post('/get_product_details', userController.getProductDetails) 

// cart 
router.post('/add_prod_cart', CartController.AddProductToCart)
router.get('/pincode_check/:pincode', userController.pincodeCheck) 
router.post('/pincode_check', userController.pincodeCheck) 
router.post('/update_favorites', userController.updateFavorites) 
router.post('/get_favourite', userController.getFavourite) 
router.post('/suggest_product', userController.suggestProduct) 

module.exports = router;