const Events   = require('events');
const spawn = require('child_process').spawn;
const Split = require('stream-split');
const splitter = new Split(new Buffer('\n'));
const logger   = require('debug')('avahi-browse');

class AVAHI_BROWSE extends Events.EventEmitter {
  constructor(service_type, domain) {
    super();
    this._proc         = null;
    this._service_type = null;
    this._domain       = null;
    this._service_type = service_type ||  "_http._tcp.";
    this._domain       = domain ||  "local.";
  }

  stop() {
    if(!this._proc)
      return;
    this._proc.kill();
    this._proc = null;
  }

  start() {
    if(this._proc)
      return;
    this._proc = spawn("avahi-browse", [this._service_type, '-r', '-k', '-p']);
    this._proc.on('error', (err)=> {
      logger('Error : ', err);
      this.emit(AVAHI_BROWSE.EVENT_DNSSD_ERROR, err);
    });
    this._proc.stdout = this._proc.stdout.pipe(splitter);
    this._proc.stdout.on('data', (data) => {
      const serviceInfo = data.toString().split(';');
      var service = {service_name : serviceInfo[3], service_type : serviceInfo[4], domain : serviceInfo[5]};

      if(serviceInfo[0] == "="){
        service.host         = serviceInfo[7];
        service.hostname     = serviceInfo[6];
        service.port         = serviceInfo[8];
        logger("Add service ", service);
        this.emit(AVAHI_BROWSE.EVENT_SERVICE_UP, service);
      }

      if(serviceInfo[0] == "-"){
        logger("Rmv service", service);
        this.emit(AVAHI_BROWSE.EVENT_SERVICE_DOWN, service);
      }
    });
  }
}

AVAHI_BROWSE.EVENT_ERROR        = 'avahiError';
AVAHI_BROWSE.EVENT_SERVICE_UP   = 'serviceUp';
AVAHI_BROWSE.EVENT_SERVICE_DOWN = 'serviceDown';

module.exports = AVAHI_BROWSE;
