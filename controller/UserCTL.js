// const { EqualizerRounded, CatchingPokemon, ContentPasteSearchOutlined } = require("@mui/icons-material");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment")

const Register = async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.pAss);
  try {
    const user = await User.findOne({ email: req.body.eMail });
    const user1 = await User.findOne({ username: req.body.username });
    if (user) {
      res.send("UserEmail already exists!");
    }
    else if (user1) {
      res.send("UserName already exists!");
    }
    else {
      console.log(req.body)
      if (req.body.eMail === "admin@gmail.com" && req.body.pAss === "admin123") {
        console.log(req.body)

        const newuser = new User({
          firstName: req.body.fName,
          lastname: req.body.lName,
          // username: req.body.uName,
          username: req.body.username,
          email: req.body.eMail,
          // address: req.body.aDdress,
          // state: req.body.sTate,
          country: req.body.cOuntry,
          password: hashedPassword,
          Phone: req.body.pHone,
          period: 99999999999,
          level: 1
          // producttype: req.body.pRotype,
          // paymentInfo: req.body.pAyment,
        });
        newuser.save();
        res.status(200).send(`User ${newuser.email} registered successfully!`);
      }
      else {
        console.log(req.body)
        const newuser = new User({
          firstName: req.body.fName,
          lastname: req.body.lName,
          // username: req.body.uName,
          username: req.body.username,
          email: req.body.eMail,
          // address: req.body.aDdress,
          // state: req.body.sTate,
          country: req.body.cOuntry,
          password: hashedPassword,
          Phone: req.body.pHone,
          period: 0,
          request: 1,
          // producttype: req.body.pRotype,
          // paymentInfo: req.body.pAyment,
        });
        newuser.save();
        res.status(200).send(`User ${newuser.email} registered successfully!`);
      }


    }
  } catch (error) {
    console.log(error);
  }
};

const Login = async (req, res) => {
  try {
    let user;
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
      if (user) {
        if (user.flag !== new Date()) {
          var date = Number(moment(new Date()).format("YYYY") - moment(user.registerTime).format("YYYY")) * 365 +
            Number(moment(new Date()).format("MM") - moment(user.registerTime).format("MM")) * 30 +
            Number(moment(new Date()).format("DD") - moment(user.registerTime).format("DD"))
          // user.flag = new Date();
          if (user.period - date > 0 && user.request == 0) {
            const filter = { _id: user._id };
            const update = {
              $set: {
                period: user.period - date,
                flag: new Date()
              },
            };
            await User.findOneAndUpdate(filter, update, { new: true });
          }
          else if (user.period - date <= 0 && user.request == 0) {
            User.deleteOne({ email: req.body.email }).then(res => {
              console.log(res.data);
              res.send("Your period is finished. Please register again")
            })
          }
        }
      }
      else if (!user) {
        return res.send("User Not Found");
      }
    } else if (req.body.username) {
      user = await User.findOne({ username: req.body.username });
      if (user) {
        if (user.flag !== new Date()) {
          var date = Number(moment(new Date()).format("YYYY") - moment(user.registerTime).format("YYYY")) * 365 +
            Number(moment(new Date()).format("MM") - moment(user.registerTime).format("MM")) * 30 +
            Number(moment(new Date()).format("DD") - moment(user.registerTime).format("DD"))
          // user.flag = new Date();
          if (user.period - date > 0 && user.request == 1) {
            const filter = { _id: user._id };
            const update = {
              $set: {
                period: user.period - date,
                flag: new Date()
              },
            };
            await User.findOneAndUpdate(filter, update, { new: true });
          }
          else if (user.period - date <= 0 && user.request == 0) {
            User.deleteOne({ username: req.body.username }).then(res => {
              console.log(res.data)
              res.send("Your period is finished. Please register again")
            })
          }
        }
      }
      else if (!user) {
        return res.send("User Not Found");
      }
    }
    const passwordMatch = await bcrypt.compare(req.body.pAss, user.password);
    if (!passwordMatch) {
      return res.send("Password Dont Matched");
    }
    else {
      const token = jwt.sign({ userId: user._id }, "bear");
      const obj = {
        userId: user._id,
        level: user.level,
        firstName: user.firstName,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        password: req.body.pAss,
        level: user.level,
        period: user.period,
        request: user.request,
        token: token,
      };
      res.json(obj);
    }
  } catch (error) {
    console.log(error);
  }
};

const ForgotPass = (req, res) => {
  const pass = User.findOne({ email: req.body.email });

  if (pass) {
    res.send(User.email);
  } else {
    res.send("User is not exist");
  }
};

const NewPass = async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.pass);
  const filter = { email: req.body.email };
  const update = { $set: { password: hashedPassword } };
  const options = { upsert: true, returnOriginal: false };

  // Update the user's password
  User.findOneAndUpdate(filter, update, options)
    .then((updatedUser) => {
      if (updatedUser) {
        res.send("Your password has been successfully changed!");
      }
    })
    .catch((error) => {
      if (error) res.send("Password change failed.");
    });
};

const GetAllUser = async (req, res) => {
  try {
    const allusers = await User.find({ level: 0 });
    if (allusers) {
      res.json(allusers);
    } else {
      res.send("Nobody");
    }
  } catch (error) {
    res.status(500).send("Error occurred while fetching users");
  }
};

