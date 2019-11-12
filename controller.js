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

    connection.query(queryText, function (error, rows, fields){
        if(error){
            console.log(error)
        } else{
            response.ok(rows, res)
        }
    });
};

exports.index = function(req, res) {
    response.ok("Transaction Web Service - Build with Node JS" + process.env.ADDRESS, res)
};