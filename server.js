/**
 * This is the starting file of the project
 */

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server_config = require("./configs/server.config");
const db_config = require("./configs/db.config");
const user_model = require("./models/user.model");
const bcrypt = require("bcryptjs");

app.use(express.json()) //middleware

/**
 * create an admin user at the starting of the application
 * if not already present
 */

//connection with mongodb
mongoose.connect(db_config.DB_URL);

const db = mongoose.connection;

db.on("error", () => {
  console.log("error while connecting to db");
});

db.once("open", () => {
  console.log("connected to db");
  init();
});

async function init() {
   try{
     let user = await user_model.findOne({ userId: "admin" });

     if (user) {
      console.log("Admin is already present");
      return;
     }
    }catch (err) {
    console.log("Error while reading the data ", err);
    }

  try{
     user = await user_model.create({
      name: "Vishu",
      userId: "admin",
      email: "vishusharma9721@gmail.com",
      userType: "ADMIN",
      password: bcrypt.hashSync("Welcome1", 8), //8 work as a salt
     });
     console.log("Admin created ", user);
    }catch (err) {
    console.log("Error while create admin ", err);
    }
}

/**
 * stich the route to the server
 */
require("./routes/auth.route")(app)

/**
 * Start the server
 */
app.listen(server_config.PORT, () => {
  console.log("server started at port num : ", server_config.PORT);
});
