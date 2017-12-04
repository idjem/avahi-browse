'use strict';
const expect          = require('expect.js');
const  AVAHI_BROWSE   = require('../');
const  AVAHI_REGISTER = require('../register.js');
const once            = require('once');

describe("Initial test suite for mdns-spawn", function(){

  var serviceName = "dummy_local_service";
  var servicePort = 14545;

  this.timeout(4000);

  it("should detect a dummy registration and stop", function(done) {
    var browser = new AVAHI_BROWSE();

    done = once(done);
    var chain = () => {
      browser.on(AVAHI_BROWSE.EVENT_SERVICE_DOWN, function(service){
        if(service.service_name == serviceName){
          done();
          browser.stop();
        }
      });

      foo.kill();
    };

    browser.on(AVAHI_BROWSE.EVENT_SERVICE_UP, function(service){
      if(service.service_name == serviceName && service.port == servicePort){
        chain();
      }
    });

    browser.start();

    var foo = AVAHI_REGISTER(serviceName, servicePort, "_http._tcp");
  });

  it("multiple start and stopsupport", function(){
    var browser = new AVAHI_BROWSE();
    browser.start();
    var pid = browser._proc.pid ;
    browser.start();
    expect(browser._proc.pid).to.be(pid);
    browser.stop();
    browser.stop();
    expect(browser._proc).not.to.be.ok();
  });
});
