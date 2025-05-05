const { sendResponse } = require('../middleware/middleware');
 
// In-memory user store
let users = [];
 
exports.createUser = (req, res) => {
    const { name, email, age } = req.body;
 
    if (!name || !email || !age) {
        return sendResponse(res, 400, 'Name, email, and age are required');
    }
 
    const user = {
        id: users.length + 1,
        name,
        email,
        age
    };
 
    users.push(user);
    return sendResponse(res, 201, 'User created successfully', user);
};
 
exports.getAllUsers = (req, res) => {
    return sendResponse(res, 200, 'Users retrieved successfully', users);
};
 
exports.getUserById = (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
 
    if (!user) {
        return sendResponse(res, 404, 'User not found');
    }
 
    return sendResponse(res, 200, 'User retrieved successfully', user);
};
 
exports.updateUser = (req, res) => {
    const { name, email, age } = req.body;
    const user = users.find((u) => u.id === parseInt(req.params.id));
 
    if (!user) {
        return sendResponse(res, 404, 'User not found');
    }
 
    if (name) user.name = name;
    if (email) user.email = email;
    if (age) user.age = age;
 
    return sendResponse(res, 200, 'User updated successfully', user);
};
 
exports.deleteUser = (req, res) => {
    const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
 
    if (userIndex === -1) {
        return sendResponse(res, 404, 'User not found');
    }
 
    users.splice(userIndex, 1);
    return sendResponse(res, 200, 'User deleted successfully');
};