'use strict';

module.exports = ({ env }) => ({
  host: '0.0.0.0',
  port: env.int('PORT', 1337),

  app: {
    keys: env.array('APP_KEYS', ['defaultKey1', 'defaultKey2']),
  },

  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
