const express = require("express");
const { Register, Login, ForgotPass, NewPass, GetAllUser, UpdateUsers, UpdateUser, DeleteUser, AddUser, getuser, Searchuser, Requesting_Mangement, GetUserPeriod, Request_Period } = require("../controller/UserCTL");
const userRouter = express.Router();


// userRouter.get("/", getAllUser);
userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.post("/forgotpass", ForgotPass);
userRouter.post("/newpass", NewPass);
userRouter.post("/getallusers", GetAllUser)
userRouter.post("/updateusers", UpdateUsers)
userRouter.post("/updateuser", UpdateUser)
userRouter.post("/deleteuser", DeleteUser);
userRouter.post("/AddUser", AddUser)
userRouter.post("/getuser", getuser);
userRouter.post("/searchuser", Searchuser);
userRouter.post("/setperiod", Requesting_Mangement)
userRouter.post("/getperiod", GetUserPeriod)
userRouter.post("/requestperiod", Request_Period)


// userRouter.post("/login", logIn);

module.exports = userRouter;