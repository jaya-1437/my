const { sendResponse } = require('../middleware/middleware');

let posts = [];

exports.createPost =  (req, res) => {
        const { title, content, author } = req.body;
     
        if (!title || !content || !author) {
            return sendResponse(res, 400, 'Title, content, and author are required');
        }
     
        const post = {
            id: posts.length + 1,
            title,
            content,
            author,
            createdAt: new Date()
        };
     
        posts.push(post);
        return sendResponse(res, 201, 'Post created successfully', post);
    };
 
exports.getAllPosts = (req, res) => {
    return sendResponse(res, 200, 'posts retrieved successfully', posts);
};
 
exports.getPostById = (req, res) => {
        const post = posts.find((u) => u.id === parseInt(req.params.id));
     
        if (!post) {
            return sendResponse(res, 404, 'Post not found');
        }
     
        return sendResponse(res, 200, 'Post retrieved successfully', post);
     
    };
 
exports.updatePost = (req, res) => {
        const { title, content, author } = req.body;
        const post = posts.find((u) => u.id === parseInt(req.params.id));
     
       
        if (!post) {
            return sendResponse(res, 404, 'Post not found');
        }
     
        if (title) post.title = title;
        if (content) post.content = content;
        if (author) post.author = author;
     
        return sendResponse(res, 200, 'Post updated successfully', post);
    };

exports.deletePost = (req, res) => {
        const postIndex = posts.findIndex((u) => u.id === parseInt(req.params.id));
     
        if (postIndex === -1) {
            return sendResponse(res, 404, 'Post not found');
        }
     
        posts.splice(postIndex, 1);
        return sendResponse(res, 200, 'Post deleted successfully',postIndex); // Status 200 instead of 204
    }
     