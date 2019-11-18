'use strict';

// Define your routes here

module.exports = function(app) {
    var todoList = require('./controller');

    app.route('/')
        .get(todoList.index);

    app.route('/addPendingTransaction')
        .post(todoList.addPendingTransaction);
    
    app.route('/updateTransaction')
        .post(todoList.updateTransaction);
};