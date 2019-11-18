'use strict';

// Response Handler

exports.ok = function(values, res) {
  var data = {
      'status': 200,
      'values': values,
  };
  res.json(data);
  res.end();
};

exports.internalError = function(values, res) {
  var data = {
      'status': 500,
      'values': values,
  };
  res.json(data);
  res.end();
}