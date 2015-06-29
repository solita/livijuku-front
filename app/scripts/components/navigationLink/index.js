'use strict';

const iconLink = require('components/iconLink');

module.exports.next = iconLink.compose({
  icon: 'arrow-right',
  iconFirst: false,
  className: 'view-link'
});

module.exports.prev = iconLink.compose({
  icon: 'arrow-left',
  iconFirst: true,
  className: 'view-link'
});
