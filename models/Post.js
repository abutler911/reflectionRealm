// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);