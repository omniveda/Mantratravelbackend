const Blog = require("../models/Blog.Model");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { tag } = req.query;
    let query = {};
    if (tag) {
      query = { tags: { $in: [tag] } };
    }
    const blogs = await Blog.find(query).sort({ publishDate: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    const { heading, description, author, tags } = req.body;
    let image = "";

    if (req.files && req.files.image) {
      const uploadDetails = await uploadImageToCloudinary(
        req.files.image,
        process.env.FOLDER_NAME || "mantra-blogs"
      );
      image = uploadDetails.secure_url;
    }

    // tags might come as stringified array or simply string
    let parsedTags = tags;
    if (typeof tags === "string") {
      // Try parsing if it's JSON string, or split by comma
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }

    const blog = new Blog({
      heading,
      description,
      author,
      image,
      tags: parsedTags,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const { heading, description, author, tags } = req.body;
    let updateData = { heading, description, author };

    if (tags) {
      let parsedTags = tags;
      if (typeof tags === "string") {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(',').map(tag => tag.trim());
        }
      }
      updateData.tags = parsedTags;
    }

    if (req.files && req.files.image) {
      const uploadDetails = await uploadImageToCloudinary(
        req.files.image,
        process.env.FOLDER_NAME || "mantra-blogs"
      );
      updateData.image = uploadDetails.secure_url;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // Optionally delete image from Cloudinary here if Public ID was stored
    res.json({ message: "Blog removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
