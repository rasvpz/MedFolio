const express = require('express');
const router = express.Router();
const multer = require('multer')

const path = require('path'); // for getting file extension

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}.jpg`);
    }
});

let upload = multer({ storage: storage })


let inventory_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/inventory');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}.jpg`);
    }
});

let inventory_upload = multer({ storage: inventory_storage })


// Customer Relation image upload starts here
let customerRelation_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './customerRelationImage/images/customerRelation');
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        console.log('extension:', ext)
        cb(null, `${file.fieldname}_${Date.now()}${ext}`);
    }
});
let customerRelation_upload = multer({ storage: customerRelation_storage })
// Customer relation image upload ends here





//*********** Employee storage *********** */
let employeeStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/employees');
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        console.log('extension:', ext)
        cb(null, `${file.fieldname}_${Date.now()}${ext}`);
    }
});

let employeeUpload = multer({
    storage: employeeStorage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only .png, .jpg and .jpeg format allowed!"));

    }
}


/* Master Settings Brand  Multer Storage
============================================================================ */

let storageMaster = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, "./public/images/master");

    },
    filename: function (req, file, cb) {
        //   cb(null, `${file.fieldname}_${Date.now()}.jpg`);
        cb(null, `${file.fieldname}_${Date.now()}` + path.extname(file.originalname))
    },
});
let uploadMultipleMaster = multer({
    storage: storageMaster,
    // fileFilter: function (req, file, cb) {
    //     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
    //         cb(null, true);
    //     } else {
    //         cb(null, false);
    //         return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    //     }
    // },
});


// Inventory Storage
let inventoryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/inventory');
    },
    filename: function (req, file, cb) {
        let name = file.originalname.split('.')
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, `${name[0]}_${Date.now()}.${extension}`);
    }
});

let inventoryUpload = multer({
    storage: inventoryStorage,
    // fileFilter: function(req, file, cb) {
    //     checkFileType(file, cb);
    // }
})

function checkImageAndVideoType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only .png, .jpg and .jpeg format allowed!"));

    }
}

const userControllerOld = require('../controllers/userControllerOld');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController')

const masterController = require("../controllers/mastersettings/masterSettingsController");
const healthExpertController = require('../controllers/healthExpertController');
const quizController = require('../controllers/quizController');
const storeController = require('../controllers/storeControllers');
const inventoryController = require('../controllers/inventoryController');
const healthCareController = require('../controllers/healthCareController');
const articleController = require('../controllers/articleController');

const termsAndConditionController = require('../controllers/usermanagement/termsAndConditionController')
const premiumController = require('../controllers/premium/premiumController')
const specialPremiumController = require('../controllers/premium/specialPricePremiumController')
const customerRelationController = require('../controllers/customerRelation/customerRelationController')

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.use("/medfeed", express.static("public/images"));


// Protect all routes after this middleware
router.use(authController.protect);

router.delete('/deleteMe', userControllerOld.deleteMe);

// Only admin have permission to access for the below APIs 
router.use(authController.restrictTo('admin')); 

router
    .route('/')
    .get(userControllerOld.getAllUsers);

