module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/custom-register',
      handler: 'auth.customRegister',
      config: {
        auth: false, // Or true if you want to restrict
        policies: [],
      },
    },
  ],
};
