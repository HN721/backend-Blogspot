const express = require("express");
const multer = require("multer");
const CategoryController = require("../../controllers/category/CategoryController");
const isAuthenticated = require("../../middleware/isAuth");
//create multer instance

//!create instance express router
const categoryRouter = express.Router();

//-----Create post----

categoryRouter.post(
  "/category/create",
  isAuthenticated,
  CategoryController.createCategory
);
categoryRouter.get(
  "/category/get-all-categories",
  CategoryController.fetchAllCategories
);
categoryRouter.put(
  "/category/update/:categoryId",
  isAuthenticated,
  CategoryController.update
);

categoryRouter.get("/category/:categoryId", CategoryController.getCategory);

categoryRouter.delete(
  "/category/delete/:categoryId",
  isAuthenticated,
  CategoryController.delete
);
//----lists all posts----

module.exports = categoryRouter;
