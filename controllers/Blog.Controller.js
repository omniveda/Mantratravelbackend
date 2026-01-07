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
    const { heading, author, tags, content } = req.body;
    let parsedContent = [];

    if (typeof content === "string") {
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        parsedContent = [];
      }
    } else {
      parsedContent = content || [];
    }

    let images = [];

    // Handle images within content
    // We expect the frontend to send files with keys like 'image_0', 'image_1' etc.
    if (req.files) {
      for (let i = 0; i < parsedContent.length; i++) {
        const section = parsedContent[i];
        if (section.type === "image" && section.isNewFile) {
          const fileKey = `image_${i}`;
          if (req.files[fileKey]) {
            const uploadDetails = await uploadImageToCloudinary(
              req.files[fileKey],
              process.env.FOLDER_NAME || "mantra-blogs"
            );
            section.value = uploadDetails.secure_url;
            delete section.isNewFile;
            images.push(uploadDetails.secure_url);
          }
        } else if (section.type === "image" && typeof section.value === "string") {
          images.push(section.value);
        }
      }
    }

    // tags parsing
    let parsedTags = tags;
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }

    const blog = new Blog({
      heading,
      author,
      image: images[0] || "",
      images,
      content: parsedContent,
      tags: parsedTags,
      // For backward compatibility and list display
      description: parsedContent.find(c => c.type === "paragraph")?.value || "",
      paragraphs: parsedContent.filter(c => c.type === "paragraph").map(c => c.value),
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
    const { heading, author, tags, content } = req.body;
    let updateData = { heading, author };

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

    if (content) {
      let parsedContent = [];
      try {
        parsedContent = typeof content === "string" ? JSON.parse(content) : content;
      } catch (e) {
        parsedContent = [];
      }

      let images = [];
      // Process images in content
      for (let i = 0; i < parsedContent.length; i++) {
        const section = parsedContent[i];
        if (section.type === "image") {
          if (section.isNewFile) {
            const fileKey = `image_${i}`;
            if (req.files && req.files[fileKey]) {
              const uploadDetails = await uploadImageToCloudinary(
                req.files[fileKey],
                process.env.FOLDER_NAME || "mantra-blogs"
              );
              section.value = uploadDetails.secure_url;
              delete section.isNewFile;
            }
          }
          if (typeof section.value === "string" && section.value.startsWith("http")) {
            images.push(section.value);
          }
        }
      }

      updateData.content = parsedContent;
      updateData.images = images;
      updateData.image = images[0] || "";
      updateData.paragraphs = parsedContent.filter(c => c.type === "paragraph").map(c => c.value);
      updateData.description = updateData.paragraphs[0] || "";
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