router.post('/seed_privilege_group', adminController.addPrivilegeGroup)
router.post('/add-subPrivilege', adminController.addSubPrivilege)
router.get('/view_privilege_groups', adminController.viewPrivilegeGroups)
router.post('/add_department', adminController.addDepartment)
router.get('/view_all_departments', adminController.viewDepartments)
router.get('/view_department/:id', adminController.viewDepartment)
router.put('/edit_department/:id', adminController.editDepartment)
router.delete('/delete_department/:id', adminController.deleteDepartment)
router.post('/add_employeeType', adminController.seedEmployeeTypesForEachPrivilege)
router.get('/view_employee_types', adminController.viewEmployeeTypes)
router.delete('/delete_employee_type/:id', adminController.deleteEmployeeType)
router.get('/view-employee-permissions/:departmentId', adminController.viewEmployeePermissions)
router.post('/add-employee', employeeUpload.fields([{
    name: "photo",
    maxCount: 1,
},
{
    name: "signature",
    maxCount: 1
},
{
    name: "aadhar",
    maxCount: 1,
},
{
    name: "employeeIdCard",
    maxCount: 1,
},
{
    name: "offerLetter",
    maxCount: 1,
},
{
    name: "panCard",
    maxCount: 1,
},
{
    name: "passbook",
    maxCount: 1,
},
{
    name: "others",
    maxCount: 1
}
]), adminController.addEmployee)
router.get('/view-all-employees', adminController.viewAllEmployees)
router.get('/viewEmployeesInDepartment/:id', adminController.viewEmployeesInDepartment)
router.get('/view-employee-details/:id', adminController.viewEmployeeDetails)
router.put('/edit_employ/:id', employeeUpload.fields([{
    name: "photo",
    maxCount: 1,
},
{
    name: "signature",
    maxCount: 1,
},
{
    name: "aadhar",
    maxCount: 1,
},
{
    name: "employeeIdCard",
    maxCount: 1,
},
{
    name: "offerLetter",
    maxCount: 1,
},
{
    name: "panCard",
    maxCount: 1,
},
{
    name: "passbook",
    maxCount: 1,
},
{
    name: "others",
    maxCount: 1,
},
]), adminController.editEmployDetails)
router.get('/employee_permissions', adminController.employeePermissions)
router.post('/permission_checking', adminController.permissionChecking)
router.post('/employee_search', adminController.employeeSearch)
router.delete("/delete_employee_by_id/:id", adminController.deleteEmployById);

// Create guest user
router.post('/create_guest_user', adminController.createGuestUser)

// Article categories
router.post('/addArticleCategory', upload.single('image'), adminController.addArticleCategory)
router.get('/get_article_categories', adminController.getAllArticleCategories)
router.get('/get_main_article_categories', adminController.viewMainArticleCategories)
router.get('/get_all_sub_article_categories', articleController.listAllSubCategories)
router.get('/get_sub_article_categories/:id', articleController.listSubCategories);
router.get('/getHomePageArticleCategories', adminController.getHomePageArticleCategories)
router.get('/viewArticleCategory/:id', adminController.viewArticleCategory)
router.put('/editArticleCategory', upload.single('image'), adminController.editArticleCategory)
router.delete('/deleteArticleCategory/:id', adminController.deleteArticleCategory)
router.post('/addLiveUpdate', upload.single('image'), adminController.addLiveUpdate)

router.get('/getLiveUpdate', adminController.getLiveUpdate)

// Health Care Video master
router.post('/add_healthcareVideo_category', upload.single('image'), adminController.addHealthcareVideoCategory)
router.get('/get_healthcareVideo_categories', adminController.getAllHealthcareVideoCategories)
router.get('/get_healthcareVideo_main_categories', adminController.viewHealthCareVideoMainCategories)
router.get('/get_healthcareVideo_sub_categories/:id', adminController.viewHealthCareVideoSubCategories)
router.get('/get_healthcareVideo_sub_categories', adminController.viewHealthcareVideoSubCategory)
router.get('/get_healthCareVideos_by_id/:id', healthCareController.get_healthcare_videos_by_id)
router.get('/get_all_healthCareVideo', healthCareController.getHealthCareVideo)
router.post("/searchHealthcareVideo", healthCareController.searchHealthcareVideo);
router.get('/get_homepageHealthCareVideo_categories', adminController.getHomepageHealthCareVideoCategories)
router.get('/view_healthcareVideo_category/:id', adminController.viewHealthcareVideoCategory)
router.put('/edit_healthcareVideo_category', upload.single('image'), adminController.editHealthcareVideoCategory)
router.delete('/delete_healthcareVideo_category/:id', adminController.deleteHealthcareVideoCategory)
router.get('/get_healthCareVideos_by_mainCat/:id', adminController.getVideoByMainCat)


// Health tip category
router.post('/add_healthTip_category', adminController.addHealthTipCategory)
router.get('/get_healthTip_categories', adminController.getAllHealthTipCategories)
router.get('/view_healthTip_category/:id', adminController.viewHealthTipCategory)
router.put('/edit_healthTip_category', adminController.editHealthTipCategory)
router.delete('/deleteHealthTipsCategory/:id', adminController.deleteHealthTipsCategory)


