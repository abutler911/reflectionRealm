const express = require('express');
const path = require('path');

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 3000;

// Mock blog data - in a production app, you'd use a database
const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with Express',
    slug: 'getting-started-with-express',
    date: '2025-03-10',
    excerpt: 'Learn how to build a web application with Express.js',
    content: 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of building web applications by providing a simple API for routing HTTP requests, middleware support, and template engine integration.\n\nIn this tutorial, we\'ll cover how to create a basic Express application, set up routes, handle templates with EJS, and deploy your application to a hosting provider.',
    tags: ['JavaScript', 'Express', 'Node.js']
  },
  {
    id: 2,
    title: 'CSS Grid Layout',
    slug: 'css-grid-layout',
    date: '2025-03-12',
    excerpt: 'A comprehensive guide to CSS Grid Layout',
    content: 'CSS Grid Layout is a two-dimensional layout system designed specifically for user interface design. It allows you to create complex, responsive layouts with clean, readable CSS.\n\nIn this guide, we\'ll explore the fundamentals of CSS Grid, including grid containers, grid items, template areas, and responsive design techniques. By the end, you\'ll be able to create sophisticated layouts that adapt seamlessly to different screen sizes.',
    tags: ['CSS', 'Web Design', 'Responsive Design']
  },
  {
    id: 3,
    title: 'Introduction to React Hooks',
    slug: 'introduction-to-react-hooks',
    date: '2025-03-15',
    excerpt: 'Understanding the power of React Hooks for functional components',
    content: 'React Hooks have revolutionized how we write React components, allowing functional components to use state and other React features without writing a class. This has led to cleaner, more reusable code.\n\nIn this article, we\'ll cover the basic hooks like useState, useEffect, and useContext, as well as how to create custom hooks for your applications. We\'ll also discuss best practices and common pitfalls to avoid.',
    tags: ['React', 'JavaScript', 'Web Development']
  }
];

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    posts: blogPosts,
    path: req.path
  });
});

app.get('/blog/:slug', (req, res) => {
  const post = blogPosts.find(post => post.slug === req.params.slug);
  
  if (!post) {
    return res.status(404).render('404', { path: req.path });
  }
  
  // Find previous and next posts
  const currentIndex = blogPosts.findIndex(p => p.id === post.id);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
  
  res.render('post', { 
    post,
    prevPost,
    nextPost,
    path: req.path
  });
});

app.get('/about', (req, res) => {
  res.render('about', { path: req.path });
});

app.get('/contact', (req, res) => {
  res.render('contact', { path: req.path });
});

// Handle form submission (simple example - in production you'd use proper validation and email service)
app.post('/contact', (req, res) => {
  // This is where you would process the form data, such as sending an email
  console.log('Contact form submission:', req.body);
  
  // In a real application, you would send an email here or save to a database
  // For this example, we'll just redirect back to the contact page with a success parameter
  res.redirect('/contact?success=true');
});

// API routes
app.get('/api/posts', (req, res) => {
  res.json(blogPosts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = blogPosts.find(post => post.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(post);
});

// Handle 404
app.use((req, res) => {
  res.status(404).render('404', { path: req.path });
});

// Start server
app.listen(port, () => {
  console.log(`Blog server running at http://localhost:${port}`);
});