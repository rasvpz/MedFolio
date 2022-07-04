const mongoose = require("mongoose");

const Inventory = require("../models/inventory");
const MasterCategory = require("../models/mastersettings/category");
const MasterSubCategoryHealthcare = require("../models/mastersettings/subCategoryHealthcare");
const MasterSubSubCategoryHealthcare = require("../models/mastersettings/subSubCategory");

const MasterSubCategoryMedicine = require("../models/mastersettings/subCategoryMedicine");

const storeProducts = require('../models/store_products');
const fs = require("fs");
const { isArray } = require("util");

module.exports = {
  // products listing for dropdowns
  dropdownList: async (req, res, next) => {
    try {
      let result = await Inventory.find({}, { name: 1 });

      res.status(200).json({
        status: true,
        message: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  //list medfeed Inventory
  listProducts: async (req, res, next) => {
    try {
      if (req.params.type) {
        if (req.params.type == "healthcare" || req.params.type == "medicine") {
          let result = await Inventory.find(
            { type: req.params.type },
            {
              productId: 1,
              name: 1,
              categories: 1,
              brand: 1,
              isDisabled: 1,
            }
          );

          res.status(200).json({
            status: true,
            data: result,
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Type missing",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  listProductsByCategory: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "medicine" || req.body.type == "healthcare") {
          let result = await Inventory.find(
            { categories: req.params.id, type: req.body.type },
            {
              productId: 1,
              name: 1,
              categories: 1,
              brand: 1,
              isDisabled: 1,
            }
          );

          res.status(200).json({
            status: true,
            data: result,
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Type missing",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //search product By ID

  findProductByCode: async (req, res, next) => {
    try {
      let result = await Inventory.findOne({ productId: req.params.id });
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
  findProductByName: async (req, res, next) => {
    try {
      let result = await Inventory.findOne({ name: req.params.name });
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

  //enter questions to the Inventory
  // addProducts: async(req, res, next) => {
  //     try {
  //         let existingName = await Inventory.findOne({ name: req.body.name });
  //         let existingCode = await Inventory.findOne({ productId: req.body.productId });

  //         let data = req.body;
  //         const obj = {
  //             type: data.type,
  //             productId: data.productId,
  //             name: data.name,
  //             categories: data.categories,
  //             stockAlert: data.stockAlert,
  //             statusLimit: data.statusLimit,
  //             brand: data.brand,
  //             policy: data.policy,
  //             prescription: data.prescription,
  //             description: data.description,
  //             directionsOfUse: data.directionsOfUse,
  //             content: data.content,
  //             warning: data.warning,
  //             sideEffects: data.sideEffects,
  //             metaTitles: data.metaTitles,
  //             moreInfo: data.moreInfo,
  //             tags: data.tags,
  //             relatedProducts: data.relatedProducts,
  //             substitutions: data.substitutions,
  //             store: data.store,
  //             createdBy: req.user._id
  //         }
  //         if (!existingCode) {
  //             if (!existingName) {
  //                 let schemaObj = new Inventory(obj);
  //                 schemaObj
  //                     .save()
  //                     .then((response) => {
  //                         res.status(200).json({
  //                             status: true,
  //                             data: "Products added successfully",
  //                         });
  //                     }).catch((error) => {
  //                         res.status(200).json({
  //                             status: false,
  //                             data: error
  //                         });
  //                     })
  //             } else {
  //                 res.status(422).json({
  //                     status: false,
  //                     data: "A Product is already exists with this name",
  //                 });
  //             }
  //         } else {
  //             res.status(422).json({
  //                 status: false,
  //                 data: "A Product is already exists with this Code",
  //             });
  //         }

  //     } catch (error) {
  //         next(error);
  //     }

  // },
  //modify Inventorye data
  // editProduct: async(req, res, next) => {
  //     try {
  //         let valid = await Inventory.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
  //         let data = req.body;
  //         if (valid) {
  //             const obj = {
  //                 type: data.type,
  //                 productId: data.productId,
  //                 name: data.name,
  //                 categories: data.categories,
  //                 stockAlert: data.stockAlert,
  //                 statusLimit: data.statusLimit,
  //                 brand: data.brand,
  //                 policy: data.policy,
  //                 prescription: data.prescription,
  //                 description: data.description,
  //                 directionsOfUse: data.directionsOfUse,
  //                 content: data.content,
  //                 warning: data.warning,
  //                 sideEffects: data.sideEffects,
  //                 metaTitles: data.metaTitles,
  //                 moreInfo: data.moreInfo,
  //                 tags: data.tags,
  //                 relatedProducts: data.relatedProducts,
  //                 substitutions: data.substitutions,
  //                 store: data.store,
  //                 createdBy: data.createdBy
  //             }
  //             Inventory.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) },
  //                 obj
  //             ).then((response) => {
  //                 console.log(response)
  //                 if (response.nModified == 1) {
  //                     let date = new Date()
  //                     Inventory.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
  //                         updatedAt: date
  //                     }).then((response) => {
  //                         res.status(200).json({
  //                             status: true,
  //                             data: 'Updated'
  //                         })
  //                     })
  //                 } else {
  //                     res.status(422).json({
  //                         status: false,
  //                         data: 'no changes'
  //                     })
  //                 }
  //             })
  //         } else {
  //             res.status(422).json({
  //                 status: false,
  //                 data: 'invalid Inventory ID'
  //             })
  //         }
  //     } catch (error) {
  //         next(error)
  //     }
  // },
  //Inventory Activate Deactivate
  deactivateInventory: async (req, res, next) => {
    try {
      let valid = await Inventory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      let data = req.body;
      if (valid) {
        Inventory.updateOne(
          { _id: mongoose.Types.ObjectId(req.params.id) },
          {
            $set: {
              isDisabled: data.status,
            },
          }
        ).then((response) => {
          console.log(response);
          if (response.nModified == 1) {
            let date = new Date();
            Inventory.updateOne(
              { _id: mongoose.Types.ObjectId(req.params.id) },
              {
                updatedAt: date,
              }
            ).then((response) => {
              res.status(200).json({
                status: true,
                data: "Updated",
              });
            });
          } else {
            res.status(422).json({
              status: false,
              data: "no changes",
            });
          }
        });
      } else {
        res.status(422).json({
          status: false,
          data: "invalid Inventory ID",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  //delete all Questions
  deleteInventory: async (req, res, next) => {
    try {
      Inventory.deleteOne({ _id: req.params.id }).then((response) => {
        res.status(200).json({
          status: true,
          data: "Inventory Deleted",
        });
      });
    } catch (error) {
      next(error);
    }
  },
  editStock: (req, res, next) => {
    try {
      Inventory.findOne({ "store.pricing._id": req.params.id }).then(
        (response) => {
          if (response) {
            let data = [];
            for (let item of response.pricing) {
              if (item._id == req.params.id) {
                item = req.body;
                item._id = req.params.id;
              }
              data.push(item);
            }
            response.store[0].pricing = data;
            Inventory.updateOne({ _id: response._id }, response).then((r) => {
              if (r.nModified === 1) {
                res.status(200).json({
                  status: true,
                  data: "Stock Updated",
                });
              } else {
                res.status(422).json({
                  status: false,
                  data: "No Changes",
                });
              }
            });
          } else {
            res.status(422).json({
              status: false,
              data: "invalid Stock ID",
            });
          }
        }
      );
    } catch (error) {
      next(error);
    }
  },
  inventoryListingWithNameOnly: async (req, res, next) => {
    try {
      let list = await Inventory.find({ isActive: true }, { name: 1 });

      res.status(200).json({
        status: true,
        data: {
          products: list,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getHealthcareInventoryCategories: async (req, res, next) => {
    try {
      let allCategories = [];

      let healthcareCategories = await MasterCategory.find(
        { categoryType: "healthcare" },
        { title: 1 }
      ).lean();

      for (i = 0; i < healthcareCategories.length; i++) {
        let subCategories = await MasterSubCategoryHealthcare.find(
          { categoryId: healthcareCategories[i]._id },
          { title: 1 }
        ).lean();

        for (j = 0; j < subCategories.length; j++) {
          let subSubCategories = await MasterSubSubCategoryHealthcare.find(
            { subCategoryId: mongoose.Types.ObjectId(subCategories[j]._id) },
            { title: 1 }
          ).lean();
          subCategories[j].sub_sub_categories = subSubCategories;
        }

        healthcareCategories[i].sub_categories = subCategories;

        // MasterSubCategoryHealthcare
      }

      let structure = [];

      res.status(200).json({
        status: true,
        message: "success",
        data: healthcareCategories,
      });
    } catch (error) {
      next(error);
    }
  },
  addProducts: async (req, res, next) => {
    try {
      if (req.body.type == "healthcare") {
        let existingName = await Inventory.findOne({ name: req.body.name });
        let existingCode = await Inventory.findOne({
          productId: req.body.productId,
        });
        let data = req.body;

        let baseurl = process.env.BASE_URL;

        for (i = 0; i < data.pricing.length; i++) {
          console.log("imageesaa", data.pricing[i]);
          for (j = 0; j < data.pricing[i].image.length; j++) {
            data.pricing[i].image[j] = data.pricing[i].image[j].replace(
              baseurl,
              ""
            );
            console.log("11", data.pricing[i].image[j]);
          }
        }

        const obj = {
          type: data.type,
          productId: data.productId,
          name: data.name,
          categories: data.categories,
          online: data.online,
          tax: data.tax,
          stockAlert: data.stockAlert,
          statusLimit: data.statusLimit,
          offerType: data.offerType,
          brand: data.brand,
          policy: data.policy,
          prescription: data.prescription,
          description: data.description,
          directionsOfUse: data.directionsOfUse,
          content: data.content,
          warning: data.warning,
          sideEffects: data.sideEffects,
          metaTitles: data.metaTitles,
          moreInfo: data.moreInfo,
          tags: data.tags,
          relatedProducts: data.relatedProducts,
          substitutions: data.substitutions,
          pricing: data.pricing,
          createdBy: req.user._id,
        };
        if (!existingCode) {
          if (!existingName) {
            let schemaObj = new Inventory(obj);
            schemaObj
              .save()
              .then((_) => {
                res.status(200).json({
                  status: true,
                  data: "Products added successfully",
                });
              })
              .catch((error) => {
                res.status(200).json({
                  status: false,
                  data: error,
                });
              });
          } else {
            res.status(422).json({
              status: false,
              data: "A Product is already exists with this name",
            });
          }
        } else {
          res.status(422).json({
            status: false,
            data: "A Product is already exists with this Code",
          });
        }
      } else if (req.body.type == "medicine") {
        let existingName = await Inventory.findOne({ name: req.body.name });
        let existingCode = await Inventory.findOne({
          productId: req.body.productId,
        });
        let data = req.body;

        let baseurl = process.env.BASE_URL;

        for (i = 0; i < data.pricing.length; i++) {
          console.log("imageesaa", data.pricing[i]);
          for (j = 0; j < data.pricing[i].image.length; j++) {
            data.pricing[i].image[j] = data.pricing[i].image[j].replace(
              baseurl,
              ""
            );
            console.log("11", data.pricing[i].image[j]);
          }
        }

        const obj = {
          type: data.type,
          productId: data.productId,
          name: data.name,
          categories: data.categories,
          online: data.online,
          tax: data.tax,
          stockAlert: data.stockAlert,
          statusLimit: data.statusLimit,
          brand: data.brand,
          policy: data.policy,
          prescription: data.prescription,
          description: data.description,
          directionsOfUse: data.directionsOfUse,
          content: data.content,
          warning: data.warning,
          sideEffects: data.sideEffects,
          metaTitles: data.metaTitles,
          moreInfo: data.moreInfo,
          tags: data.tags,
          relatedProducts: data.relatedProducts,
          substitutions: data.substitutions,
          pricing: data.pricing,
          createdBy: req.user._id,
        };
        if (!existingCode) {
          if (!existingName) {
            let schemaObj = new Inventory(obj);
            schemaObj
              .save()
              .then((_) => {
                res.status(200).json({
                  status: true,
                  data: "Products added successfully",
                });
              })
              .catch((error) => {
                res.status(200).json({
                  status: false,
                  data: error,
                });
              });
          } else {
            res.status(422).json({
              status: false,
              data: "A Product is already exists with this name",
            });
          }
        } else {
          res.status(422).json({
            status: false,
            message: "A Product is already exists with this Code",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryById: async (req, res, next) => {
    try {
      let result = await Inventory.findOne(
        { _id: req.params.id },
        {
          createdBy: 0,
          __v: 0,
        }
      ).lean();

      if (result) {
        for (i = 0; i < result.pricing.length; i++) {
          for (j = 0; j < result.pricing[i].image.length; j++) {
            result.pricing[i].image[j] = process.env.BASE_URL.concat(
              result.pricing[i].image[j]
            );
          }
        }

        return res.status(200).json({
          status: true,
          data: result,
        });
      } else {
        res.status(422).json({
          status: false,
          data: "Invalid Id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  editProduct: async (req, res, next) => {
    try {
      let valid = await Inventory.findOne({ _id: req.params.id });
      if (valid) {
        let baseurl = process.env.BASE_URL;

        for (i = 0; i < req.body.pricing.length; i++) {
          for (j = 0; j < req.body.pricing[i].image.length; j++) {
            req.body.pricing[i].image[j] = req.body.pricing[i].image[j].replace(
              baseurl,
              ""
            );
          }
        }
        
        if (req.body.type == "healthcare") {
          let existingName = await Inventory.findOne({
            _id: { $ne: req.params.id },
            name: req.body.name,
          });
          let existingCode = await Inventory.findOne({
            _id: { $ne: req.params.id },
            productId: req.body.productId,
          });
          let data = req.body;
          const obj = {
            type: data.type,
            productId: data.productId,
            name: data.name,
            categories: data.categories,
            online: data.online,
            tax: data.tax,
            stockAlert: data.stockAlert,
            statusLimit: data.statusLimit,
            offerType: data.offerType,
            brand: data.brand,
            policy: data.policy,
            prescription: data.prescription,
            description: data.description,
            directionsOfUse: data.directionsOfUse,
            content: data.content,
            warning: data.warning,
            sideEffects: data.sideEffects,
            metaTitles: data.metaTitles,
            moreInfo: data.moreInfo,
            tags: data.tags,
            relatedProducts: data.relatedProducts,
            substitutions: data.substitutions,
            pricing: data.pricing,
            createdBy: req.user._id,
          };
          if (!existingCode) {
            if (!existingName) {
              Inventory.updateOne({ _id: valid._id }, data).then((response) => {
                if (response.nModified == 1) {
                  res.status(200).json({
                    status: true,
                    data: "Products Updated successfully",
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    data: "Products Not updated",
                  });
                }
              });
            } else {
              res.status(422).json({
                status: false,
                data: "A Product is already exists with this name",
              });
            }
          } else {
            res.status(422).json({
              status: false,
              data: "A Product is already exists with this Code",
            });
          }
        } else if (req.body.type == "medicine") {
          let existingName = await Inventory.findOne({
            _id: { $ne: req.params.id },
            name: req.body.name,
          });
          let existingCode = await Inventory.findOne({
            _id: { $ne: req.params.id },
            productId: req.body.productId,
          });
          let data = req.body;
          const obj = {
            type: data.type,
            productId: data.productId,
            name: data.name,
            categories: data.categories,
            online: data.online,
            tax: data.tax,
            stockAlert: data.stockAlert,
            statusLimit: data.statusLimit,
            brand: data.brand,
            policy: data.policy,
            prescription: data.prescription,
            description: data.description,
            directionsOfUse: data.directionsOfUse,
            content: data.content,
            warning: data.warning,
            sideEffects: data.sideEffects,
            metaTitles: data.metaTitles,
            moreInfo: data.moreInfo,
            tags: data.tags,
            relatedProducts: data.relatedProducts,
            substitutions: data.substitutions,
            pricing: data.pricing,
            createdBy: req.user._id,
          };
          if (!existingCode) {
            if (!existingName) {
              Inventory.updateOne({ _id: valid._id }, data).then((response) => {
                if (response.nModified == 1) {
                  res.status(200).json({
                    status: true,
                    data: "Products Updated successfully",
                  });
                } else {
                  res.status(200).json({
                    status: true,
                    data: "Products Not updated",
                  });
                }
              });
            } else {
              res.status(422).json({
                status: false,
                data: "A Product is already exists with this name",
              });
            }
          } else {
            res.status(422).json({
              status: false,
              data: "A Product is already exists with this Code",
            });
          }
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryCategory: async (req, res, next) => {
    try {
      if (req.params.type == "healthcare" || req.params.type == "medicine") {
        if (req.params.type == "medicine") {
          let mainCategories = await MasterCategory.find(
            { categoryType: req.params.type, isDisabled: false },
            {
              title: 1,
            }
          ).lean();
          console.log("main cat:", mainCategories);

          for (let item of mainCategories) {
            let subCategories = await MasterSubCategoryMedicine.find(
              { categoryId: mongoose.Types.ObjectId(item._id) },
              {
                title: 1,
              }
            ).lean();

            item.subCategories = subCategories;
          }

          console.log("main cat medicine last:", mainCategories);

          return res.status(200).json({
            status: true,
            message: "success",
            data: {
              categories: mainCategories,
            },
          });
        } else {
          let mainCategories = await MasterCategory.find(
            { categoryType: req.params.type, isDisabled: false },
            {
              title: 1,
            }
          ).lean();
          console.log("main cat health:", mainCategories);

          for (let item of mainCategories) {
            let subCategories = await MasterSubCategoryHealthcare.find(
              { categoryId: mongoose.Types.ObjectId(item._id) },
              {
                title: 1,
              }
            ).lean();

            for (let i of subCategories) {
              let subSubCategoryHealthcare =
                await MasterSubSubCategoryHealthcare.find(
                  { subCategoryId: mongoose.Types.ObjectId(i._id) },
                  {
                    title: 1,
                  }
                );

              if (subSubCategoryHealthcare.length) {
                i.subSubCategories = subSubCategoryHealthcare;
              }
            }

            item.subCategories = subCategories;
          }

          console.log("main cat health last:", mainCategories);

          return res.status(200).json({
            status: true,
            message: "success",
            data: {
              categories: mainCategories,
            },
          });
        }

        // let result = await MasterCategory.find({ isActive: true }, { title: 1 });
        // res.status(200).json({
        //   status: true,
        //   data: result,
        // });
      } else {
        res.status(422).json({
          status: false,
          data: "Invalid Type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryVarients: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          let products = [];

          if (req.params.categoryId == "all") {
            products = await Inventory.find({ type: req.body.type });

            for (let item of products) {
              let categories = [];
              if (item.type == "medicine") {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryMedicine.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }
                }
                item.categories = categories;
              } else {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }

                  let subSubCategory =
                    await MasterSubSubCategoryHealthcare.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                  if (subSubCategory) {
                    categories.push(subSubCategory.title);
                  }
                }
              }

              item.categories = categories;
            }
          } else {
            products = await Inventory.find({
              type: req.body.type,
              categories: req.params.categoryId,
            }).lean();

            for (let item of products) {
              let categories = [];
              if (item.type == "medicine") {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryMedicine.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }
                }
                item.categories = categories;
              } else {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }

                  let subSubCategory =
                    await MasterSubSubCategoryHealthcare.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                  if (subSubCategory) {
                    categories.push(subSubCategory.title);
                  }
                }
              }

              item.categories = categories;
            }
          }

          let newArray = [];

          for (i = 0; i < products.length; i++) {
            let tempProdObj = {
              productId: products[i].productId,
              name: products[i].name,
              category: products[i].categories,
              brand: products[i].brand,
            };

            for (j = 0; j < products[i].pricing.length; j++) {
              let varientObj = tempProdObj;
              varientObj.sku = products[i].pricing[j].sku;
              varientObj.skuOrHsnNo = products[i].pricing[j].skuOrHsnNo;
              varientObj.price = products[i].pricing[j].price;
              varientObj.stock = products[i].pricing[j].stock;
              varientObj.image = process.env.BASE_URL.concat(
                products[i].pricing[j].image[0]
              );
              varientObj._id = products[i].pricing[j]._id;

              newArray.push(varientObj);
            }
          }

          res.status(200).json({
            status: true,
            message: "success",
            data: {
              product_varients: newArray,
            },
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getOutOfStockInventoryVarients: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          let products = [];

          if (req.params.categoryId == "all") {
            products = await Inventory.find({ type: req.body.type }).lean();

            for (let item of products) {
              let categories = [];
              if (item.type == "medicine") {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryMedicine.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }
                }
                item.categories = categories;
              } else {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }

                  let subSubCategory =
                    await MasterSubSubCategoryHealthcare.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                  if (subSubCategory) {
                    categories.push(subSubCategory.title);
                  }
                }
              }

              item.categories = categories;
            }
          } else {
            products = await Inventory.find({
              type: req.body.type,
              categories: req.params.categoryId,
            }).lean();

            for (let item of products) {
              let categories = [];
              if (item.type == "medicine") {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryMedicine.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }
                }
                item.categories = categories;
              } else {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }

                  let subSubCategory =
                    await MasterSubSubCategoryHealthcare.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                  if (subSubCategory) {
                    categories.push(subSubCategory.title);
                  }
                }
              }

              item.categories = categories;
            }
          }

          let newArray = [];

          for (i = 0; i < products.length; i++) {
            let tempProdObj = {
              productId: products[i].productId,
              name: products[i].name,
              category: products[i].categories,
              brand: products[i].brand,
            };

            for (j = 0; j < products[i].pricing.length; j++) {
              if (products[i].pricing[j].stock == 0) {
                let varientObj = tempProdObj;
                varientObj.sku = products[i].pricing[j].sku;
                varientObj.skuOrHsnNo = products[i].pricing[j].skuOrHsnNo;
                varientObj.price = products[i].pricing[j].price;
                varientObj.stock = products[i].pricing[j].stock;
                varientObj.image = process.env.BASE_URL.concat(
                  products[i].pricing[j].image[0]
                );
                varientObj._id = products[i].pricing[j]._id;

                newArray.push(varientObj);
              }
            }
          }

          res.status(200).json({
            status: true,
            message: "success",
            data: {
              product_varients: newArray,
            },
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getLowStockInventoryVarients: async (req, res, next) => {
    try {
      if (req.body.type) {
        if (req.body.type == "healthcare" || req.body.type == "medicine") {
          let products = [];

          if (req.params.categoryId == "all") {
            products = await Inventory.find({ type: req.body.type }).lean();

            for (let item of products) {
              let categories = [];
              if (item.type == "medicine") {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryMedicine.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }
                }
                item.categories = categories;
              } else {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }

                  let subSubCategory =
                    await MasterSubSubCategoryHealthcare.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                  if (subSubCategory) {
                    categories.push(subSubCategory.title);
                  }
                }
              }

              item.categories = categories;
            }
          } else {
            products = await Inventory.find({
              type: req.body.type,
              categories: req.params.categoryId,
            }).lean();

            for (let item of products) {
              let categories = [];
              if (item.type == "medicine") {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryMedicine.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }
                }
                item.categories = categories;
              } else {
                for (let i of item.categories) {
                  let subCategory = await MasterSubCategoryHealthcare.findOne({
                    _id: mongoose.Types.ObjectId(i),
                  });
                  if (subCategory) {
                    categories.push(subCategory.title);
                  }

                  let subSubCategory =
                    await MasterSubSubCategoryHealthcare.findOne({
                      _id: mongoose.Types.ObjectId(i),
                    });
                  if (subSubCategory) {
                    categories.push(subSubCategory.title);
                  }
                }
              }

              item.categories = categories;
            }
          }

          let newArray = [];

          for (i = 0; i < products.length; i++) {
            let tempProdObj = {
              productId: products[i].productId,
              name: products[i].name,
              category: products[i].categories,
              brand: products[i].brand,
            };

            for (j = 0; j < products[i].pricing.length; j++) {
              if (products[i].pricing[j].stock <= products[i].stockAlert) {
                let varientObj = tempProdObj;
                varientObj.sku = products[i].pricing[j].sku;
                varientObj.skuOrHsnNo = products[i].pricing[j].skuOrHsnNo;
                varientObj.price = products[i].pricing[j].price;
                varientObj.stock = products[i].pricing[j].stock;
                varientObj.image = process.env.BASE_URL.concat(
                  products[i].pricing[j].image[0]
                );
                varientObj._id = products[i].pricing[j]._id;

                newArray.push(varientObj);
              }
            }
          }

          res.status(200).json({
            status: true,
            message: "success",
            data: {
              product_varients: newArray,
            },
          });
        } else {
          res.status(422).json({
            status: false,
            message: "Invalid type",
          });
        }
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getInventoryVarientById: async (req, res, next) => {
    try {
      let varient = await Inventory.aggregate([
        { $match: { "pricing._id": mongoose.Types.ObjectId(req.params.id) } },
        {
          $project: {
            pricing: {
              $filter: {
                input: "$pricing",
                as: "pricing",
                cond: {
                  $gte: [
                    "$$pricing._id",
                    mongoose.Types.ObjectId(req.params.id),
                  ],
                },
              },
            },
            _id: 0,
          },
        },
        { $unwind: "$pricing" },
        {
          $project: {
            "product_varient.price": "$pricing.price",
            "product_varient.specialPrice": "$pricing.specialPrice",
            "product_varient.stock": "$pricing.stock",
          },
        },
      ]);

      if (varient.length) {
        varient = varient[0];
      }

      if (varient) {
        res.status(200).json({
          status: true,
          message: "success",
          data: varient,
        });
      } else {
        res.status(422).json({
          status: false,
          message: "Invalid id",
        });
      }
      res.status();
    } catch (error) {
      next(error);
    }
  },
  editInventoryVarient: async (req, res, next) => {
    try {
      Inventory.findOne({ "pricing._id": req.params.id })
        .then((response) => {
          if (response) {
            let data = [];
            for (let item of response.pricing) {
              if (item._id == req.params.id) {
                if (req.body.price) {
                  item.price = req.body.price;
                }
                if (req.body.specialPrice) {
                  item.specialPrice = req.body.specialPrice;
                }
                if (req.body.stock) {
                  item.stock = req.body.stock;
                }

                item._id = req.params.id;
              }
              data.push(item);
            }
            response.pricing = data;
            Inventory.updateOne({ _id: response._id }, response).then((r) => {
              if (r.nModified === 1) {
                res.status(200).json({
                  status: true,
                  data: "Stock Updated",
                });
              } else {
                res.status(422).json({
                  status: false,
                  data: "No Changes",
                });
              }
            });
          } else {
            res.status(422).json({
              status: false,
              data: "invalid Varient ID",
            });
          }
        })
        .catch((error) => {
          res.status(422).json({
            status: false,
            data: error + "",
          });
        });
    } catch (error) {
      next(error);
    }
  },
  uploadInventoryImage: async (req, res, next) => {
    try {
      if (req.file) {
        let image = `${process.env.BASE_URL}inventory/${req.file.filename}`;
        res.status(200).json({
          status: true,
          message: "uploaded successfully",
          data: {
            image_path: image,
          },
        });
      } else {
        res.status(422).json({
          status: false,
          message: "Please upload image",
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