// Health expert category
router.post('/addHealthExpertCategory', adminController.addHealthExpertCategory)
router.get('/getAllHealthExpertCategories', adminController.getAllHealthExpertCategories)
router.get('/viewHealthExpertCategory/:id', adminController.viewHealthExpertCategory)
router.put('/editHealthExpertCategory', adminController.editHealthExpertCategory)
router.delete('/deleteHealthExpertCategory/:id', adminController.deleteHealthExpertCategory)
router.get('/listquestions/:Type', healthExpertController.listAllHealthExpertAdvice)
router.get('/getquestions/:id', healthExpertController.getHealthExpertAdviceQuestions)

router.get('/listCategoryQuestions/:id', healthExpertController.listCategoryHealthExpertAdvice)
router.delete('/deletequestion/:id', healthExpertController.deleteExpertQuestion)
// router.delete('/deletealladvice',healthExpertController.deleteAllHealthExpertAdvice)
//expert advice post replay 
router.post('/postreply/:id', upload.single('image'), healthExpertController.postReply)
router.put('/updatepostreply/:id', upload.single('image'), healthExpertController.updatepostReply)


// Quiz APIs
router.get('/get_live_quiz', quizController.getLiveQuiz)



// router.get('/view_privileges_of_employee/:employeeId', adminController.viewPrivilegesOfEmployee)

// router
//     .route('/:id')
//     .get(userControllerOld.getUser)
//     .patch(userControllerOld.updateUser)
//     .delete(userControllerOld.deleteUser);


/*  ==================         Home Settings Management                 ============================= */

/* Master Settings Brand  APIs
============================================================================ */

router.post(
    "/add_Master_Brand",
    uploadMultipleMaster.fields([{
        name: "image",
        maxCount: 1,
    },
    {
        name: "banner",
        maxCount: 1,
    },
    ]),
    masterController.addMasterBrand
);
router.get("/get_Master_Brand", masterController.getMasterBrand);
router.put(
    "/editMasterBrand",
    uploadMultipleMaster.fields([{
        name: "image",
        maxCount: 1,
    },
    {
        name: "banner",
        maxCount: 1,
    },
    ]),
    masterController.editMasterBrand
);
router.delete("/delete_Master_Brand/:id", masterController.deleteMasterBrand);
router.get("/getMasterBrandByType/:brandType", masterController.getMasterBrandByType);



// /*Master Settings UOM APIs
// ============================================================================ */
router.post("/add_master_uom", upload.single("image"), masterController.addMasterUom);
router.get("/get_master_uom", masterController.getMasterUom);
router.get("/get_active_master_uom", masterController.getActiveMasterUom);
router.get("/get_master_uom_by_id/:id", masterController.getMasterUomById);
router.put("/edit_master_uom", upload.single("image"), masterController.editMasterUom);
router.delete("/delete_master_uom/:id", masterController.deleteMasterUom);
router.put("/change_status_master_uom/:id", upload.single("image"), masterController.changeStatusMasterUom);

/*Master Settings UOM Value APIs
============================================================================ */
router.post("/add_master_uom_value", upload.single("image"), masterController.addMasterUomValue);
router.get("/get_master_uom_value", masterController.getMasterUomValue);
router.get("/get_active_master_uom_value", masterController.getActiveMasterUomValue);
router.get("/get_active_master_uom_value_by_uom_id/:uomId", masterController.getActiveMasterUomValueByUomId);
router.get("/get_master_uom_value_by_id/:id", masterController.getMasterUomValueById);
router.put("/edit_master_uom_value", upload.single("image"), masterController.editMasterUomValue);
router.delete("/delete_master_uom_value/:id", masterController.deleteMasterUomValue);
router.put("/change_status_master_uom_value/:id", upload.single("image"), masterController.changeStatusMasterUomValue);


/* Master Settings Brand  APIs
============================================================================ */

