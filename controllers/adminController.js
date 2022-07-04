const User = require("../models/userModel");
const base = require("./baseController");
const Department = require("../models/department");
const PrivilegeGroup = require("../models/privilegeGroup");
const EmployeeTypes = require("../models/employeeTypes");
const Employee = require("../models/employee");
const ArticleCategory = require("../models/articleCategory");
const LiveUpdate = require("../models/articleLiveUpdate");
const HealthcareVideoCategory = require("../models/healthcareVideoCategory");
const HealthExpertCategory = require("../models/healthExpertCategory");
const HealthTipCategory = require("../models/healthTipCategory");
const Articles = require("../models/article");
const HealthCareVideo = require("../models/healthCareVideo");
const HealthTip = require("../models/healthTip");
const HealthExpertAdvice = require("../models/healthExpertAdvice");
const Like = require("../models/like");
const Save = require("../models/save");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const { Mongoose } = require("mongoose");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

var multer = require("multer");
const moment = require("moment");
const Share = require("../models/share");
const Read = require("../models/read");

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "../public/images");
  },
  filename: function (req, file, callback) {
    callback(null, "employee" + "_" + Date.now());
  },
});

var upload = multer({
  storage: Storage,
}); //Field name and max count

function deleteImageFromFile(splittedImageRoute) {
  if (splittedImageRoute) {
    if (fs.existsSync(`./public/images/employees/${splittedImageRoute[1]}`)) {
      fs.unlink(
        `./public/images/employees/${splittedImageRoute[1]}`,
        function (err) {
          if (err) throw err;
          console.log("old image deleted!");
        }
      );
    }
  }
}

function unlinkImage(
  photo,
  signature,
  aadhar,
  employeeIdCard,
  offerLetter,
  panCard,
  passbook,
  others
) {
  if (photo) {
    photo.map(async (e) => {
      await unlinkAsync(e.path);
    });
  }
  if (signature) {
    signature.map(async (e) => {
      await unlinkAsync(e.path);
    });
  }
  if (aadhar) {
    aadhar.map(async (e) => {
      await unlinkAsync(e.path);
    });
  }
  if (employeeIdCard) {
    employeeIdCard.map(async (e) => {
      await unlinkAsync(e.path);
    });
  }
  if (offerLetter) {
    offerLetter.map(async (e) => {
      await unlinkAsync(e.path);
    });
  }
  if (panCard) {
    panCard.map(async (e) => {
      await unlinkAsync(e.path);
    });
  }
  if (passbook) {
    passbook.map(async (e) => {
      await unlinkAsync(e.path);
    });
  }
  if (others) {
    others.map(async (e) => {
      await unlinkAsync(e.path);
    });
  }
}

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

const createToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET
  );
};

