'use strict';

const iconLink = require('components/iconLink');

module.exports.next = iconLink.compose({
  icon: 'arrow-right',
  iconFirst: false,
  className: 'view-link view-link--next'
});

module.exports.prev = iconLink.compose({
  icon: 'arrow-left',
  iconFirst: true,
  className: 'view-link view-link--prev'
});
