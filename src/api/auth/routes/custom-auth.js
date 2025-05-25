module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/local/custom-login',
      handler: 'custom-auth.customLogin',
      config: {
        auth: false,
      },
    },
  ],
};
