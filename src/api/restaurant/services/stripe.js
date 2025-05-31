// src/services/stripe.js or wherever you are creating the service

'use strict';

const Stripe = require('stripe');

// ✅ Instantiate Stripe with `new` (this is required)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // use your preferred version
});

module.exports = {
  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
      });

      return paymentIntent;
    } catch (error) {
      strapi.log.error('Stripe PaymentIntent error:', error);
      throw new Error('Unable to create payment intent');
    }
  },
};
