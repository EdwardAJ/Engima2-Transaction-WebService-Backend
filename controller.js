'use strict';

var response = require('./res');
var connection = require('./conn');
var axios = require('axios');
var DOMParser = require('dom-parser');

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

function normalizeGetTransactions (req) {
    if (req.body.user_id == undefined) {
        return 'User ID Required!';
    }
    return null;
}

function getTransactionFromBank(virtualAccountNumber, startTime, endTime) {
    var returnValue = false;
    var bankTransactionEndpoint = process.env.WSBANK_API_URL + ":" + process.env.WSBANK_API_PORT + "/wsbank/check?wsdl"

    startTime = startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate() + ' ' + startTime.getHours() + ':' + startTime.getMinutes() + ':' + startTime.getSeconds();
    endTime = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate() + ' ' + endTime.getHours() + ':' + endTime.getMinutes() + ':' + endTime.getSeconds();

    var requestXML = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:con="http://controllers.webservice.com/">
        <soapenv:Header/>
        <soapenv:Body>
        <con:checkCreditTransaction>
            <!--Optional:-->
            <accountNumber>` + virtualAccountNumber +`</accountNumber>
            <!--Optional:-->
            <startTime>` + startTime + `</startTime>
            <!--Optional:-->
            <endTime>`+ endTime + `</endTime>
        </con:checkCreditTransaction>
        </soapenv:Body>
        </soapenv:Envelope>
    `;

    axios.post(bankTransactionEndpoint, requestXML, {headers: {'Content-Type': 'text/xml;charset=UTF-8'}}
    ).then( (response) => {
        if (response.status === 200) {
            var xmlResponse = (new DOMParser()).parseFromString(response.data, 'text/xml').getElementsByTagName('return');
            returnValue = xmlResponse[0].innerHTML === 'true';
        }
    }).catch( (error) => {
        console.log("Error: ", error);
    });
    
    return returnValue;
}

function updateTrans(transaction_id) {
    //Get the transaction.
    var transaction = null;
    var getTransactionQuery = "SELECT * FROM " + table + " WHERE id = " + transaction_id;
    connection.query(getTransactionQuery, function (error, results) {
        if (error) {
            console.log(error);
            return {message: 'Internal error.'};
        } else {
            if (results.length > 0) {
                transaction = results[0];
                transaction.flag = transaction.flag[0] << 1 + transaction.flag[1];
            } else {
                return {message: 'Transaction not found!'};
            }
        }

        //Check if update is needed.
        if (transaction.flag != 0) {
            return {message: 'No updates needed.'};
        }

        //Send request to WS Bank API.
        var createTime = new Date(transaction.created_at);
        var expireTime = new Date(transaction.created_at);
        expireTime.setMinutes(createTime.getMinutes() + 2);
        var isPaid = getTransactionFromBank(transaction.virtual_account_number, createTime, expireTime);
        
        if (isPaid) {
            var queryText = "UPDATE " + table + " SET flag = b'1' WHERE id = " + transaction_id;
            
            connection.query(queryText, function (error) {
                if (error) {
                    console.log(error);
                    return {message: 'Internal error.'};
                } else {
                    return {message: 'Updated successfully.'};
                }
            });
        } else {
            var expireDate = new Date(transaction.created_at + ' UTC');
            expireDate.setMinutes(expireDate.getMinutes() + 2);
            var isExpired = expireDate <= new Date();
            if (isExpired) {
                queryText = "UPDATE " + table + " SET flag = b'10' WHERE id = " + transaction_id;
            
                connection.query(queryText, function (error) {
                    if (error) {
                        console.log(error);
                        return {message: 'Internal error.'};
                    } else {
                        return {message: 'Updated successfully.'};
                    }
                });
            } else {
                return {message: 'No updates needed.'};
            }
        }
    });
}

exports.index = function (req, res) {
    response.ok("Transaction Web Service - Build with Node JS" + process.env.ADDRESS, res)
};

exports.getAllTransactions = function (req, res) {
    var normalizeResult = normalizeGetTransactions(req);
    if (normalizeResult != null) {
        response.internalError({message: normalizeResult}, res);
        return;
    }
    var userID = req.body.user_id;
    var getTransactionsQuery = "SELECT * FROM " + table + " WHERE user_id = " + userID;
    connection.query(getTransactionsQuery, function (error, transactions) {
        if (error) {
            console.log(error);
            response.internalError({message: 'Internal error.'}, res);
            return;
        } else {
            // Then return all of transactions
            let responseArr = [];
            // Update all transactions
            for (var i = 0; i < transactions.length; i++) {
                updateTrans(transactions[i].id);
                responseArr.push(transactions[i]);
            }
            response.ok(responseArr, res);
        }
    });
}
