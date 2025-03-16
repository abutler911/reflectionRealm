require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const marked = require('marked');
const slugify = require('slugify');

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

const importPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reflectionRealm');
    console.log('Connected to MongoDB');

    // Make sure the posts directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.log('Posts directory not found, creating...');
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    const files = fs.readdirSync(postsDirectory);
    
    if (files.length === 0) {
      console.log('No posts found in content/posts directory');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`Found ${files.length} files to process...`);
    
    for (const file of files) {
      // Skip hidden files or directories
      if (file.startsWith('.') || !file.endsWith('.md')) continue;
      
      const filePath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter
      const { data, content } = matter(fileContents);
      
      if (!data.title) {
        console.warn(`Skipping file ${file} - no title in frontmatter`);
        continue;
      }
      
      // Generate slug if not provided
      const slug = data.slug || slugify(data.title, { lower: true, strict: true });
      
      // Convert markdown to HTML
      const htmlContent = marked.parse(content);
      
      // Generate excerpt if not provided
      const excerpt = data.excerpt || content.substring(0, 150).replace(/\n/g, ' ') + '...';
      
      // Check if post already exists
      const existingPost = await Post.findOne({ slug });
      
      if (existingPost) {
        // Update existing post
        existingPost.title = data.title;
        existingPost.excerpt = excerpt;
        existingPost.content = htmlContent;
        existingPost.tags = data.tags || [];
        
        if (data.date) {
          existingPost.date = new Date(data.date);
        }
        
        await existingPost.save();
        console.log(`Updated post: ${data.title}`);
      } else {
        // Create new post
        const newPost = new Post({
          title: data.title,
          slug,
          date: data.date ? new Date(data.date) : new Date(),
          excerpt,
          content: htmlContent,
          tags: data.tags || []
        });
        
        await newPost.save();
        console.log(`Created post: ${data.title}`);
      }
    }
    
    console.log('All posts imported successfully!');
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error importing posts:', err);
    process.exit(1);
  }
};

importPosts();