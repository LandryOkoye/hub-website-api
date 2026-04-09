const mongoose = require("mongoose");
const env = require("./src/config/env");
const Blog = require("./src/models/blog");
const blogsData = require("./blogs.json");

// Connect to database
const db = env.DB_URI;

const seedBlogs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(db);
    console.log("✅ Connected to database");

    // Clear existing blogs
    const deleteResult = await Blog.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing blogs`);

    // Prepare blogs data with public_id
    const blogsToInsert = blogsData.map((blog) => {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/blockchainhub-africa/image/upload/v1653922254/blockchainhubafrica/nscfnriwnzcshcyz3pow.jpg
      const urlParts = blog.url.split("/");
      const fileNameWithExt = urlParts[urlParts.length - 1];
      const fileName = fileNameWithExt.split(".")[0];
      const folder = urlParts[urlParts.length - 2];
      const public_id = `${folder}/${fileName}`;

      return {
        title: blog.title,
        slug: blog.slug,
        noOfViews: blog.noOfViews,
        readingTime: blog.readingTime,
        author: blog.author,
        altText: blog.altText,
        type: blog.type,
        url: blog.url,
        public_id: public_id,
        status: blog.status,
        content: blog.content,
        publishDate: blog.publishDate,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      };
    });

    // Insert blogs
    const result = await Blog.insertMany(blogsToInsert);
    console.log(`✅ Successfully seeded ${result.length} blogs`);

    // Display seeded blogs
    console.log("\n📝 Seeded Blogs:");
    result.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title} (${blog.status})`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedBlogs();


