'use strict';

const customRegister = require('./custom-register');

module.exports = {
  routes: [...customRegister.routes],
};
