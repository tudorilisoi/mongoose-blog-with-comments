exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blog-with-comments';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-blog-with-comments' ;
exports.PORT = process.env.PORT || 8088;
exports.JWT_SECRET='you never saw this';

