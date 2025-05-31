module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payment-intent',
      handler: 'payment.createIntent',
      config: {
        policies: [],
        auth: false, // set to true if auth is required
      },
    },
  ],
};
