const bcrypt = require('bcryptjs')
const mongoose = require("mongoose");
// const StoresPin = require("../models/store");

var Store = require('../models/store');
const storeProducts = require('../models/store_products');
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

module.exports = {
    createMasterStore: async (req, res, next) => {
        try {
            let exist = await Store.findOne({ masterStore: true })

            if (!exist) {
                let data = {
                    name: 'Master',
                    masterStore: true,
                    level:0
                }

                let schemaObj = Store(data)

                schemaObj.save().then((response) => {
                    res.status(200).json({
                        status: true,
                        message: 'Master store created successfully'
                    })
                }).catch((error) => {
                    res.status(422).json({
                        status: true,
                        message: error + ''
                    })
                })

            } else {
                res.status(422).json({
                    status: false,
                    message: 'Main store already added'
                })
            }

        } catch (error) {
            next(error)
        }
    },
    //list  Store
    listStore: async (req, res, next) => {
        try {
            let result = await Store.find({ masterStore: { $ne: true } }, {
                parent: 1,
                name: 1,
                email: 1,
                phone: 1,
                password: 1,
                isDisabled: 1
            }).lean()
            for (let item of result) {
                let parent = await Store.findOne({ _id: mongoose.Types.ObjectId(item.parent) })
                if (parent) {
                    item.parent = parent.name
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
    //search Store 

    findStore: async (req, res, next) => {
        try {
            let result = await Store.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                password: 0,
                __v: 0,
                createdAt: 0,
                updatedAt: 0
            });

            res.status(200).json({
                status: true,
                data: result,
            });

        } catch (error) {
            next(error);
        }
    },
    //enter Store details
    addStore: async (req, res, next) => {

        try {
            let data = req.body;

            // let masterstore = await Store.findOne({masterStore: true})

            // if(req.body.parent) {
            //     if(masterstore._id == req.body.parent) {
            //         data.level = 1
            //     } else {
            //         let storeDetails = await Store.findOne({_id: mongoose.Types.ObjectId(req.body.parent), masterStore: {$ne: true}})

            //         if(storeDetails) {
            //             let twoStoreDetails = await Store.findOne({_id: mongoose.Types.ObjectId(storeDetails.parent), masterStore: {$ne: true}})

            //             if(twoStoreDetails) {
            //                 data.level = 3

            //                 let details = await Store.findOne({_id: mongoose.Types.ObjectId(twoStoreDetails.parent), masterStore: {$ne: true}})

            //                 if(details) {
            //                     return res.status(422).json({
            //                         status: true,
            //                         data: "Cannot add a store under this store",
            //                     });
            //                 }

            //             } else {
            //                 data.level = 2
            //             }

            //         } else {
            //             res.status(422).json({
            //                 status: true,
            //                 data: "Invalid Id",
            //             });
            //         }
            //     }

            // }
            if (req.body.parent) {
                let parentDetails = await Store.findOne({ _id: mongoose.Types.ObjectId(req.body.parent) })
                if (parentDetails) {
                    if(parentDetails.level==3){
                        return res.status(422).json({
                            status: true,
                            data: "Cannot choose this store as parent",
                        });
                    }else{
                        data.level=parentDetails.level+1
                    }
                } else {
                   return res.status(422).json({
                        status: true,
                        data: "Invalid Id",
                    });
                }
            }

            let existingName = await Store.findOne({ name: req.body.name });

            if (!existingName) {
                data.password = await bcrypt.hash(data.password, 12);
                let schemaObj = new Store(data);
                schemaObj
                    .save()
                    .then((response) => {
                        res.status(200).json({
                            status: true,
                            data: "Store details added successfully",
                        });
                    })
            } else {
                res.status(422).json({
                    status: false,
                    data: "Data is already exists with this name",
                });

            }
        } catch (error) {
            next(error);
        }

    },
    //modify Store 
    editStore: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            let data = req.body;

            if (valid.parent != data.parent) {
                if (req.body.parent) {
                    let parentDetails = await Store.findOne({ _id: mongoose.Types.ObjectId(req.body.parent) })
                    if (parentDetails) {
                        if(parentDetails.level==3){
                            return res.status(422).json({
                                status: true,
                                data: "Cannot choose this store as parent",
                            });
                        }else{
                            data.level=parentDetails.level+1
                        }
                    } else {
                       return res.status(422).json({
                            status: true,
                            data: "Invalid Id",
                        });
                    }
                }
            }

            if (valid) {
                if (data.password) {
                    data.password = await bcrypt.hash(data.password, 12);
                }
                Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) },
                    data
                ).then((response) => {
                    console.log(response)
                    if (response.nModified == 1) {
                        let date = new Date()
                        Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                            updatedAt: date
                        }).then((response) => {
                            res.status(200).json({
                                status: true,
                                data: 'Updated'
                            })
                        })
                    } else {
                        res.status(422).json({
                            status: false,
                            data: 'no changes'
                        })
                    }
                })
            } else {
                res.status(422).json({
                    status: false,
                    data: 'invalid Store ID'
                })
            }


        } catch (error) {
            next(error)
        }
    },
    //Store Activate Deactivate
    deactivateStore: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            let data = req.body;
            if (valid) {
                let status
                if (valid.isDisabled) {
                    status = false
                } else {
                    status = true
                }
                Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                    $set: {
                        isDisabled: status
                    }

                }).then((response) => {
                    console.log(response)
                    if (response.nModified == 1) {
                        let date = new Date()
                        Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                            updatedAt: date
                        }).then((response) => {
                            res.status(200).json({
                                status: true,
                                data: 'Updated'
                            })
                        })
                    } else {
                        res.status(422).json({
                            status: false,
                            data: 'no changes'
                        })
                    }
                })
            } else {
                res.status(422).json({
                    status: false,
                    data: 'invalid Store ID'
                })
            }


        } catch (error) {
            next(error)
        }
    },
    //delete store
    deleteStore: async (req, res, next) => {
        try {
            Store.deleteOne({ _id: req.params.id }).then(() => {
                res.status(200).json({
                    status: true,
                    data: 'Store Deleted'
                })
            })

        } catch (error) {
            next(error)
        }
    },
    getPincodes: async (req, res, next) => {
        try {
            let count = 0
            let result = await Store.findOne({ _id: req.params.id }, {
                serviceablePincodes: 1
            }).lean()
            for (let item of result.serviceablePincodes) {
                count++
                item.sl = count
            }
            res.status(200).json({
                status: true,
                data: result
            })

        } catch (error) {
            next(error)
        }
    },
    editStorePin: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ 'serviceablePincodes._id': req.params.id });
            if (valid) {
                Store.updateOne({ 'serviceablePincodes._id': req.params.id }, { $set: { "serviceablePincodes.$.code": req.body.code } }).then((response) => {
                    let date = new Date()
                        Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                            updatedAt: date
                        }).then((_) => {
                            res.status(200).json({
                                status: true,
                                data: 'Updated'
                            })
                        })
                })

            } else {
                res.status(422).json({
                    status: false,
                    data: 'Invalid Id'
                })
            }
        } catch (error) {
            next(error)
        }
    },
    deletePin: async (req, res, next) => {
        try {
            Store.updateOne({ 'serviceablePincodes._id': req.params.id }, { $pull: { "serviceablePincodes": { "_id": req.params.id } } }).then((response) => {
                if (response.nModified == 1) {
                    let date = new Date()
                    Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                        updatedAt: date
                    }).then((_) => {
                        res.status(200).json({
                            status: true,
                            data: 'Deleted'
                        })
                    })
                } else {
                    res.status(422).json({
                        status: false,
                        data: 'no changes'
                    })
                }
            })
        } catch (error) {
            next(error)
        }
    },
    addStorePin: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (valid) {
                const obj = {
                    active: true,
                    code: req.body.code
                }
                Store.updateOne({ _id: req.params.id }, { $push: { "serviceablePincodes": obj } }).then((response) => {
                    if (response.nModified == 1) {
                        let date = new Date()
                        Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                            updatedAt: date
                        }).then((_) => {
                            res.status(200).json({
                                status: true,
                                data: 'Added'
                            })
                        })
                    } else {
                        res.status(422).json({
                            status: false,
                            data: 'no changes'
                        })
                    }
                })
            } else {
                res.status(422).json({
                    status: false,
                    data: 'Invalid Id'
                })
            }
        } catch (error) {
            next(error)
        }
    },
    activateOrDeactivatePin: async (req, res, next) => {
        try {
            let valid = await Store.findOne({ 'serviceablePincodes._id': req.params.id })
            if (valid) {
                Store.updateOne({ 'serviceablePincodes._id': req.params.id }, { $set: { "serviceablePincodes.$.active": req.body.status } }).then((response) => {
                    if (response.nModified == 1) {
                        let date = new Date()
                        Store.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {
                            updatedAt: date
                        }).then((_) => {
                            res.status(200).json({
                                status: true,
                                data: 'Updated'
                            })
                        })
                    } else {
                        res.status(422).json({
                            status: false,
                            data: 'no changes'
                        })
                    }
                })
            } else {
                res.status(422).json({
                    status: false,
                    data: 'Invalid Id'
                })
            }
        } catch (error) {
            next(error)
        }
    },
    storeStockUpdation: async (req, res, next) => {
        try {
            let validStore = await Store.findOne({ _id: req.user._id })

            if (validStore) {
                if (req.body.id) {
                    let exists = await storeProducts.findOne({ storeId: mongoose.Types.ObjectId(req.user._id) })

                    if (!exists) {
                        let data = {
                            storeId: req.user._id,
                            varientId: req.body.id,
                            stock: req.body.stock,
                            price: req.body.price,
                            specialPrice: req.body.specialPrice,
                            skuOrHsnNo: req.body.skuOrHsnNo,
                            type: req.body.type
                        }

                        if (req.body.type == 'medicine') {
                            if (!req.body.expiryDate) {
                                return res.status(422).json({
                                    status: false,
                                    message: 'Expiry date missing'
                                })
                            }
                            data.expiryDate = req.body.expiryDate
                        }

                        let schemaObj = storeProducts(data)
                        schemaObj.save().then((response) => {
                            return res.status(200).json({
                                status: false,
                                message: 'Stock updated'
                            })
                        })
                    } else {
                        let data = {
                            storeId: req.user._id,
                            varientId: req.body.id,
                            stock: req.body.stock,
                            price: req.body.price,
                            specialPrice: req.body.specialPrice,
                            skuOrHsnNo: req.body.skuOrHsnNo,
                            type: req.body.type
                        }

                        if (req.body.type == 'medicine') {
                            if (!req.body.expiryDate) {
                                return res.status(422).json({
                                    status: false,
                                    message: 'Expiry date missing'
                                })
                            }
                            data.expiryDate = req.body.expiryDate
                        }

                        storeProducts.updateOne({ storeId: mongoose.Types.ObjectId(req.user._id) }, data).then((response) => {
                            return res.status(200).json({
                                status: false,
                                message: 'Stock updated'
                            })
                        })
                    }

                } else {
                    res.status(422).json({
                        status: false,
                        data: 'Invalid Id'
                    })
                }
            } else {
                res.status(422).json({
                    status: false,
                    message: 'You are not permitted to this action'
                })
            }

        } catch (error) {
            next(error)
        }
    },
    dropdownlistStores: async (req, res, next) => {
        try {
            let allStores = await Store.find({ level: { $ne: 3 } }, {
                name: 1
            })

            res.status(200).json({
                status: false,
                message: 'success',
                data: allStores
            })

        } catch (error) {
            next(error)
        }
    }

};