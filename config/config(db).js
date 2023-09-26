const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://techking5287:SBmWmyjPhzQoL3G2@cluster0.dwdyxmv.mongodb.net/CandleStick_TradePal?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log(err, "error");
  });
