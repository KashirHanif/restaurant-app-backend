

'use strict';

const stripeService = require('../../../../src//api/restaurant/services/stripe');

module.exports = {
  async createIntent(ctx) {
    const { amount, currency } = ctx.request.body;

    if (!amount || !currency) {
      return ctx.badRequest('Amount and currency are required');
    }

    try {
      const intent = await stripeService.createPaymentIntent(amount, currency);
      return ctx.send({ clientSecret: intent.client_secret });
    } catch (err) {
      return ctx.internalServerError('Failed to create payment intent');
    }
  },
};
