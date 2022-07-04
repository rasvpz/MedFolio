const mongoose = require("mongoose");
const PremiumCrud = require("../../models/premium/crudPremium");

const fs = require("fs");
const { isArray } = require("util");

module.exports = {
addDetailsToPremium: async (req, res, next) => {
  try {
let data = req.body;
data.createdBy = req.user._id;
      const obj = new PremiumCrud(data);
      obj
        .save()
        .then((_) => {
          res.status(200).json({
            status: true,
            data: "Added data to premium",
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

getEditDetailsToPremium: async (req, res, next) => 
{
  try {

    let result = await PremiumCrud.find();
    if (!result) {
      res.status(422).json({
        status: false,
        data: "No products",
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

updateDetailsToPremium: async (req, res, next) => {
  
  let data = req.body; 
  data.createdBy = req.user._id;
  await PremiumCrud.updateOne({_id: mongoose.Types.ObjectId(req.params.id)}, data).then(
        (response) => {
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
        }
      );
},
};
