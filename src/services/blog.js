const Blog = require("../models/blog");

class BlogService {
  getAllBlog() {
    return Blog.find().select("-__v -public_id").sort({ publishDate: "desc" });
  }

  create(blog) {
    return Blog.create(blog);
  }

  findById(id) {
    return Blog.findById(id);
  }

  update(id, updateQuery) {
    return Blog.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  delete(id) {
    return Blog.findByIdAndDelete(id);
  }
}

module.exports = new BlogService();
