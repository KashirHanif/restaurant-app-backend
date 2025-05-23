'use strict';

const { sanitize } = require('@strapi/utils');

module.exports = {
  async customRegister(ctx) {
    const { email, username, password } = ctx.request.body;

    // Check for missing fields
    if (!email || !username || !password) {
      return ctx.badRequest('Email, username, and password are required.');
    }

    try {
      // Check if a user with the same email already exists
      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email },
      });

      if (existingUser) {
        return ctx.conflict('Email is already in use.');
      }

      // Create the new user
      const newUser = await strapi
        .plugin('users-permissions')
        .service('user')
        .add({
          email,
          username,
          password,
          confirmed: true, // Optional: auto-confirm the user
        });

      // Sanitize user object to remove sensitive fields
      const sanitizedUser = await sanitize.contentAPI.output(
        newUser,
        strapi.getModel('plugin::users-permissions.user')
      );

      return ctx.send({ user: sanitizedUser });
    } catch (error) {
      strapi.log.error('Error in customRegister:', error);
      return ctx.internalServerError('An error occurred during registration.');
    }
  },
};