router.post(
    "/add_master_brand",
    uploadMultipleMaster.fields([{
        name: "image",
        maxCount: 1,
    },
    {
        name: "banner",
        maxCount: 1,
    },
    ]),
    masterController.addMasterBrand
);
router.get("/get_master_brand", masterController.getMasterBrand);
router.get("/get_master_brand_by_id/:id", masterController.getMasterBrandById);
router.put(
    "/edit_Master_Brand",
    uploadMultipleMaster.fields([{
        name: "image",
        maxCount: 1,
    },
    {
        name: "banner",
        maxCount: 1,
    },
    ]),
    masterController.editMasterBrand
);
router.delete("/delete_master_brand/:id", masterController.deleteMasterBrand);
router.get("/get_master_brand_by_type/:brandType", masterController.getMasterBrandByType);
router.put("/remove_master_brand/:id", masterController.removeMasterBrand);


// /*Master Settings Tax APIs
// ============================================================================ */
router.post("/add_master_tax", upload.single("image"), masterController.addMasterTax);
router.get("/get_master_tax", masterController.getMasterTax);
router.get("/get_active_master_tax", masterController.getActiveMasterTax);
router.get("/get_master_tax_by_id/:id", masterController.getMasterTaxById);
router.put("/edit_master_tax", upload.single("image"), masterController.editMasterTax);
router.delete("/delete_master_tax/:id", masterController.deleteMasterTax);
router.put("/change_status_master_tax/:id", upload.single("image"), masterController.changeStatusMasterTax);


// /*Master Settings Category (Health Care) APIs
// ============================================================================ */
router.post("/add_category_healthcare", uploadMultipleMaster.single('image'), masterController.addCategoryHealthcare);
router.get("/get_category_healthcare", masterController.getCategoryHealthcare);
router.get("/get_active_category_healthcare", masterController.getActiveCategoryHealthcare);
router.get("/get_category_healthcare_by_id/:id", masterController.getCategoryHealthcareById);
router.put("/edit_Category_Healthcare", uploadMultipleMaster.single('image'), masterController.editCategoryHealthcare);
router.delete("/delete_category_healthcare/:id", masterController.deleteCategoryHealthcare);
router.put("/change_status_category_healthcare/:id", upload.single("image"), masterController.changeStatusCategoryHealthcare);
router.put("/remove_category_healthcare/:id", masterController.removeCategoryHealthcare);




// /*Master Settings Category (Medicine) APIs
// ============================================================================ */
router.get("/get_category_medicine", masterController.getCategoryMedicine);
router.get("/get_active_category_medicine", masterController.getActiveCategoryMedicine);
router.get("/get_category_medicine_by_id/:id", masterController.getCategoryMedicineById);
router.put("/edit_category_medicine", uploadMultipleMaster.single('image'), masterController.editCategoryMedicine);
router.put("/change_status_category_medicine/:id", upload.single("image"), masterController.changeStatusCategoryMedicine);
router.delete("/delete_category_medicine/:id", masterController.deleteCategoryMedicine);


// /*Master Settings Sub  Category (Medicine) APIs
// ============================================================================ */
router.post("/add_sub_category_medicine", upload.single("image"), masterController.addSubCategoryMedicine);
router.get("/get_sub_category_medicine", masterController.getSubCategoryMedicine);
router.get("/get_sub_category_medicine_by_category_id/:categoryId", masterController.getSubCategoryMedicineByCategoryId);
router.get("/get_active_sub_category_medicine", masterController.getActiveSubCategoryMedicine);
router.get("/get_sub_category_medicine_by_id/:id", masterController.getSubCategoryMedicineById);
router.put("/edit_sub_category_medicine", upload.single("image"), masterController.editSubCategoryMedicine);
router.delete("/delete_sub_category_medicine/:id", masterController.deleteSubCategoryMedicine);
router.put("/change_status_sub_category_medicine/:id", upload.single("image"), masterController.changeStatusSubCategoryMedicine);
router.put("/remove_sub_category_medicine/:id", masterController.removeMasterSubCategoryMedicine);


// /* Master Settings Sub Category Health Care APIs
// ============================================================================ */

