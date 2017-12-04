"use strict";

const cp = require('child_process').spawn ;

module.exports = (serviceName, servicePort, type) => {
  type = type || '_http._tcp';
  return cp('avahi-publish', ['-s', serviceName, type, servicePort]);
};
