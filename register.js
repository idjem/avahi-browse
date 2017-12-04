"use strict";

const cp = require('child_process').spawn ;

module.exports = (serviceName, servicePort, type) => {
    type = type || '_http._tcp'; 
    return cp.spawn('avahi-publish', ['-s', serviceName, type, servicePort]);
}

