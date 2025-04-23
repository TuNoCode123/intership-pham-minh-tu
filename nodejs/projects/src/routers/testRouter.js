import express from "express";
const routerTest = express.Router();

// Định nghĩa các route
routerTest.get("/home", (req, res) => {
  res.send("Welcome to Home!");
});

routerTest.get("/about", (req, res) => {
  res.send("About Us");
});

export default routerTest;
