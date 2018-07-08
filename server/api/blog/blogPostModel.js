'use strict';

const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

const BlogPostSchema = new mongoose.Schema({
     title: { type: String, required: true}, 
     date: { type: Date, required: true},
    
});


BlogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    date: this.date,
   
  };
};

const BlogPostModel = mongoose.model('BlogPostModel', BlogPostSchema);

module.exports = BlogPostModel
 
