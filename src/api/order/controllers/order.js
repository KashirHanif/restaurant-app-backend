'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async update(ctx) {
    const response = await super.update(ctx);

    try {
      const updatedOrder = response.data;
      const status = updatedOrder?.attributes?.order_status;

      if (status === 'served') {
        const orderId = ctx.params.id;

        const fullOrder = await strapi.entityService.findOne('api::order.order', orderId, {
          populate: ['user', 'restaurant'],
        });

        const user = fullOrder?.user;
        const pushToken = user?.push_token;

        if (pushToken) {
          await strapi.service('api::order.order').sendPushNotification(pushToken, fullOrder);
        }
      }
    } catch (error) {
      strapi.log.error('Failed to send push notification:', error);
    }

    return response;
  },
}));
