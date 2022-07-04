const mongoose = require("mongoose");
const CustomerRelation = require("../../models/modelCustomerRelation/customerRelation");
const CustomerRemarks = require("../../models/modelCustomerRelation/customerRemarks");
const fs = require("fs");
const { isArray } = require("util");

// Add registration details to  CustomerRelation collection
module.exports = {
  addDetailsToCustomerRelation: async (req, res, next) => {
    try {
      let data = req.body;
      let formData = data.mobile;
      data.createdBy = req.user._id;
      console.log("My Image")
      console.log(data.image);
      if (req.file) {
        data.image = `${req.file.filename}`;        
      } else{
        data.image = "fefault.png";
      }

      let result = await CustomerRelation.findOne({ mobile: formData });
      console.log(result);
      if (!result) {
        const obj = new CustomerRelation(data);
        obj.save().then((_) => {
          res.status(200).json({
            status: true,
            data: "Added data to Customer",
          });
        });
      } else {
        console.log("not found");
        res.status(200).json({
          status: false,
          data: "Allready registered",
        });
      }
    } catch (error) {
      next(error);
    }
  },
// View registration details from CustomerRelation collection
  getviewtCustomerRelation: async (req, res, next) => {
    try {  
// Pagination in customer relation page starts here      
      var limit = parseInt(req.body.limit);
      if (limit == 0) limit = 10;
      var skip = (parseInt(req.body.page) - 1) * parseInt(limit);
      let result = await CustomerRelation.find({})
          .sort("-id")
          .limit(limit)
          .skip(skip)
// Pagination in customer relation page ends here   
      
      if (!result) {
        res.status(422).json({
          status: false,
          data: "No data to display",
        });
      } else {
        res.status(200).json({
          status: true,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  },
  // get data from collection for edit   
  getEditCustomerRelation: async (req, res, next) => {
    try {    
      let id = req.params.id;
      console.log(id);
      let result = await CustomerRemarks.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id)},
        { name: 1, mobile: 1, email: 1, address: 1, pincode: 1, image: 1, zone: 1, total: 1, orderValue:1 }
      );
      if (!result) {
        res.status(422).json({
          status: false,
          data: "No remarks to display",
        });
      } else {
        res.status(200).json({
          status: true,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  }, 
  // Add data to collection CustomerRemarks 
   addCustomerRelationRemarks: async (req, res, next) => {
    try {
  let data = req.body;
  data.createdBy = req.user._id;
  data.customerId = req.params.id;
    
        const obj = new CustomerRemarks(data);
        obj
          .save()
          .then((_) => {
            res.status(200).json({
              status: true,
              data: "Remarks Added Successfully",
            });
          })
          .catch(async (error) => {
            res.status(200).json({
              status: false,
              data: error,
            });
          });
  
    } catch (error) {
      next(error);
    }
  },
// fetchinh details from remarks collection for editing
getEditDetailsForRemarks: async (req, res, next) => {
    try {    
      let id = req.params.id;
      console.log(id);
      let result = await CustomerRemarks.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id)},
        { remarks: 1, customerId: 1 }
      );
      if (!result) {
        res.status(422).json({
          status: false,
          data: "No remarks to display",
        });
      } else {
        res.status(200).json({
          status: true,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  },

};