module.exports = {
  addPrivilegeGroup: async (req, res, next) => {
    try {
      let existingPrivilege = await PrivilegeGroup.findOne({
        name: req.body.name,
      });

      if (!existingPrivilege) {
        var data = req.body;

        let schemaObject = new PrivilegeGroup(data);

        schemaObject.save().then((response) => {
          console.log("response===", response);
          res.status(200).json({
            status: true,
            data: response,
          });
        });
      } else {
        res.status(200).json({
          status: false,
          data: "Existing Privilege Group",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addSubPrivilege: async (req, res, next) => {
    try {
      let existingSubPrivilege = await PrivilegeGroup.findOne({
        name: req.body.privilegeName,
        subPrivileges: { $elemMatch: { name: req.body.subPrivilege.name } },
      });
      if (!existingSubPrivilege) {
        let privilegeGroup = await PrivilegeGroup.findOne({
          name: req.body.privilegeName,
        });

        if (privilegeGroup) {
          let subPrivilege = req.body.subPrivilege;
          PrivilegeGroup.updateOne(
            { name: req.body.privilegeName },
            { $push: { subPrivileges: subPrivilege } }
          ).then((response) => {
            console.log("resss", response);
            res.status(200).json({
              status: true,
              data: "Sub privilege added successfully",
            });
          });
        } else {
          res.status(200).json({
            status: false,
            data: "Privilege group not found",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "Existing sub privilege",
        });
      }
    } catch (error) {}
  },
  viewPrivilegeGroups: async (req, res, next) => {
    try {
      let allPrivilegeGroups = await PrivilegeGroup.find({}, { name: 1 });
      res.status(200).json({
        status: true,
        data: allPrivilegeGroups,
      });
    } catch (error) {
      next(error);
    }
  },
  viewEmployeePermissions: async (req, res, next) => {
    try {
      let department = await Department.findOne({
        _id: mongoose.Types.ObjectId(req.params.departmentId),
      });
      let privilegeGroups = await PrivilegeGroup.find({
        _id: { $in: department.privilegeGroups },
      });

      var permissions = [];

      privilegeGroups.map((privilegeGroup) => {
        let subPrivileges = privilegeGroup.subPrivileges;
        console.log("sub*****", subPrivileges);

        for (i = 0; i < subPrivileges.length; i++) {
          if (!subPrivileges[i].subOfSub.length) {
            permissions.push({
              permission: subPrivileges[i].name,
              subOf: "none",
              head: privilegeGroup.name,
            });
          } else {
            for (j = 0; j < subPrivileges[i].subOfSub.length; j++) {
              permissions.push({
                permission: subPrivileges[i].subOfSub[j].name,
                subOf: subPrivileges[i].name,
                head: privilegeGroup.name,
              });
            }
          }
        }
      });

      res.status(200).json({
        status: true,
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  },
  seedEmployeeTypesForEachPrivilege: async (req, res, next) => {
    try {
      let existingType = await EmployeeTypes.findOne({ type: req.body.type });

      if (!existingType) {
        EmployeeTypes.create({
          type: req.body.type,
        }).then((response) => {
          res.status(200).json({
            status: true,
            data: "Employee type added successfully",
          });
        });
      } else {
        res.status(200).json({
          status: false,
          data: "Existing Type",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewEmployeeTypes: async (req, res, next) => {
    try {
      let allTypes = await EmployeeTypes.find();

      res.status(200).json({
        status: true,
        data: allTypes,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteEmployeeType: async (req, res, next) => {
    try {
      let type = await EmployeeTypes.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      if (type) {
        EmployeeTypes.deleteOne({
          _id: mongoose.Types.ObjectId(req.params.id),
        }).then((response) => {
          res.status(200).json({
            status: true,
            message: "type removed successfully",
          });
        });
      } else {
        res.status(200).json({
          status: false,
          message: "invalid type id",
        });
      }

      res.status(200).json({
        status: true,
        data: allTypes,
      });
    } catch (error) {
      next(error);
    }
  },
  addDepartment: async (req, res, next) => {
    try {
      let existingName = await Department.findOne({ name: req.body.name });

      if (!existingName) {
        Department.create({
          name: req.body.name,
          privilegeGroups: req.body.privilegeGroups,
        }).then((response) => {
          res.status(200).json({
            status: true,
            data: response,
          });
        });
      } else {
        res.status(200).json({
          status: false,
          data: "A department is already exists with this name",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewDepartments: async (req, res, next) => {
    try {
      let allDepartments = await Department.find({}, { __v: 0 });
      res.status(200).json({
        status: true,
        data: allDepartments,
      });
    } catch (error) {
      next(error);
    }
  },
  viewDepartment: async (req, res, next) => {
    try {
      let allPrivilegeGroups = await PrivilegeGroup.find({}, { name: 1 });

      let department = await Department.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      }).populate({ path: "privilegeGroups", select: ["_id", "name"] });

      department = department.toJSON();
      department.all_privilege_groups = allPrivilegeGroups;
      department.active_privilege_groups = department.privilegeGroups;

      delete department.privilegeGroups;

      console.log("dpartment::", department);

      res.status(200).json({
        status: true,
        data: department,
      });
    } catch (error) {
      next(error);
    }
  },
  editDepartment: async (req, res, next) => {
    try {
      let data = req.body;

      let newIds = data.privilegeGroups;

      let department = await Department.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      let oldIds = department.privilegeGroups;
      let employees = await Employee.find({ department: req.params.id }).lean();

      // comparing each old ids in new ids
      oldIds.map(async (e, i) => {
        if (!newIds.includes(e)) {
          console.log("id=====:", e);
          let group = await PrivilegeGroup.findOne({
            _id: mongoose.Types.ObjectId(e),
          });
          console.log("found gorup::::", group);
          // removing permissions of removed privilege group from employees
          for (const item of employees) {
            await Employee.updateOne(
              { _id: item._id },
              { $set: { permissions: [] } }
            );
            let afterArrayEmpty = await Employee.findOne({ _id: item._id });
            console.log("after empty:", afterArrayEmpty.permissions);

            for (const permission of item.permissions) {
              if (permission.head != group.name) {
                console.log("new permissio:", permission);
                await Employee.updateOne(
                  { _id: item._id },
                  { $push: { permissions: permission } }
                );
              }
            }
          }

          // for(i=0; i<employees.length; i++) {
          //   for(j=0; j<employees[i].permissions.length; j++) {
          //     if(employees[i].permissions[j].head == e.name) {
          //       console.log('')
          //       employees[i].permissions.splice(j, 1);
          //       await Employee.updateOne({_id:mongoose.Types.ObjectId(employees[i]._id)},employees[i])
          //     }
          //   }
          // }
        }
      });

      // comparing each new ids in old ids
      newIds.map(async (e, i) => {
        if (!oldIds.includes(e)) {
          // finding and pushing permissions of newly added privilege group
          let group = await PrivilegeGroup.find({
            _id: mongoose.Types.ObjectId(e),
          });

          let subPrivileges = group.subPrivileges;

          for (i = 0; i < subPrivileges.length; i++) {
            if (!subPrivileges[i].subOfSub.length) {
              employees.map(async (e, i) => {
                e.permissions.push({
                  name: subPrivileges[i].name,
                  subOf: "none",
                  head: privilegeGroup.name,
                  view: true,
                  edit: false,
                  all: false,
                });

                await Employee.updateOne(
                  { _id: mongoose.Types.ObjectId(e._id) },
                  e
                );
              });
            } else {
              for (j = 0; j < subPrivileges[i].subOfSub.length; j++) {
                employees.map(async (e, i) => {
                  e.permissions.push({
                    name: subPrivileges[i].subOfSub[j].name,
                    subOf: subPrivileges[i].name,
                    head: privilegeGroup.name,
                    view: true,
                    edit: false,
                    all: false,
                  });

                  await Employee.updateOne(
                    { _id: mongoose.Types.ObjectId(e._id) },
                    e
                  );
                });
              }
            }
          }
        }
      });

      Department.updateOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        data
      ).then((response) => {
        res.status(200).json({
          status: true,
          data: "updated successfully",
        });
      });
    } catch (error) {
      next(error);
    }
  },
  deleteDepartment: async (req, res, next) => {
    try {
      let valid = await Department.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (valid) {
        Department.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
          .then((response) => {
            res.status(200).json({
              status: true,
              message: "department removed",
            });
          })
          .catch((error) => {
            res.status(200).json({
              status: false,
              message: error + "",
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
  addEmployee: async (req, res, next) => {
    try {
      let existingEmployee = await Employee.findOne({
        $or: [
          { employeeId: req.body.employeeId },
          { workEmail: req.body.workEmail },
        ],
      });

      if (!existingEmployee) {
        let details = req.body;

        console.log("details:", details);

        details.notes.map((e, i) => {
          let d = new Date();
          let utc = d.getTime() + d.getTimezoneOffset() * 60000;
          let nd = new Date(utc + 3600000 * +5.5);
          var ist = nd.toLocaleString();
          // let testmoment = moment(ist).format('DD MMM YYYY, h:mm a');

          // let now = new Date()
          e.note.date = moment(ist).format("DD MMM YYYY, h:mm a");
          e.note.noted_by = req.user._id;
        });

        if (details.photo == "null") {
          delete details.photo;
        }

        if (details.signature == "null") {
          delete details.signature;
        }

        if (details.aadhar == "null") {
          delete details.aadhar;
        }

        if (details.employeeIdCard == "null") {
          delete details.employeeIdCard;
        }

        if (details.offerLetter == "null") {
          delete details.offerLetter;
        }

        if (details.panCard == "null") {
          delete details.panCard;
        }

        if (details.passbook == "null") {
          delete details.passbook;
        }

        if (details.others == "null") {
          delete details.others;
        }

        if (req.files.photo) {
          details.photo = `employee/${req.files.photo[0].filename}`;
        }

        if (req.files.signature) {
          details.signature = `employee/${req.files.signature[0].filename}`;
        }

        if (req.files.aadhar) {
          details.personal.aadhar = `employee/${req.files.aadhar[0].filename}`;
        }

        if (req.files.employeeIdCard) {
          details.personal.employeeIdCard = `employee/${req.files.employeeIdCard[0].filename}`;
        }

        if (req.files.offerLetter) {
          details.personal.offerLetter = `employee/${req.files.offerLetter[0].filename}`;
        }

        if (req.files.panCard) {
          details.personal.panCard = `employee/${req.files.panCard[0].filename}`;
        }

        if (req.files.passbook) {
          details.personal.passbook = `employee/${req.files.passbook[0].filename}`;
        }

        if (req.files.others) {
          details.personal.others = `employee/${req.files.others[0].filename}`;
        }

        // upload(req, res, function(err) {
        //   if (err) {
        //       console.log("Image upload failed!");
        //   }
        //   console.log("File uploaded sucessfully!.");
        // });

        console.log("details::", details);

        let schemaObj = new Employee(details);

        schemaObj
          .save()
          .then((response) => {
            console.log("res----", response);
            res.status(200).json({
              status: true,
              data: response,
            });
          })
          .catch(async (error) => {
            if (req.files.aadhar) {
              await unlinkAsync(req.files.aadhar[0].path);
            }

            if (req.files.signature) {
              await unlinkAsync(req.files.signature[0].path);
            }

            if (req.files.photo) {
              await unlinkAsync(req.files.photo[0].path);
            }

            if (req.files.employeeIdCard) {
              await unlinkAsync(req.files.employeeIdCard[0].path);
            }

            if (req.files.offerLetter) {
              await unlinkAsync(req.files.offerLetter[0].path);
            }

            if (req.files.panCard) {
              await unlinkAsync(req.files.panCard[0].path);
            }

            if (req.files.passbook) {
              await unlinkAsync(req.files.passbook[0].path);
            }

            if (req.files.others) {
              await unlinkAsync(req.files.others[0].path);
            }

            res.status(200).json({
              status: false,
              data: error,
            });
          });
      } else {
        if (req.files.aadhar) {
          await unlinkAsync(req.files.aadhar[0].path);
        }

        if (req.files.photo) {
          await unlinkAsync(req.files.photo[0].path);
        }

        if (req.files.signature) {
          await unlinkAsync(req.files.signature[0].path);
        }

        if (req.files.employeeIdCard) {
          await unlinkAsync(req.files.employeeIdCard[0].path);
        }

        if (req.files.offerLetter) {
          await unlinkAsync(req.files.offerLetter[0].path);
        }

        if (req.files.panCard) {
          await unlinkAsync(req.files.panCard[0].path);
        }

        if (req.files.passbook) {
          await unlinkAsync(req.files.passbook[0].path);
        }

        if (req.files.others) {
          await unlinkAsync(req.files.others[0].path);
        }

        res.status(200).json({
          status: false,
          data: {
            errors: {
              workEmail: {
                name: "ValidatorError",
                message: "Existing email or employee id",
                properties: {
                  message: "Existing email or employee id",
                  type: "required",
                  path: "workEmail",
                },
                kind: "required",
                path: "workEmail",
              },
            },
            _message: "Work email or employee id failed",
            name: "ValidationError",
            message:
              "Employee validation failed: Existing work email or employee id",
          },
        });
      }
    } catch (error) {
      if (req.files.aadhar) {
        await unlinkAsync(req.files.aadhar[0].path);
      }

      if (req.files.photo) {
        await unlinkAsync(req.files.photo[0].path);
      }

      if (req.files.signature) {
        await unlinkAsync(req.files.signature[0].path);
      }

      if (req.files.employeeIdCard) {
        await unlinkAsync(req.files.employeeIdCard[0].path);
      }

      if (req.files.offerLetter) {
        await unlinkAsync(req.files.offerLetter[0].path);
      }

      if (req.files.panCard) {
        await unlinkAsync(req.files.panCard[0].path);
      }

      if (req.files.passbook) {
        await unlinkAsync(req.files.passbook[0].path);
      }

      if (req.files.others) {
        await unlinkAsync(req.files.others[0].path);
      }

      next(error);
    }
  },
  editEmployDetails: async (req, res, next) => {
    try {
      let data = req.body;

      console.log("body:", req.body);
      console.log("files:", req.files);

      let employ = await Employee.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      }).lean();

      if (employ) {
        let findoneEmployee = await Employee.findOne({
          $or: [
            { employeeId: req.body.employeeId },
            { workEmail: req.body.workEmail },
          ],
        });

        let existingEmployee = false;

        if (findoneEmployee) {
          if (findoneEmployee._id + "" != employ._id + "") {
            existingEmployee = true;
          }
        }

        if (!existingEmployee) {
          if (data.photo == "null") {
            delete data.photo;
          }

          if (data.signature == "null") {
            delete data.signature;
          }

          if (data.aadhar == "null") {
            delete data.aadhar;
            data.personal.aadhar = employ.personal.aadhar;
          }

          if (data.employeeIdCard == "null") {
            delete data.employeeIdCard;
            data.personal.employeeIdCard = employ.personal.employeeIdCard;
          }

          if (data.offerLetter == "null") {
            delete data.offerLetter;
            data.personal.offerLetter = employ.personal.offerLetter;
          }

          if (data.panCard == "null") {
            delete data.panCard;
            data.personal.panCard = employ.personal.panCard;
          }

          if (data.passbook == "null") {
            delete data.passbook;
            data.personal.passbook = employ.personal.passbook;
          }

          if (data.others == "null") {
            delete data.others;
            data.personal.others = employ.personal.others;
          }

          if (data.photo == "deleted") {
            // deleting old image
            let splittedImageRoute = employ.photo.split("/");

            if (
              fs.existsSync(
                `./public/images/employees/${splittedImageRoute[1]}`
              )
            ) {
              fs.unlink(
                `./public/images/employees/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                  console.log("old image deleted!");
                  data.photo = null;
                }
              );
            }
          }

          if (data.signature == "deleted") {
            // deleting old image
            let splittedImageRoute = employ.signature.split("/");

            if (
              fs.existsSync(
                `./public/images/employees/${splittedImageRoute[1]}`
              )
            ) {
              fs.unlink(
                `./public/images/employees/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                  console.log("old image deleted!");
                  data.signature = null;
                }
              );
            }
          }

          if (data.aadhar == "deleted") {
            // deleting old image
            let splittedImageRoute = employ.personal.aadhar.split("/");

            if (
              fs.existsSync(
                `./public/images/employees/${splittedImageRoute[1]}`
              )
            ) {
              fs.unlink(
                `./public/images/employees/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                  console.log("old image deleted!");
                  data.personal.aadhar = null;
                }
              );
            }
          }

          if (data.employeeIdCard == "deleted") {
            // deleting old image
            let splittedImageRoute = employ.personal.employeeIdCard.split("/");

            if (
              fs.existsSync(
                `./public/images/employees/${splittedImageRoute[1]}`
              )
            ) {
              fs.unlink(
                `./public/images/employees/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                  console.log("old image deleted!");
                  data.personal.employeeIdCard = null;
                }
              );
            }
          }

          if (data.offerLetter == "deleted") {
            // deleting old image
            let splittedImageRoute = employ.personal.offerLetter.split("/");

            if (
              fs.existsSync(
                `./public/images/employees/${splittedImageRoute[1]}`
              )
            ) {
              fs.unlink(
                `./public/images/employees/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                  console.log("old image deleted!");
                  data.personal.offerLetter = null;
                }
              );
            }
          }

          if (data.panCard == "deleted") {
            // deleting old image
            let splittedImageRoute = employ.personal.panCard.split("/");

            if (
              fs.existsSync(
                `./public/images/employees/${splittedImageRoute[1]}`
              )
            ) {
              fs.unlink(
                `./public/images/employees/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                  console.log("old image deleted!");
                  data.personal.panCard = null;
                }
              );
            }
          }

          if (data.passbook == "deleted") {
            // deleting old image
            let splittedImageRoute = employ.personal.passbook.split("/");

            if (
              fs.existsSync(
                `./public/images/employees/${splittedImageRoute[1]}`
              )
            ) {
              fs.unlink(
                `./public/images/employees/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                  console.log("old image deleted!");
                  data.personal.passbook = null;
                }
              );
            }
          }

          if (data.others == "deleted") {
            // deleting old image
            let splittedImageRoute = employ.personal.others.split("/");

            if (
              fs.existsSync(
                `./public/images/employees/${splittedImageRoute[1]}`
              )
            ) {
              fs.unlink(
                `./public/images/employees/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                  console.log("old image deleted!");
                  data.personal.others = null;
                }
              );
            }
          }

          if (req.files.photo) {
            var fileInfoImage = {};
            fileInfoImage = req.files.photo[0];
            data.photo = `employee/${fileInfoImage.filename}`;

            // deleting old image
            if (employ.photo) {
              let splittedImageRoute = employ.photo.split("/");
              deleteImageFromFile(splittedImageRoute);
            }
          }
          if (req.files.signature) {
            var fileInfoImage = {};
            fileInfoImage = req.files.signature[0];
            data.signature = `employee/${fileInfoImage.filename}`;

            if (employ.signature) {
              let splittedImageRoute = employ.signature.split("/");
              deleteImageFromFile(splittedImageRoute);
            }
          }
          if (req.files.aadhar) {
            var fileInfoImage = {};
            fileInfoImage = req.files.aadhar[0];
            data.personal.aadhar = `employee/${fileInfoImage.filename}`;

            if (employ.personal.aadhar) {
              let splittedImageRoute = employ.personal.aadhar.split("/");
              deleteImageFromFile(splittedImageRoute);
            }
          }
          if (req.files.employeeIdCard) {
            var fileInfoImage = {};
            fileInfoImage = req.files.employeeIdCard[0];
            data.personal.employeeIdCard = `employee/${fileInfoImage.filename}`;

            if (employ.personal.employeeIdCard) {
              let splittedImageRoute =
                employ.personal.employeeIdCard.split("/");
              deleteImageFromFile(splittedImageRoute);
            }
          }
          if (req.files.offerLetter) {
            var fileInfoImage = {};
            fileInfoImage = req.files.offerLetter[0];
            data.personal.offerLetter = `employee/${fileInfoImage.filename}`;

            if (employ.personal.offerLetter) {
              let splittedImageRoute = employ.personal.offerLetter.split("/");
              deleteImageFromFile(splittedImageRoute);
            }
          }
          if (req.files.panCard) {
            var fileInfoImage = {};
            fileInfoImage = req.files.panCard[0];
            data.personal.panCard = `employee/${fileInfoImage.filename}`;

            if (employ.personal.panCard) {
              let splittedImageRoute = employ.personal.panCard.split("/");
              deleteImageFromFile(splittedImageRoute);
            }
          }
          if (req.files.passbook) {
            var fileInfoImage = {};
            fileInfoImage = req.files.passbook[0];
            data.personal.passbook = `employee/${fileInfoImage.filename}`;

            if (employ.personal.passbook) {
              let splittedImageRoute = employ.personal.passbook.split("/");
              deleteImageFromFile(splittedImageRoute);
            }
          }
          if (req.files.others) {
            var fileInfoImage = {};
            fileInfoImage = req.files.others[0];
            data.personal.others = `employee/${fileInfoImage.filename}`;

            if (employ.personal.others) {
              let splittedImageRoute = employ.personal.others.split("/");
              deleteImageFromFile(splittedImageRoute);
            }
          }

          if (data.password) {
            data.password = await bcrypt.hash(data.password, 12);
          } else {
            delete data.password;
          }

          data.notes.map((e, i) => {
            if (e.note.content != "") {
              let d = new Date();
              let utc = d.getTime() + d.getTimezoneOffset() * 60000;
              let nd = new Date(utc + 3600000 * +5.5);
              var ist = nd.toLocaleString();
              // let testmoment = moment(ist).format('DD MMM YYYY, h:mm a');

              // let now = new Date()
              e.note.date = moment(ist).format("DD MMM YYYY, h:mm a");
              e.note.noted_by = req.user._id;
              employ.notes.push(e);
              data.notes = employ.notes;
            } else {
              delete data.notes;
            }
          });

          Employee.updateOne(
            { _id: mongoose.Types.ObjectId(req.params.id) },
            data
          )
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "Updated",
              });
            })
            .catch((error) => {
              unlinkImage(
                req.files.photo,
                req.files.signature,
                req.files.aadhar,
                req.files.employeeIdCard,
                req.files.offerLetter,
                req.files.panCard,
                req.files.passbook,
                req.files.others
              );

              res.status(200).json({
                status: false,
                data: error,
              });
            });
        } else {
          res.status(200).json({
            status: false,
            data: {
              errors: {
                workEmail: {
                  name: "ValidatorError",
                  message: "Existing email or employee id",
                  properties: {
                    message: "Existing email or employee id",
                    type: "required",
                    path: "workEmail",
                  },
                  kind: "required",
                  path: "workEmail",
                },
              },
              _message: "Work email or employee id failed",
              name: "ValidationError",
              message:
                "Employee validation failed: Existing work email or employee id",
            },
          });
        }
      } else {
        unlinkImage(
          req.files.photo,
          req.files.signature,
          req.files.aadhar,
          req.files.employeeIdCard,
          req.files.offerLetter,
          req.files.panCard,
          req.files.passbook,
          req.files.others
        );

        // success code here

        res.status(200).json({
          status: false,
          data: "invalid employeeId",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteEmployById: async (req, res, next) => {
    try {
      let employ = await Employee.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      if (employ) {
        Employee.deleteOne({ _id: req.params.id })
          .then((response) => {
            res.status(200).json({
              status: true,
              data: "employ deleted",
            });
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
          data: "invalid employId",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  viewAllEmployees: async (req, res, next) => {
    try {
      let allEmployees = await Employee.find(
        {},
        {
          firstname: 1,
          lastname: 1,
          employeeId: 1,
          designation: 1,
          contactNumber: 1,
          workEmail: 1,
        }
      );
      res.status(200).json({
        status: true,
        data: allEmployees,
      });
    } catch (error) {
      next(error);
    }
  },
  viewEmployeesInDepartment: async (req, res, next) => {
    try {
      let allEmployees = await Employee.find(
        { department: req.params.id },
        {
          firstname: 1,
          lastname: 1,
          employeeId: 1,
          designation: 1,
          contactNumber: 1,
          workEmail: 1,
          photo: 1,
        }
      );

      allEmployees.map((e, i) => {
        if (e.photo) {
          e.photo = process.env.BASE_URL.concat(e.photo);
        } else {
          e.photo = null;
        }
      });

      res.status(200).json({
        status: true,
        data: allEmployees,
      });
    } catch (error) {
      next(error);
    }
  },
  viewEmployeeDetails: async (req, res, next) => {
    try {
      console.log("haoii");
      let employeeDetails = await Employee.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      }).lean();

      employeeDetails.password = null;
      employeeDetails.dobTimeStamp = employeeDetails.dob;
      employeeDetails.dob = moment(employeeDetails.dob).format("YYYY-MM-DD");

      for (i = 0; i < employeeDetails.notes.length; i++) {
        if (employeeDetails.notes[i].note.noted_by) {
          let employee = await Employee.findOne({
            _id: mongoose.Types.ObjectId(
              employeeDetails.notes[i].note.noted_by
            ),
          });
          // employeeDetails.notes[i] = employeeDetails.notes[i].toJSON()
          employeeDetails.notes[i].note.noted_by =
            employee.firstname + " " + employee.lastname;
          console.log("chnages:", employeeDetails.notes[i]);
        }
      }

      if (employeeDetails.photo) {
        employeeDetails.photo = process.env.BASE_URL.concat(
          employeeDetails.photo
        );
      } else {
        employeeDetails.photo = null;
      }

      if (employeeDetails.signature) {
        employeeDetails.signature = process.env.BASE_URL.concat(
          employeeDetails.signature
        );
      } else {
        employeeDetails.signature = null;
      }

      if (employeeDetails.personal.aadhar) {
        employeeDetails.personal.aadhar = process.env.BASE_URL.concat(
          employeeDetails.personal.aadhar
        );
      } else {
        employeeDetails.personal.aadhar = null;
      }

      if (employeeDetails.personal.employeeIdCard) {
        employeeDetails.personal.employeeIdCard = process.env.BASE_URL.concat(
          employeeDetails.personal.employeeIdCard
        );
      } else {
        employeeDetails.personal.employeeIdCard = null;
      }

      if (employeeDetails.personal.offerLetter) {
        employeeDetails.personal.offerLetter = process.env.BASE_URL.concat(
          employeeDetails.personal.offerLetter
        );
      } else {
        employeeDetails.personal.offerLetter = null;
      }

      if (employeeDetails.personal.panCard) {
        employeeDetails.personal.panCard = process.env.BASE_URL.concat(
          employeeDetails.personal.panCard
        );
      } else {
        employeeDetails.personal.panCard = null;
      }

      if (employeeDetails.personal.passbook) {
        employeeDetails.personal.passbook = process.env.BASE_URL.concat(
          employeeDetails.personal.passbook
        );
      } else {
        employeeDetails.personal.passbook = null;
      }

      if (employeeDetails.personal.others) {
        employeeDetails.personal.others = process.env.BASE_URL.concat(
          employeeDetails.personal.others
        );
      } else {
        employeeDetails.personal.others = null;
      }

      if (employeeDetails) {
        res.status(200).json({
          status: true,
          data: employeeDetails,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "Employee not found",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  employeePermissions: async (req, res, next) => {
    try {
      let employee = await Employee.findOne({ _id: req.user._id });
      console.log("employee::", employee.permissions);

      res.status(200).json({
        status: true,
        message: "success",
        data: { permissions: employee.permissions },
      });
    } catch (error) {
      next(error);
    }
  },
  permissionChecking: async (req, res, next) => {
    try {
      let employeeId = req.body.employeeId;

      let selectedMenu = req.body.selected;

      console.log("emp", employeeId, "selected", selectedMenu);

      let permissions = await Employee.findOne(
        {
          _id: mongoose.Types.ObjectId(employeeId),
          permissions: { $elemMatch: { head: selectedMenu } },
        },
        { permissions: 1 }
      );

      console.log("permission*****====", permissions);

      res.status(200).json({
        status: true,
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  },
  employeeSearch: async (req, res, next) => {
    try {
      req.body.keyword.toLowerCase();
      let keyword = req.body.keyword;
      let departmentId = req.body.departmentId;

      if (keyword) {
        let searchResult = await Employee.find(
          {
            $and: [
              {
                $or: [
                  {
                    $expr: {
                      $regexMatch: {
                        input: {
                          $concat: ["$firstname", " ", "$lastname"],
                        },
                        regex: keyword,
                        options: "i",
                      },
                    },
                  },
                  {
                    $expr: {
                      $regexMatch: {
                        input: {
                          $concat: ["$firstname", "$lastname"],
                        },
                        regex: keyword,
                        options: "i",
                      },
                    },
                  },
                  {
                    employeeId: { $regex: `^${keyword}`, $options: "i" },
                  },
                ],
              },
              { department: departmentId },
            ],
          },
          {
            _id: 1,
            firstname: 1,
            lastname: 1,
            employeeId: 1,
            designation: 1,
            contactNumber: 1,
            workEmail: 1,
            photo: 1,
          }
        );

        searchResult.map((e, i) => {
          e.photo = process.env.BASE_URL.concat(e.photo);
        });

        res.status(200).json({
          success: true,
          result: searchResult,
        });
      } else {
        res.status(200).json({
          status: false,
          data: "Please enter the keyword",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addArticleCategory: async (req, res, next) => {
    try {
      let data = req.body;
      console.log("ddd", data);
      data.image = `medfeed/${req.file.filename}`;
      let existingCategory = await ArticleCategory.findOne({ name: data.name });
      if (!existingCategory) {
        if (req.file) {
          data.image = `medfeed/${req.file.filename}`;

          let schemaObj = new ArticleCategory(data);
          schemaObj
            .save()
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "Category added successfully",
              });
            })
            .catch(async (error) => {
              await unlinkAsync(req.file.path);
              res.status(200).json({
                status: false,
                data: error,
              });
            });
        } else {
          res.status(200).json({
            status: false,
            data: "Please upload image",
          });
        }
      } else {
        if (req.file) {
          await unlinkAsync(req.file.path);
        }
        res.status(200).json({
          status: false,
          data: "Existing category",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getAllArticleCategories: async (req, res, next) => {
    try {
      let result = await ArticleCategory.find().lean();

      for (category of result) {
        if (category.parent != "main") {
          let maincategory = await ArticleCategory.findOne({
            _id: mongoose.Types.ObjectId(category.parent),
          });
          category.parent = maincategory.name;
        }
        category.image = process.env.BASE_URL.concat(category.image);
      }

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  getHomePageArticleCategories: async (req, res, next) => {
    try {
      let result = await ArticleCategory.find({ homepage: true });

      for (category of result) {
        if (category.parent != "main") {
          let maincategory = await ArticleCategory.findOne({
            _id: mongoose.Types.ObjectId(category.parent),
          });
          category.parent = maincategory.name;
        }

        category.image = process.env.BASE_URL.concat(category.image);
      }

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  viewMainArticleCategories: async (req, res, next) => {
    try {
      let result = await ArticleCategory.find(
        { parent: "main" },
        {
          name: 1,
        }
      );

      res.status(200).json({
        status: true,
        message: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  viewMainArticleCategoriesAndArticles: async (req, res, next) => {
    try {
      let categories = await ArticleCategory.find(
        { parent: "main" },
        {
          _id: 1,
          name: 1,
          image: 1,
        }
      );

      categories.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
      });

      let splittedCategories = chunkArray(categories, 6);

      // ********** Trending Articles ***********
      let trendingArticles = await Articles.aggregate([
        { $match: { trending: true } },
        {
          $project: {
            title: "$heading",
            readTime: 1,
            image: 1,
            authorName: 1,
            description: 1,
            createdAt: 1,
            type: "article",
            categories: 1,
          },
        },
      ]);

      // finding like count and save
      for (j = 0; j < trendingArticles.length; j++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(trendingArticles[j]._id),
        });
        console.log("trn aritlcces::", trendingArticles[j]);
        // trendingArticles[j] = trendingArticles[j].toJSON();
        trendingArticles[j].like_count = count;

        trendingArticles[j].views_count = await Read.countDocuments({
            contentId: mongoose.Types.ObjectId(trendingArticles[j]._id),
          });

        let isSaved = await Save.findOne({
          type: "article",
          contentId: mongoose.Types.ObjectId(trendingArticles[j]._id),
          userId: req.user._id,
        });

        if (isSaved) {
          trendingArticles[j].is_saved = 1;
        } else {
          trendingArticles[j].is_saved = 0;
        }

        // is liked
        let isLiked = await Like.findOne({
          type: "article",
          contentId: mongoose.Types.ObjectId(trendingArticles[j]._id),
          userId: req.user._id,
        });

        if (isLiked) {
          trendingArticles[j].is_liked = 1;
        } else {
          trendingArticles[j].is_liked = 0;
        }

        trendingArticles[j].image = process.env.BASE_URL.concat(
          trendingArticles[j].image
        );

        let since = timeSince(trendingArticles[j].createdAt);

        trendingArticles[j].createdAt = since;

        let categoryDetails = await ArticleCategory.findOne({
          _id: mongoose.Types.ObjectId(trendingArticles[j].categories[0]),
        });
        if (categoryDetails) {
          trendingArticles[j].sub_category = categoryDetails.name;
        } else {
          trendingArticles[j].sub_category = "";
        }
        delete trendingArticles[j].categories;
      }

      // ********** Newest Articles ***********
      let newestArticles = await Articles.aggregate([
        { $match: { newest: true } },
        {
          $project: {
            title: "$heading",
            readTime: 1,
            image: 1,
            authorName: 1,
            description: 1,
            createdAt: 1,
            type: "article",
            categories: 1,
          },
        },
      ]);

      // finding like count and save
      for (j = 0; j < newestArticles.length; j++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(newestArticles[j]._id),
        });
        // newestArticles[j] = newestArticles[j].toJSON();
        newestArticles[j].like_count = count;

        newestArticles[j].views_count = await Read.countDocuments({
            contentId: mongoose.Types.ObjectId(newestArticles[j]._id),
        });

        let isSaved = await Save.findOne({
          type: "article",
          contentId: mongoose.Types.ObjectId(newestArticles[j]._id),
          userId: req.user._id,
        });

        if (isSaved) {
          newestArticles[j].is_saved = 1;
        } else {
          newestArticles[j].is_saved = 0;
        }

        // is liked
        let isLiked = await Like.findOne({
          type: "article",
          contentId: mongoose.Types.ObjectId(newestArticles[j]._id),
          userId: req.user._id,
        });

        if (isLiked) {
          newestArticles[j].is_liked = 1;
        } else {
          newestArticles[j].is_liked = 0;
        }

        newestArticles[j].image = process.env.BASE_URL.concat(
          newestArticles[j].image
        );

        let since = timeSince(newestArticles[j].createdAt);

        newestArticles[j].createdAt = since;

        let categoryDetails = await ArticleCategory.findOne({
          _id: mongoose.Types.ObjectId(newestArticles[j].categories[0]),
        });
        if (categoryDetails) {
          newestArticles[j].sub_category = categoryDetails.name;
        } else {
          newestArticles[j].sub_category = "";
        }
        delete newestArticles[j].categories;
      }

      let response = {};
      response.category = splittedCategories;
      response.trendingArticles = trendingArticles;
      response.newestArticles = newestArticles;

      res.status(200).json({
        message: "success",
        error: false,
        data: response,
      });
    } catch (error) {
      next(error);
    }
  },
  viewArticleCategory: async (req, res, next) => {
    try {
      let category = await ArticleCategory.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      ).lean();
      category.image = process.env.BASE_URL.concat(category.image);
      if (category.parent != "main") {
        let maincategory = await ArticleCategory.findOne({
          _id: mongoose.Types.ObjectId(category.parent),
        });
        category.parent = {
          _id: category.parent,
          name: maincategory.name,
        };
      } else {
        category.parent = {
          _id: null,
          name: "main",
        };
      }

      res.status(200).json({
        status: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },
  editArticleCategory: async (req, res, next) => {
    try {
      let data = req.body;
      console.log("dataqqqqq", data);
      if (data.categoryId) {
        let category = await ArticleCategory.findOne({
          _id: mongoose.Types.ObjectId(data.categoryId),
        });

        if (category) {
          if (data.image == "null") {
            delete data.image;
          }

          if (req.file) {
            data.image = `medfeed/${req.file.filename}`;
            console.log("data", data);
            // deleting old image
            let splittedImageRoute = category.image.split("/");
            console.log("splitted::", splittedImageRoute);

            fs.unlink(
              `./public/images/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;
                console.log("old image deleted!");
              }
            );
          }
          ArticleCategory.updateOne(
            { _id: mongoose.Types.ObjectId(data.categoryId) },
            data
          ).then((response) => {
            console.log("res::", response);
            if (response.nModified == 1) {
              res.status(200).json({
                status: true,
                data: "Updated",
              });
            } else {
              res.status(200).json({
                status: false,
                data: "Not updated",
              });
            }
          });
        } else {
          res.status(200).json({
            status: false,
            data: "invalid categoryId",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "please enter categoryId",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteArticleCategory: async (req, res, next) => {
    try {
      let category = await ArticleCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      if (category) {
        let parentCategory = await ArticleCategory.findOne({
          parent: req.params.id,
        });

        if (!parentCategory) {
          let articleExistUnderThisCategory = await Articles.findOne({
            categories: req.params.id,
          });

          if (!articleExistUnderThisCategory) {
            let splittedImageRoute = category.image.split("/");
            if (fs.existsSync(`./public/images/${splittedImageRoute[1]}`)) {
              fs.unlink(
                `./public/images/${splittedImageRoute[1]}`,
                function (err) {
                  if (err) throw err;
                }
              );
            } else {
              console.log("category image not found");
            }
            ArticleCategory.deleteOne({
              _id: mongoose.Types.ObjectId(req.params.id),
            }).then((response) => {
              console.log("del resp", response);
              return res.status(200).json({
                status: true,
                message: "Category removed",
              });
            });
          } else {
            return res.status(200).json({
              status: false,
              message:
                "Cannot delete this category: there are some articles under this category",
            });
          }
        } else {
          return res.status(200).json({
            status: false,
            message: "Sorry, cannot be delete a parent category",
          });
        }
      } else {
        return res.status(200).json({
          status: false,
          message: "invalid category id",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addLiveUpdate: async (req, res, next) => {
    try {
      let exists = await LiveUpdate.find();
      let data = req.body;

      if (exists.length) {
        if (data.category) {
          let category = await ArticleCategory.findOne({
            _id: mongoose.Types.ObjectId(data.category),
            parent: "main",
          });

          if (!category) {
            if (req.file) {
              await unlinkAsync(req.file.path);
            }

            return res.status(200).json({
              status: false,
              data: "Invalid category Id",
            });
          }
        }

        if (data.image == "null") {
          delete data.image;
        }

        if (req.file) {
          data.image = `medfeed/${req.file.filename}`;
          // deleting old image
          let splittedImageRoute = exists[0].image.split("/");
          console.log("splitted::", splittedImageRoute);

          fs.unlink(`./public/images/${splittedImageRoute[1]}`, function (err) {
            if (err) throw err;
          });
        }

        LiveUpdate.updateOne(
          { _id: mongoose.Types.ObjectId(exists[0]._id) },
          data
        ).then((response) => {
          console.log(response);
          if (response.nModified == 1) {
            let now = new Date();
            LiveUpdate.updateOne(
              { _id: mongoose.Types.ObjectId(exists[0]._id) },
              {
                $set: {
                  updatedAt: now,
                },
              }
            ).then((response) => {
              res.status(200).json({
                status: true,
                data: "Updated successfully",
              });
            });
          } else {
            res.status(200).json({
              status: true,
              data: "no changes",
            });
          }
        });
      } else {
        if (data.category) {
          let category = await ArticleCategory.findOne({
            _id: mongoose.Types.ObjectId(data.category),
            parent: "main",
          });

          if (category) {
            let data = req.body;
            if (req.file) {
              data.image = `medfeed/${req.file.filename}`;

              let schemaObj = new LiveUpdate(data);
              schemaObj
                .save()
                .then((response) => {
                  res.status(200).json({
                    status: true,
                    data: "Live update added",
                  });
                })
                .catch(async (error) => {
                  await unlinkAsync(req.file.path);
                  res.status(200).json({
                    status: false,
                    data: error,
                  });
                });
            } else {
              res.status(200).json({
                status: false,
                message: "Please add a image",
              });
            }
          } else {
            if (req.file) {
              await unlinkAsync(req.file.path);
            }

            res.status(200).json({
              status: false,
              data: "invalid category id",
            });
          }
        } else {
          if (req.file) {
            await unlinkAsync(req.file.path);
          }

          res.status(200).json({
            status: false,
            message: "Please choose a category",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  getLiveUpdate: async (req, res, next) => {
    try {
      let liveUpdate = await LiveUpdate.find(
        {},
        {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      )
        .populate({ path: "category", select: ["_id", "name"] })
        .lean();

      liveUpdate.map((e, i) => {
        e.image = process.env.BASE_URL.concat(e.image);
      });

      res.status(200).json({
        status: true,
        data: {
          liveUpdate: liveUpdate,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  addHealthcareVideoCategory: async (req, res, next) => {
    try {
      let data = req.body;
      let existingCategory = await HealthcareVideoCategory.findOne({
        name: data.name,
      });
      if (!existingCategory) {
        if (req.file) {
          if (req.body.parent != "main") {
            let validCategory = await HealthcareVideoCategory.findOne({
              _id: mongoose.Types.ObjectId(data.parent),
              parent: "main",
            });

            if (!validCategory) {
              return res.status(200).json({
                status: false,
                message: "invalid parent category id",
              });
            }
          }

          if(data.parent == 'main') {
            if(data.homepage != 'false') {
              return res.status(422).json({
                status: false,
                message: "Cannot assign main category to homepage",
              });
            }
          }

          data.image = `medfeed/${req.file.filename}`;
          let schemaObj = new HealthcareVideoCategory(data);
          schemaObj
            .save()
            .then((response) => {
              res.status(200).json({
                status: true,
                data: "Category added successfully",
              });
            })
            .catch(async (error) => {
              await unlinkAsync(req.file.path);
              res.status(200).json({
                status: false,
                data: error,
              });
            });
        } else {
          res.status(200).json({
            status: false,
            data: "Please upload image",
          });
        }
      } else {
        if (req.file) {
          await unlinkAsync(req.file.path);
        }
        res.status(200).json({
          status: false,
          data: "Existing category",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getAllHealthcareVideoCategories: async (req, res, next) => {
    try {
      let result = await HealthcareVideoCategory.find(
        {},
        {
          homepage: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      ).lean();

      for (category of result) {
        if (category.parent != "main") {
          console.log("invalid parent:", category.parent);
          let maincategory = await HealthcareVideoCategory.findOne({
            _id: mongoose.Types.ObjectId(category.parent),
          });
          category.parent = maincategory.name;
        }
        category.image = process.env.BASE_URL.concat(category.image);
      }

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getHomepageHealthCareVideoCategories: async (req, res, next) => {
    try {
      let result = await HealthcareVideoCategory.find(
        { homepage: true },
        {
          homepage: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      );

      for (category of result) {
        if (category.parent != "main") {
          let maincategory = await HealthcareVideoCategory.findOne({
            _id: mongoose.Types.ObjectId(category.parent),
          });
          category.parent = maincategory.name;
        }
        category.image = process.env.BASE_URL.concat(category.image);
      }

      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  viewHealthCareVideoMainCategories: async (req, res, next) => {
    try {
      let results = [];
      let result = await HealthcareVideoCategory.find(
        { parent: "main" },
        {
          name: 1,
          parent: 1,
        }
      );
      // for (let item of result) {
      //   let res = await HealthcareVideoCategory.findOne({ parent: item._id });
      //   if (res) {
      //     results.push(item);
      //   }
      // }
      res.status(200).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
  viewHealthCareVideoSubCategories: async (req, res, next) => {
    try {
      let result = await HealthcareVideoCategory.find({
        parent: req.params.id,
      }).lean();
      let data = [];
      for (let item of result) {
        let videoCount = await HealthCareVideo.countDocuments({
          subCategories: item._id + "",
        });
        item.count = videoCount;
        data.push(item);
      }
      res.status(200).json({
        status: true,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  viewHealthcareVideoCategory: async (req, res, next) => {
    try {
      let category = await HealthcareVideoCategory.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      );
      if (category) {
        category.image = process.env.BASE_URL.concat(category.image);
        res.status(200).json({
          status: true,
          data: category,
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
  editHealthcareVideoCategory: async (req, res, next) => {
    try {
      console.log("video edit incoming:::===:", req.body);
      let data = req.body;

      if (data.categoryId) {
        let category = await HealthcareVideoCategory.findOne({
          _id: mongoose.Types.ObjectId(data.categoryId),
        });

        if (category) {
          if (data.image == "null") {
            delete data.image;
          }

          if (req.file) {
            data.image = `medfeed/${req.file.filename}`;
            // deleting old image
            let splittedImageRoute = category.image.split("/");

            fs.unlink(
              `./public/images/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;
                console.log("old image deleted!");
              }
            );
          }

          HealthcareVideoCategory.updateOne(
            { _id: mongoose.Types.ObjectId(data.categoryId) },
            data
          ).then((response) => {
            console.log("res::", response);
            let now = new Date();
            HealthcareVideoCategory.updateOne(
              { _id: mongoose.Types.ObjectId(data.categoryId) },
              {
                $set: {
                  updatedAt: now,
                },
              }
            ).then((response) => {
              res.status(200).json({
                status: true,
                data: "Updated",
              });
            });
          });
        } else {
          res.status(200).json({
            status: false,
            data: "invalid categoryId",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          data: "please enter categoryId",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteHealthcareVideoCategory: async (req, res, next) => {
    try {
      let category = await HealthcareVideoCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      if (category) {
        if (category.parent != "main") {
          let videoExistUnderThisSubCategory = await HealthCareVideo.findOne({
            subCategories: req.params.id,
          });

          if (!videoExistUnderThisSubCategory) {
            let splittedImageRoute = category.image.split("/");
            fs.unlink(
              `./public/images/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;
              }
            );
            HealthcareVideoCategory.deleteOne({
              _id: mongoose.Types.ObjectId(req.params.id),
            }).then((response) => {
              return res.status(200).json({
                status: true,
                data: "Category removed",
              });
            });
          } else {
            return res.status(200).json({
              status: false,
              data: "Cannot delete this category: there are some videos under this category",
            });
          }
        } else {
          let subCategoriesExistUnderThisCategory =
            await HealthcareVideoCategory.findOne({ parent: req.params.id });

          if (!subCategoriesExistUnderThisCategory) {
            let splittedImageRoute = category.image.split("/");
            fs.unlink(
              `./public/images/${splittedImageRoute[1]}`,
              function (err) {
                if (err) throw err;
              }
            );
            HealthcareVideoCategory.deleteOne({
              _id: mongoose.Types.ObjectId(req.params.id),
            }).then((response) => {
              return res.status(200).json({
                status: true,
                data: "Category removed",
              });
            });
          } else {
            return res.status(200).json({
              status: false,
              data: "Sorry, there are some sub categories under this category.",
            });
          }
        }
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
  addHealthTipCategory: async (req, res, next) => {
    try {
      let exists = await HealthTipCategory.findOne({ name: req.body.name });
      if (!exists) {
        HealthTipCategory.create({
          name: req.body.name,
        })
          .then((response) => {
            res.status(200).json({
              status: true,
              data: "Category added",
            });
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
          data: "Existing category",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getAllHealthTipCategories: async (req, res, next) => {
    try {
      let result = await HealthTipCategory.aggregate([
        { $project: { title: "$name" } },
      ]);
      res.status(200).json({
        error: false,
        message: "success",
        data: { health_category: result },
      });
    } catch (error) {
      next(error);
    }
  },
  viewHealthTipCategory: async (req, res, next) => {
    try {
      let category = await HealthTipCategory.findOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        {
          isDisabled: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        }
      );
      if (category) {
        res.status(200).json({
          status: true,
          data: category,
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
  editHealthTipCategory: async (req, res, next) => {
    try {
      let valid = await HealthTipCategory.findOne({
        _id: mongoose.Types.ObjectId(req.body.categoryId),
      });

      if (valid) {
        HealthTipCategory.updateOne(
          { _id: mongoose.Types.ObjectId(req.body.categoryId) },
          {
            name: req.body.name,
          }
        ).then((response) => {
          console.log(response);
          if (response.nModified == 1) {
            let date = new Date();
            HealthTipCategory.updateOne(
              { _id: mongoose.Types.ObjectId(req.body.categoryId) },
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
            res.status(200).json({
              status: false,
              data: "no changes",
            });
          }
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid categoryId",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteHealthTipsCategory: async (req, res, next) => {
    try {
      console.log("req.params.id", req.params.id);
      let category = await HealthTipCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      if (category) {
        let healthTips = await HealthTip.find();
        console.log("healthTips", healthTips);
        if (healthTips.length) {
          let tipExists = await HealthTip.findOne({
            categories: { $elemMatch: { $in: req.params.id } },
          });
          console.log("tipExists", tipExists);
          if (!tipExists) {
            HealthTipCategory.deleteOne({
              _id: mongoose.Types.ObjectId(req.params.id),
            }).then((response) => {
              res.status(200).json({
                status: true,
                data: "Category removed",
              });
            });
          } else {
            res.status(200).json({
              status: false,
              data: "This category cannot be deleted: there are some health tips under this category",
            });
          }
        } else {
          HealthTipCategory.deleteOne({ _id: req.params.id }).then(
            (response) => {
              res.status(200).json({
                status: true,
                data: "Category removed",
              });
            }
          );
        }
      } else {
        res.status(200).json({
          status: false,
          data: "invalid categoryId",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  addHealthExpertCategory: async (req, res, next) => {
    try {
      let exists = await HealthExpertCategory.findOne({ name: req.body.name });
      if (!exists) {
        HealthExpertCategory.create({
          name: req.body.name,
        })
          .then((response) => {
            res.status(200).json({
              status: true,
              data: "Category added",
            });
          })
          .catch((response) => {
            res.status(200).json({
              status: false,
              data: response,
            });
          });
      } else {
        res.status(200).json({
          status: false,
          data: "Existing category",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getAllHealthExpertCategories: async (req, res, next) => {
    try {
      let userImage = req.user.userImage;
      if (userImage) {
        userImage = process.env.BASE_URL.concat(userImage);
      } else {
        userImage = process.env.BASE_URL.concat("medfeed/head.jpeg");
      }
      let result = await HealthExpertCategory.aggregate([
        { $project: { title: "$name" } },
      ]);
      res.status(200).json({
        err: true,
        message: "success",
        data: {
          category: result.reverse(),
          userImage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  viewHealthExpertCategory: async (req, res, next) => {
    try {
      let category = await HealthExpertCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (category) {
        res.status(200).json({
          status: true,
          data: category,
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
  editHealthExpertCategory: async (req, res, next) => {
    try {
      let valid = await HealthExpertCategory.findOne({
        _id: mongoose.Types.ObjectId(req.body.categoryId),
      });

      if (valid) {
        HealthExpertCategory.updateOne(
          { _id: mongoose.Types.ObjectId(req.body.categoryId) },
          {
            name: req.body.name,
          }
        ).then((response) => {
          console.log(response);
          if (response.nModified == 1) {
            let date = new Date();
            HealthExpertCategory.updateOne(
              { _id: mongoose.Types.ObjectId(req.body.categoryId) },
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
            res.status(200).json({
              status: false,
              data: "no changes",
            });
          }
        });
      } else {
        res.status(200).json({
          status: false,
          data: "invalid categoryId",
        });
      }
    } catch (error) {
      next(error);
    }
  },
  deleteHealthExpertCategory: async (req, res, next) => {
    try {
      let category = await HealthExpertCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.id),
      });

      if (category) {
        let healthExpertAdvices = await HealthExpertAdvice.find();

        if (healthExpertAdvices.length) {
          let tipExists = await HealthExpertAdvice.findOne({
            category: mongoose.Types.ObjectId(req.params.id),
          });
          if (!tipExists) {
            HealthExpertCategory.deleteOne({ _id: req.params.id }).then(
              (response) => {
                res.status(200).json({
                  status: true,
                  data: "Category removed",
                });
              }
            );
          } else {
            res.status(200).json({
              status: false,
              data: "This category cannot be deleted: there are some health expert advices under this category",
            });
          }
        }

        HealthExpertCategory.deleteOne({ _id: req.params.id }).then(
          (response) => {
            res.status(200).json({
              status: true,
              data: "Category removed",
            });
          }
        );
      } else {
        res.status(200).json({
          status: false,
          data: "invalid categoryId",
        });
      }
    } catch (error) {
      next(error);
    }
  },

  viewHealthcareVideoSubCategory: async (req, res, next) => {
    try {
      let result = await HealthcareVideoCategory.find(
        { parent: { $ne: "main" } },
        {
          _id: 1,
          name: 1,
          parent: 1,
        }
      ).lean();
      let data = [];
      for (let item of result) {
        let videoCount = await HealthCareVideo.countDocuments({
          subCategories: item._id + "",
        });
        item.count = videoCount;
        data.push(item);
      }

      res.status(200).json({
        status: true,
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
  createGuestUser: async (req, res, next) => {
    try {
      isExisting = await user.findOne({ isGuest: true });

      if (isExisting) {
        return res.status(200).json({
          status: false,
          message: "Guest user already added",
        });
      } else {
        let data = {
          phone: 1000000001,
          name: "Guest",
          isGuest: true,
        };
        let schemaObj = user(data);
        schemaObj.save().then((response) => {
          let token = createToken(response._id);
          res.status(200).json({
            status: true,
            message: "Created guest user",
            data: {
              token: token,
            },
          });
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getVideoByMainCat: async (req, res, next) => {
    try {
      let result = [];
      let subCat = await HealthcareVideoCategory.find({
        parent: req.params.id,
      }).lean();
      for (let item of subCat) {
        let videos = await HealthCareVideo.find({
          subCategories: item._id + "",
        }).lean();
        for (let video of videos) {
          if (!result.includes(video)) {
            result.push(video);
          }
        }
      }
      let base_url = "http://143.110.240.107:8000/";

      for (j = 0; j < result.length; j++) {
        let count = await Like.countDocuments({
          contentId: mongoose.Types.ObjectId(result[j]._id),
        });
        result[j].like_count = count;
        let shareCount = await Share.findOne({
          contentId: mongoose.Types.ObjectId(result[j]._id),
        });
        if (shareCount) {
          result[j].share_count = shareCount.share_count;
        } else {
          result[j].share_count = 0;
        }
        result[j].thumbnail = base_url.concat(result[j].thumbnail);

        result[j].type = "healthcareVideo";

        result[j].createdAt = timeSince(result[j].createdAt);
      }
      let read = await Read.aggregate([
        { $match: { type: "healthcarevideo" } },
        {
          $sort: { read_count: 1 },
        },
      ]);
      let shared = await Share.aggregate([
        { $match: { type: "healthcareVideo" } },
        {
          $sort: { share_count: 1 },
        },
      ]);
      for (let items of result) {
        items.mostViewed = false;
        items.mostShared = false;
      }
      for (let item of result) {
        // Most viewed
        for (const data of read) {
          if (JSON.stringify(item._id) == JSON.stringify(data.contentId)) {
            item.mostViewed = true;
          }
        }
        //Most Shared
        for (const datas of shared) {
          // console.log(typeof item._id);
          // console.log(typeof datas.contentId);
          if (JSON.stringify(item._id) == JSON.stringify(datas.contentId)) {
            item.mostShared = true;
          }
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
};