const UpdateUsers = async (req, res) => {
  try {
    const user = req.body;
    const filter = { _id: user._id };
    if (req.body.lastpassword && req.body.newpassword) {
      console.log("password")
      try {
        const finduser = await User.findOne({ email: user.email });
        console.log(finduser.passwprd)
        const passwordMatch = await bcrypt.compare(
          req.body.lastpassword,
          finduser.password
        );
        if (passwordMatch) {
          try {
            const update = {
              $set: {
                email: user.email,
                firstName: user.firstName,
                lastname: user.lastname,
                phone: user.phone,
                country: user.country,
                password: bcrypt.hashSync(req.body.newpassword),
                request: user.request,
              },
            };

            await User.findOneAndUpdate(filter, update, { new: true });
            console.log("success change")
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log("password dontmatched")
          return res.send("password dontmatched");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        console.log("dont have password")
        const update = {
          $set: {
            email: user.email,
            firstName: user.firstName,
            lastname: user.lastname,
            phone: user.phone,
            country: user.country,
            request: user.request,
          },
        };
        await User.findOneAndUpdate(filter, update, { new: true });
      } catch (err) {
        console.log(err);
      }

    }

    const newUser = await User.findOne({ _id: user._id });
    // console.log("newuser: ", newUser)
    if (newUser) {
      res.json(newUser);
    } else {
      res.send("nobody");
    }
  } catch (error) {
    res.send(error);
  }
};
const UpdateUser = async (req, res) => {
  try {
    const user = req.body;
    const filter = { _id: user._id };
    const update = {
      $set: {
        email: user.email,
        firstName: user.firstName,
        lastname: user.lastname,
        phone: user.phone,
        country: user.country,
        period: Number(user.period) + Number(user.request),
        request: 0,
      },
    };
    await User.findOneAndUpdate(filter, update, { new: true });
    const newUser = await User.find({ level: 0 });
    if (newUser) {
      res.json(newUser);
    } else {
      res.send("nobody");
    }
  } catch (error) {
    res.status(500).send("Updating error");
  }
};
const DeleteUser = async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.body._id });
    if (result.deletedCount === 1) {
      const newUser = await User.find({ level: 0 });
      if (newUser) {
        res.json(newUser);
      } else {
        res.send("nobody");
      }
    } else {
      res.send("cant find this user");
    }
  } catch (error) {
    res.status(500).send("Deleting error");
  }
};

const AddUser = async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password);
  try {
    const Auser = await User.findOne({ email: req.body.email });
    const Auser1 = await User.findOne({ username: req.body.username });
    if (Auser) {
      res.send("User's email already exists!");
    }
    else if (Auser1) {
      res.send("Username already exists!")
    }
    else {
      const user = new User({
        firstName: req.body.firstName,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        country: req.body.country,
        password: hashedPassword,
        Phone: req.body.Phone,
        period: 0,
        request: 1,
      });
      user.save();
      res.send(`User ${user.email} registered successfully!`);
    }

  } catch (err) {
    console.log(err);
  }
};
const getuser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (user) {
      res.json(user);
    } else {
      res.send("Not found");
    }
  } catch (error) {
    console.log(error);
  }
};
const Searchuser = async (req, res) => {
  try {
    const user = await User.find({
      $or: [
        { email: req.body.searchword },
        { firstName: req.body.searchword },
        { lastname: req.body.searchword },
        { Phone: req.body.searchword },
      ],
    });

    if (user) {
      res.json(user);
    } else {
      res.send("nobody");
    }
  } catch (error) {
    console.log(error);
  }
};
const Request_Period = async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    console.log(user.data)
    await User.updateOne({ email: req.body.email },
      { request: req.body.Rperiod }).then(data => {
        res.send("Please wait for your request to be processed.")
      }).catch(err => {
        console.log(err)
      })
  }
}
const Requesting_Mangement = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const APuser = await User.updateOne({ email: req.body.email },
      { period: req.body.period }).then(data => {
        res.send("Your subscription period has been successfully extended")
      }).catch(err => {
        console.log(err)
      })
  }
}
const GetUserPeriod = async (req, res) => {
  console.log(req.body)
  // return;
  const user = await User.findOne({ email: req.body.email })
  // console.log(user)
  // return;
  var date = Number(moment(new Date()).format("YYYY") - moment(user.registerTime).format("YYYY")) * 365 +
    Number(moment(new Date()).format("MM") - moment(user.registerTime).format("MM")) * 30 +
    Number(moment(new Date()).format("DD") - moment(user.registerTime).format("DD"))
  console.log(date)
  if (date === user.period && user.request <= 1) {
    res.send("Please choose your period!")
  }
  else if (date < user.period) {
    res.json('success')
  }
  else if (date == user.period) {
    res.json('Please choose your period!')
  }
}
module.exports = {
  Register,
  Login,
  ForgotPass,
  NewPass,
  GetAllUser,
  UpdateUsers,
  UpdateUser,
  DeleteUser,
  AddUser,
  getuser,
  Searchuser,
  Requesting_Mangement,
  GetUserPeriod,
  Request_Period
};
