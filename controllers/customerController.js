const mongoose = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const Customer = require("../models/customer/customer");
const PromotionalEmails = require("../models/customer/promotionalEmail");
const PromotionalSmsCollection = require("../models/customer/promotionalSms");
const PromotionalEmail = PromotionalEmails.PromotionalEmail;
const PromotionalEmailUsers = PromotionalEmails.PromotionalEmailUsers;

const PromotionalSms = PromotionalSmsCollection.PromotionalSms;
const PromotionalSmsUsers = PromotionalSmsCollection.PromotionalSmsUsers;

const EmailHelper = require("../helpers/emailHelper");
const SmsHelper = require("../helpers/smsHelper");


var isEmailSend = false;
module.exports = {
    /* Customer Relationship - Create  customer
    ============================================= */
    addCustomer: async (req, res, next) => {
        try {
            let data = req.body;
            let schemaObj = new Customer(data);
            schemaObj
                .save()
                .then((response) => {
                    res.status(200).json({
                        status: true,
                        data: "Customer added successfully",
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
    getCustomers: async (req, res, next) => {
        try {
            let result = await Customer.find({ isDisabled: false });
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
    updateCustomerRemarks: async (req, res, next) => {
        try {
            let data = req.body;
            console.log(req.b);
            let result = await Customer.findOne({ _id: mongoose.Types.ObjectId(data.customerId) });
            if (result) {
                data.updatedAt = new Date();
                data.isDisabled = data.remarks;
                Customer.updateOne({ _id: mongoose.Types.ObjectId(data.customerId) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Remarks Updated successfully",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Remarks not updated ",
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
                    data: "invalid customer id",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    removeCustomer: async (req, res, next) => {
        try {
            let data = {};
            let result = await Customer.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
            if (result) {
                data.updatedAt = new Date();
                data.isDisabled = true;
                Customer.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, data)
                    .then((response) => {
                        if (response.nModified == 1) {
                            res.status(200).json({
                                status: true,
                                data: "Data removed successfully",
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                data: "Data not removed ",
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
                    data: "invalid id",
                });
            }
        } catch (error) {
            next(error);
        }
    },

    /* Promotional Emails for customers
    ============================================= */
    addPromotionalEmail: async (req, res, next) => {
        try {
            let data = req.body;
            let schemaObj = new PromotionalEmail(data);
            schemaObj
                .save()
                .then(async (result) => {
                    let customerArray = await getCustomerEmail(data.segmentId);
                    let resultData = {};
                    resultData.proEmailId = result._id;
                    await customerArray.forEach((customer) => {
                        resultData.customerId = customer.customerId;
                        let schemaObj = new PromotionalEmailUsers(resultData);
                        schemaObj
                            .save()
                            .then(async (result) => {
                                let toMail = customer.email;
                                let subject = data.subject;
                                let content = data.description;
                                EmailHelper.sendEmail(toMail, subject, content).then((response) => {
                                    if (response) {
                                        isEmailSend = true;
                                    } else {
                                        isEmailSend = false;
                                    }
                                });
                            })
                            .catch(async (error) => {
                                res.status(200).json({
                                    status: false,
                                    data: error,
                                });
                            });
                    });
                    if (isEmailSend) {
                        res.status(200).json({
                            status: true,
                            data: "Promotional email send successfully",
                        });
                    } else {
                        res.status(200).json({
                            status: false,
                            data: "Promotional email not send .Please try again later",
                        });
                    }
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
    getPromotionalEmail: async (req, res, next) => {
        try {
            //  let result = await PromotionalEmail.find({ isDisabled: false });
            let result = await PromotionalEmail.aggregate([
                {
                    $match: { isDisabled: false },
                },
                {
                    $lookup: {
                        from: PromotionalEmailUsers,
                        localField: "_id",
                        foreignField: "proEmailId",
                        as: "customers",
                    },
                },
                {
                    $unwind: "$customers",
                },
            ]);

            console.log(result);
            res.status(200).json({
                status: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    /* Promotional Emails for customers
    ============================================= */
    // addPromotionalSMS: async (req, res, next) => {
    //     try {
    //         let data = req.body;
    //         let schemaObj = new PromotionalSms(data);
    //         schemaObj
    //             .save()
    //             .then(async (result) => {
    //                 let customerArray = await getCustomerPhone(data.segmentId);
    //                 let resultData = {};
    //                 resultData.proSmsId = result._id;
    //                 await customerArray.forEach((customer) => {
    //                     resultData.customerId = customer.customerId;
    //                     let schemaObj = new PromotionalSmsUsers(resultData);
    //                     schemaObj
    //                         .save()
    //                         .then(async (result) => {
    //                             let toMobile = customer.mobile;
    //                             let content = data.description;
    //                             // SmsHelper.sendSMS(toMobile,content).then((response) => {
    //                             //     if (response) {
    //                             //         result = true;
    //                             //     } else {
    //                             //         result = false;
    //                             //     }
    //                             // });
    //                             // res.status(200).json({
    //                             //     status: true,
    //                             //     data: "Promotional sms send successfully",
    //                             // });
                              
    //                         })
    //                         .catch(async (error) => {
    //                             res.status(200).json({
    //                                 status: false,
    //                                 data: error,
    //                             });
    //                         });
    //                 });
    //             })
    //             .catch(async (error) => {
    //                 res.status(200).json({
    //                     status: false,
    //                     data: error,
    //                 });
    //             });
    //     } catch (error) {
    //         next(error);
    //     }
    // },
};

async function getCustomerEmail(segmentId) {
    let customerDetails = await Customer.find({ isDisabled: false });
    let customerArray = [];
    customerDetails.forEach((customer) => {
        customerArray.push({ customerId: customer._id, email: customer.email });
    });

    return customerArray;
}

async function getCustomerPhone(segmentId) {
    let customerDetails = await Customer.find({ isDisabled: false });
    let customerArray = [];
    customerDetails.forEach((customer) => {
        customerArray.push({ customerId: customer._id, mobile: customer.mobile });
    });

    return customerArray;
}

