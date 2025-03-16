require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const marked = require('marked');
const slugify = require('slugify');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
const postsDirectory = path.join(process.cwd(), 'content', 'posts');

const importPosts = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is required');
    process.exit(1);
  }

  let connection;
  try {
    mongoose.set('serverSelectionTimeoutMS', 5000);
    connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

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
      if (!file.endsWith('.md') || file.startsWith('.') || !fs.statSync(path.join(postsDirectory, file)).isFile()) {
        continue;
      }
     
      const filePath = path.join(postsDirectory, file);
      
      const stats = fs.statSync(filePath);
      const fileSizeInMB = stats.size / (1024*1024);
      if (fileSizeInMB > 5) {
        console.warn(`Skipping file ${file} - exceeds size limit`);
        continue;
      }
      
      const fileContents = fs.readFileSync(filePath, 'utf8');
     
      const { data, content } = matter(fileContents);
     
      if (!data.title) {
        console.warn(`Skipping file ${file} - no title in frontmatter`);
        continue;
      }
     
      const slug = data.slug || slugify(data.title, { lower: true, strict: true });
     
      const htmlContent = DOMPurify.sanitize(marked.parse(content));
     
      const excerpt = data.excerpt || content.substring(0, 150).replace(/\n/g, ' ') + '...';
     
      const existingPost = await Post.findOne({ slug });
     
      if (existingPost) {
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
  } catch (err) {
    console.error('An error occurred during post import');
    console.error(err.message);
  } finally {
    if (connection) {
      await mongoose.connection.close();
    }
  }
};

importPosts();