const express = require("express");
const router = express.Router();
const multer = require("multer");
const customerController = require("../controllers/customerController");


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/ads");
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${Date.now()}`+path.extname(file.originalname)) 
        //cb(null, `${file.fieldname}_${Date.now()}.jpg`);
    },
});
const upload = multer({
    storage: storage, 
}).single("file");




/* Customer Database  APIs
============================================= */
router.post("/addCustomer", upload, customerController.addCustomer);
router.get("/getCustomers", customerController.getCustomers);
router.put("/updateCustomerRemarks", upload,customerController.updateCustomerRemarks);



/*Promotional Email  APIs
============================================= */
router.post("/addPromotionalEmail", upload, customerController.addPromotionalEmail);
router.get("/getPromotionalEmail", customerController.getPromotionalEmail);


/*Promotional SMS  APIs
============================================= */
//router.post("/addPromotionalSMS", upload, customerController.addPromotionalSMS);


module.exports = router;