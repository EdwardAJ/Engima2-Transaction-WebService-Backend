'use strict';

var response = require('./res');
var connection = require('./conn');

var table = "transactions";
// Requirement 1 - Add Pending Transaction
exports.addPendingTransaction = function(req, res) {

    // Handling Request Body
    var user_id = req.body.user_id;
    var film_id = req.body.film_id;
    var screening_id = req.body.screening_id;
    var chosen_seat = req.body.seat;
    var dest_va = req.body.dest_va;

    // Handling MySQL Queries
    var queryText = "INSERT INTO " + table + " (`user_id`, `flag`, `virtual_account_number`, `film_id`, `screening_id`, `showtime`, `seat_id`) VALUES (" + user_id + ", b'0', " + dest_va + ", " + film_id + ", " + screening_id + ", '2019-12-01 14:00:00', " + chosen_seat + ")";

    connection.query(queryText, function (error, rows) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res);
        }
    });
};

function normalizeUpdateTransaction(req) {
    if (req.body.transaction_id == undefined) {
        return 'Transaction ID Required!';
    }

    return null;
}

exports.updateTransaction = function(req, res) {
    var normalizeResult = normalizeUpdateTransaction(req);

    if (normalizeResult != null) {
        response.internalError({message: normalizeResult}, res);
        return;
    }

    var transaction_id = req.body.transaction_id;

    //Get the transaction.
    var transaction = null;
    var getTransactionQuery = "SELECT * FROM " + table + " WHERE id = " + transaction_id;
    connection.query(getTransactionQuery, function (error, results, fields) {
        if (error) {
            console.log(error);
            response.error({message: 'Internal error.'}, res);
            return;
        } else {
            if (results.length > 0) {
                transaction = results[0];
                transaction.flag = transaction.flag[0] << 1 + transaction.flag[1];
            } else {
                response.ok({message: 'Transaction not found!'}, res);
                return;
            }
        }

        //Check if update is needed.
        if (transaction.flag != 0) {
            response.ok({message: 'No updates needed.'}, res);
            return;
        }


        //Send request to WS Bank API.
        var isPaid = false;
        
        if (isPaid) {
            var queryText = "UPDATE " + table + " SET flag = b'1' WHERE id = " + transaction_id;
            
            connection.query(queryText, function (error, results) {
                if (error) {
                    console.log(error);
                    response.error({message: 'Internal error.'}, res);
                } else {
                    response.ok({message: 'Updated successfully.'}, res);
                }
            });
        } else {
            var expireDate = new Date((new Date(transaction.created_at)).getTime() + (5 * 60000));
            var isExpired = expireDate <= new Date();

            if (isExpired) {
                var queryText = "UPDATE " + table + " SET flag = b'10' WHERE id = " + transaction_id;
            
                connection.query(queryText, function (error, results) {
                    if (error) {
                        console.log(error);
                        response.error({message: 'Internal error.'}, res);
                    } else {
                        response.ok({message: 'Updated successfully.'}, res);
                    }
                });
            } else {
                response.ok({message: 'No updates needed.'}, res);
            }
        }
    });
}

exports.index = function(req, res) {
    response.ok("Transaction Web Service - Build with Node JS" + process.env.ADDRESS, res)
};