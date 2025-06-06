'use strict';

const { createCoreService } = require('@strapi/strapi').factories;
const axios = require('axios');

module.exports = createCoreService('api::order.order', ({ strapi }) => ({
  async sendPushNotification(pushToken, order) {
    try {
      const response = await axios.post('https://exp.host/--/api/v2/push/send', {
        to: pushToken,
        title: `Order #${order.order_number} is ready!`,
        body: `Your order at ${order.restaurant?.name || 'our restaurant'} is now served! 🍽`,
        sound: 'default',
        priority: 'high',
      });

      strapi.log.info(`✅ Push sent to ${pushToken} for Order #${order.order_number}`);
    } catch (err) {
      strapi.log.error('❌ Failed to send push notification:', err.message);
    }
  },
}));
