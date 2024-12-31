const asyncHandler = require("express-async-handler");
const Category = require("../../models/Category/Category");
const CategoryController = {
  //!Create post
  createCategory: asyncHandler(async (req, res) => {
    const { categoryName, description } = req.body;
    const CateogryFound = await Category.findOne({ categoryName });
    if (CateogryFound) {
      throw new Error("Category already exists");
    }
    const categoryCreate = await Category.create({
      categoryName,
      description,
      author: req.user,
    });
    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      categoryCreate,
    });
  }),

  //!list all posts
  fetchAllCategories: asyncHandler(async (req, res) => {
    const category = await Category.find();
    const categories = category.map((category) => {
      return {
        id: category._id,
        categoryName: category.categoryName,
        description: category.description,
        author: category.author,
      };
    });
    res.json({
      status: "success",
      message: "Category fetched successfully",
      categories,
    });
  }),
  //! get a post
  getCategory: asyncHandler(async (req, res) => {
    //get the post id from params
    const categoryId = req.params.categoryId;
    //find the post
    const categoryFound = await Category.findById(categoryId);
    res.json({
      status: "success",
      message: "Post fetched successfully",
      categoryFound,
    });
  }),
  //! delete
  delete: asyncHandler(async (req, res) => {
    //get the post id from params
    const categoryId = req.params.categoryId;
    //find the post
    await Category.findByIdAndDelete(categoryId);
    res.json({
      status: "success",
      message: "Category deleted successfully",
    });
  }),
  //! pdate post
  update: asyncHandler(async (req, res) => {
    //get the post id from params
    const categoryId = req.params.categoryId;
    //find the post
    const categoryFound = await Category.findById(categoryId);
    if (!categoryFound) {
      throw new Error("Post  not found");
    }
    //update
    const categoryUpdted = await Category.findByIdAndUpdate(
      categoryId,
      {
        categoryName: req.body.categoryName,
        description: req.body.description,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "Post updated successfully",
      categoryUpdted,
    });
  }),
};

module.exports = CategoryController;
