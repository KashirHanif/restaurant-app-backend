'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async customLogin(ctx) {
    const { identifier, password } = ctx.request.body;

    if (!identifier || !password) {
      return ctx.badRequest('Please provide both identifier and password');
    }

    try {
      // Log login attempt
      strapi.log.info(`Login attempt for identifier: ${identifier}`);

      // Find user
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          $or: [
            { email: identifier.toLowerCase() },
            { username: identifier },
          ],
        },
        populate: ['role'],
      });

      if (!user) {
        strapi.log.warn(`No user found for identifier: ${identifier}`);
        return ctx.unauthorized('Invalid credentials');
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        strapi.log.warn(`Invalid password for identifier: ${identifier}`);
        return ctx.unauthorized('Invalid credentials');
      }

      // Generate JWT
      const jwt = strapi
        .plugin('users-permissions')
        .service('jwt')
        .issue({ id: user.id });

      // Manual sanitization
      const sanitizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        confirmed: user.confirmed,
        blocked: user.blocked,
        role: user.role?.name || 'unknown',
      };

      strapi.log.info(`Login successful for identifier: ${identifier}`);

      return ctx.send({ jwt, user: sanitizedUser });

    } catch (err) {
      strapi.log.error('Login error:', err);
      return ctx.internalServerError('Login failed');
    }
  },
};
