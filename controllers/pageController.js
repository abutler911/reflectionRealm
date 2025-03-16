// controllers/pageController.js
const Post = require('../models/Post');

exports.getHomePage = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    console.log('Found Posts: ', posts.length);
    console.log('First Post: ', posts[0]);
    res.render('index', { 
      posts,
      path: req.path
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).render('error', { error: 'Failed to fetch posts', path: req.path });
  }
};

exports.getPostPage = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    
    if (!post) {
      return res.status(404).render('404', { path: req.path });
    }
    
    // Find previous and next posts
    const nextPost = await Post.findOne({ date: { $lt: post.date } }).sort({ date: -1 });
    const prevPost = await Post.findOne({ date: { $gt: post.date } }).sort({ date: 1 });
    
    res.render('post', { 
      post,
      prevPost,
      nextPost,
      path: req.path
    });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).render('error', { error: 'Failed to fetch post', path: req.path });
  }
};

exports.getAboutPage = (req, res) => {
  res.render('about', { path: req.path });
};