router.post(
    "/add_sub_category_healthcare",
    uploadMultipleMaster.fields([{
        name: "image",
        maxCount: 1,
    },
    {
        name: "banner",
        maxCount: 1,
    },
    ]),
    masterController.addSubCategoryHealthcare
);
router.get("/get_sub_category_healthcare", masterController.getSubCategoryHealthcare);
router.get("/get_sub_category_healthcare_by_category_id/:categoryId", masterController.getSubCategoryHealthcareByCategoryId);
router.get("/get_active_sub_category_healthcare", masterController.getActiveSubCategoryHealthcare);
router.get("/get_sub_category_healthcare_by_id/:id", masterController.getSubCategoryHealthcareById);
router.put("/change_status_sub_category_healthcare/:id", upload.single("image"), masterController.changeStatusSubCategoryHealthcare);
router.put(
    "/edit_sub_category_healthcare",
    uploadMultipleMaster.fields([{
        name: "image",
        maxCount: 1,
    },
    {
        name: "banner",
        maxCount: 1,
    },
    ]),
    masterController.editSubCategoryHealthcare
);
router.delete("/delete_sub_category_healthcare/:id", masterController.deleteSubCategoryHealthcare);
router.put("/remove_sub_category_healthcare/:id", masterController.removeSubCategoryHealthcare);





// /*Master Settings Sub Sub Category (Health Care) APIs
// ============================================================================ */
router.post("/add_sub_sub_category_healthcare", uploadMultipleMaster.single('image'), masterController.addSubSubCategoryHealthcare);
router.get("/get_sub_sub_category_healthcare", masterController.getSubSubCategoryHealthcare);
router.get("/get_sub_sub_category_healthcare_by_category_id/:subCategoryId", masterController.getSubSubCategoryHealthcareByCategoryId);
router.get("/get_sub_sub_category_healthcare_by_id/:id", masterController.getSubSubCategoryHealthcareById);
router.get("/get_active_sub_sub_category_healthcare", masterController.getActiveSubSubCategoryHealthcare);
router.put("/edit_sub_sub_category_healthcare", uploadMultipleMaster.single('image'), masterController.editSubSubCategoryHealthcare);
router.delete("/delete_sub_sub_category_healthcare/:id", masterController.deleteSubSubCategoryHealthcare);
router.put("/change_status_sub_sub_category_healthcare/:id", upload.single("image"), masterController.changeStatusSubSubCategoryHealthcare);

router.put("/remove_sub_sub_category_healthcare/:id", masterController.removeSubSubCategoryHealthcare);


// /*Master Settings Policy APIs
// ============================================================================ */
router.post("/add_master_policy", upload.single("image"), masterController.addMasterPolicy);
router.get("/get_master_policy", masterController.getMasterPolicy);
router.get("/get_master_policy_by_id/:id", masterController.getMasterPolicyById);
router.get("/get_active_master_policy", masterController.getActiveMasterPolicy);
router.put("/edit_master_policy", upload.single("image"), masterController.editMasterPolicy);
router.delete("/delete_master_policy/:id", masterController.deleteMasterPolicy);
router.put("/change_status_master_policy/:id", upload.single("image"), masterController.changeStatusMasterPolicy);

// /*Master Settings Preference APIs
// ============================================================================ */
router.get("/get_master_preference", masterController.getMasterPreference);
router.put("/edit_master_preference", upload.single("image"), masterController.editMasterPreference);
router.delete("/delete_master_preference", masterController.deleteMasterPreference);
//master settings delivery charge and time
router.get("/get_delivery_charge_time", masterController.getDeliveryChargeTime);
router.put("/edit_delivery_charge_time", masterController.editDeliveryChargeTime);
router.post("/add_delivery_charge_time", masterController.addDeliveryChargeTime);
//Store
router.get('/store_dropdown', storeController.dropdownlistStores)
router.post('/add_store', storeController.addStore)
router.get('/list_store', storeController.listStore)
router.get('/find_store/:id', storeController.findStore)
router.put('/edit_store/:id', storeController.editStore)
router.put('/deactivate_store/:id', storeController.deactivateStore)
router.delete('/delete_store/:id', storeController.deleteStore)
router.get('/get_serviceable_pincodes/:id', storeController.getPincodes)
router.put('/edit_pincode/:id', storeController.editStorePin)
router.delete('/delete_pincode/:id', storeController.deletePin)
router.put('/deactivate_pincode/:id', storeController.activateOrDeactivatePin)
router.post('/add_pincode/:id', storeController.addStorePin)

