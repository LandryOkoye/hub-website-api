const response = require("../utils/response");

const {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} = require("../lib/errors");

const blogService = require("../services/blog");
const { uploadToCloud, deleteFromCloud } = require("../lib/cloudinary");

class BlogController {
  async create(req, res) {
    if (!req?.file?.path) throw new BadRequestError("Invalid file path");

    const imgUpload = await uploadToCloud(req.file.path);
    if (!imgUpload) throw new BadRequestError("Unable to upload image");

    Object.assign(req.body, imgUpload);

    await blogService.create(req.body);

    res.send(response("Blog uploaded successfully"));
  }

  async getBlogPost(req, res) {
    const blog = await blogService.findById(req.params.id);
    if (!blog) throw new NotFoundError("Invalid Blog Item");

    res.send(response("Blog Post returned successfully", blog));
  }

  async getAllBlogPosts(req, res) {
    const blog = await blogService.getAllBlog();

    res.send(response("Blog Posts returned successfully", blog));
  }

  async update(req, res) {
    const blog = await blogService.findById(req.params.id);
    if (!blog) throw new BadRequestError("Invalid Blog Post");

    if (req?.file?.path) {
      const imgUpload = await uploadToCloud(req.file.path);
      if (!imgUpload) throw new BadRequestError("Unable to upload image");

      Object.assign(req.body, imgUpload);

      await deleteFromCloud(blog.public_id);
    }

    const updatedBlog = await blogService.update(req.params.id, req.body);

    res.send(response("Blog uploaded successfully", updatedBlog));
  }

  async delete(req, res) {
    const blog = await blogService.findById(req.params.id);
    if (!blog) throw new BadRequestError("Invalid Blog Post");

    const del = await deleteFromCloud(blog.public_id);
    if (del.result !== "ok")
      throw new InternalServerError("Unable to delete image");

    await blogService.delete(req.params.id);
    res.send(response("Blog Post deleted successfully"));
  }
}

module.exports = new BlogController();
