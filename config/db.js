const mongoose = require("mongoose");

const coneectToDb = async () => {
  try {
    await mongoose.connect(process.env.URL_CONNECTION_MONGOOSE);
    console.log("Connected mongoose");
  } catch (error) {
    console.log("no connected mongoose ", error);
  }
};

module.exports = coneectToDb;
