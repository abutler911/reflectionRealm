// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    
    res.status(statusCode).render('error', {
      error: message,
      path: req.path
    });
  };
  
  module.exports = errorHandler;