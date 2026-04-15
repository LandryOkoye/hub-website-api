const Blog = require("../models/blog");
const getArticleType = require("../utils/getArticleType");

class BlogService {
  async getAllBlog() {
    let blog = await Blog.find()
      .select("-__v -public_id")
      .sort({ publishDate: "desc" });
    blog.map((article) => {
      const lastDate = blog[0].publishDate;
      article.type = getArticleType(article, article.noOfViews, lastDate);
    });
    return blog;
  }

  create(blog) {
    return Blog.create(blog);
  }

  addNewView(id) {
    return Blog.findByIdAndUpdate(
      id,
      {
        $inc: { noOfViews: 1 },
      },
      { new: true }
    );
  }

  async findById(id) {
    let blog = await Blog.find()
      .select("-__v")
      .sort({ publishDate: "desc" });
    blog.map((article) => {
      const lastDate = blog[0].publishDate;
      article.type = getArticleType(article, article.noOfViews, lastDate);
    });
    return blog.find((x) => x.id === id);
  }

  update(id, updateQuery) {
    return Blog.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  delete(id) {
    return Blog.findByIdAndDelete(id);
  }
}

module.exports = new BlogService();
