const express = require("express");
const multer = require("multer");
const postController = require("../../controllers/posts/postController");
const storage = require("../../utils/fileupload");
const isAuthenticated = require("../../middleware/isAuth");
//create multer instance
const upload = multer({ storage });
//!create instance express router
const postRouter = express.Router();

//-----Create post----

postRouter.post(
  "/posts/create",
  isAuthenticated,
  upload.single("image"),
  postController.createPost
);

//----lists all posts----
postRouter.get("/posts", postController.fetchAllPosts);

//----update post----
postRouter.put("/posts/:postId", isAuthenticated, postController.update);

//--- get post---
postRouter.get("/posts/:postId", postController.getPost);

//---delete post---
postRouter.delete("/posts/:postId", isAuthenticated, postController.delete);

module.exports = postRouter;
