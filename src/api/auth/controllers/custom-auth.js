'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async customLogin(ctx) {
    const { identifier, password } = ctx.request.body;

    if (!identifier || !password) {
      return ctx.badRequest('Please provide both identifier and password');
    }

    try {
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
        return ctx.unauthorized('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return ctx.unauthorized('Invalid credentials');
      }

      // 🟩 Check if user is admin
      const isAdmin = user.role?.name === 'admin';
      let restaurantData = null;

      if (isAdmin) {
        // Get restaurant data linked to the user if available
        restaurantData = await strapi.db.query('api::restaurant.restaurant').findOne({
          where: { user: user.id }, // adjust the condition based on your relation setup
        });
      }

      const jwt = strapi
        .plugin('users-permissions')
        .service('jwt')
        .issue({ id: user.id });

      const sanitizedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        confirmed: user.confirmed,
        blocked: user.blocked,
        role: user.role?.name || 'unknown',
      };

      return ctx.send({ jwt, user: sanitizedUser, restaurant: restaurantData });

    } catch (err) {
      strapi.log.error('Login error:', err);
      return ctx.internalServerError('Login failed');
    }
  },
};
