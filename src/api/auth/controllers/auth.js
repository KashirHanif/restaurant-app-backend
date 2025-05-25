'use strict';

module.exports = {
  async customRegister(ctx) {
    try {
      const { email, username, password, role } = ctx.request.body;

      if (!email || !username || !password || !role) {
        return ctx.badRequest('Email, username, password, and role are required.');
      }

      // Check if user already exists
      const existingUser = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { email } });

      if (existingUser) {
        return ctx.badRequest('Email is already in use.');
      }

      // Find desired role by name
      const desiredRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { name: role } });

      if (!desiredRole) {
        return ctx.badRequest(`Role '${role}' not found.`);
      }

      // Use Strapi's userService to properly hash password
      const userService = strapi.plugin('users-permissions').service('user');

      const newUser = await userService.add({
        email: email.toLowerCase(),
        username,
        password,
        confirmed: true,
        role: desiredRole.id,
      });

      // Sanitize output
      const sanitizedUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        confirmed: newUser.confirmed,
        role: desiredRole.name,
      };

      return ctx.send({
        message: 'User registered successfully',
        user: sanitizedUser,
      });

    } catch (error) {
      console.error('Registration failed:', error);
      return ctx.internalServerError('An error occurred during registration.');
    }
  },
};