router.post('/create_master_store', storeController.createMasterStore);
// ********************* STORE WISE UPDATION ******************* \\
router.post('/store_product_updation', storeController.storeStockUpdation)

// router.post('/upload_images', inventoryUpload.fields([{
//         name: "image",
//         // maxCount: 10,
//     },
//     {
//         name: "video",
//         // maxCount: 1,
//     },
// ]), inventoryController.upload)
// router.post('/edit/:id', inventoryUpload.fields([{
//         name: "image",
//         // maxCount: 10,
//     },
//     {
//         name: "video",
//         // maxCount: 1,
//     },
// ]), inventoryController.edit)


//Inventory
router.post('/add_inventory_product', inventoryController.addProducts)
router.get('/list_inventory_products/:type', inventoryController.listProducts)
router.get('/list_inventory_products_ByCategory/:id', inventoryController.listProductsByCategory)
router.get('/get_inventory_byId/:id', inventoryController.getInventoryById)
router.put('/edit_inventory_product/:id', inventoryController.editProduct)
router.put('/deactivate_inventory/:id', inventoryController.deactivateInventory)
router.delete('/delete_inventory/:id', inventoryController.deleteInventory)
router.get('/inventory_category_listing/:type', inventoryController.getInventoryCategory)

router.get('/get_inventory_varients/:categoryId', inventoryController.getInventoryVarients)
router.get('/get_out_of_stock_inventory_varients/:categoryId', inventoryController.getOutOfStockInventoryVarients)
router.get('/get_low_stock_inventory_varients/:categoryId', inventoryController.getLowStockInventoryVarients)
router.get('/get_inventory_varient_byId/:id', inventoryController.getInventoryVarientById)
router.put('/update_inventory_varient/:id', inventoryController.editInventoryVarient)

router.get('/list_inventory', inventoryController.dropdownList)
// router.get('/get_product_by_code/:id', inventoryController.findProductByCode)
// router.get('/get_product_by_name/:id', inventoryController.findProductByName)
router.put('/edit_inventory_stock/:id', inventoryController.editStock)
router.get('/get_inventory_list', inventoryController.inventoryListingWithNameOnly)
router.get('/get_inventory_categories', inventoryController.getHealthcareInventoryCategories)
router.post('/upload_image', inventory_upload.single('image'), inventoryController.uploadInventoryImage)




// User management
router.put('/updateTermsAndCondition/:type', termsAndConditionController.updateTermsAndCondition)
router.put('/add_terms_and_condition/:type', termsAndConditionController.addTermsAndCondition)
router.get('/get_terms_and_condition/:type', termsAndConditionController.getTermsAndConditionDetailsByType)

// premium
router.put('/add_premium', premiumController.addDetailsToPremium)
router.get('/edit_premium', premiumController.getEditDetailsToPremium)
router.put('/update_premium/:id', premiumController.updateDetailsToPremium)

// special premium
router.put('/special_add_premium', specialPremiumController.SpecialAddDetailsToPremium)
router.get('/special-edit_premium/:id', specialPremiumController.SpecialEditDetailsToPremiumById)
router.put('/special_update_premium/:id', specialPremiumController.SpecialUpdateDetailsToPremiumById)
router.get('/special-view_premium', specialPremiumController.ShowDetailsFromSpecialPremium)

// Customer Relation
router.put('/add_customer_relation', customerRelation_upload.single("image"), customerRelationController.addDetailsToCustomerRelation)
router.get('/get_edit_customer_relation/:id', customerRelationController.getEditCustomerRelation)
router.get('/get_view_customer_relation', customerRelationController.getviewtCustomerRelation)


router.put('/add_customer_remarks/:id', customerRelationController.addCustomerRelationRemarks)
router.get('/get_edit_remarks/:id', customerRelationController.getEditDetailsForRemarks)


module.exports = router;