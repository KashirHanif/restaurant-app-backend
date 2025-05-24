// controller/auth.js
'use strict';

module.exports = {
  async customRegister(ctx) {
    const { email, username, password } = ctx.request.body;

    if (!email || !username || !password) {
      return ctx.badRequest('Email, username, and password are required.');
    }

    try {
      // Check for existing user
      const existingUser = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({ where: { email } });

      if (existingUser) {
        return ctx.conflict('Email is already in use.');
      }

      // Create user without logging in
      const newUser = await strapi
        .plugin('users-permissions')
        .service('user')
        .add({
          email,
          username,
          password,
          confirmed: true,
          provider: 'local',
        });

      const sanitizedUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      };

      return ctx.send({ user: sanitizedUser }); // No JWT
    } catch (error) {
      strapi.log.error('Registration failed:', error);
      return ctx.internalServerError('Registration failed.');
    }
  },
};
