'use strict';

const customRegister = require('./custom-register');
const customAuth = require('./custom-auth');

module.exports = {
  routes: [
    ...customRegister.routes,
    ...customAuth.routes,
  ],
};
