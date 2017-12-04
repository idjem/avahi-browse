# Installation
```
npm install avahi-browse
```

# Usage sample
```
const AVAHI_BROWSE = require('avahi-browse');
const browser = new AVAHI_BROWSE();

browser.on(AVAHI_BROWSE.EVENT_SERVICE_UP, function(service){
  console.log(service);
});

browser.on(AVAHI_BROWSE.EVENT_SERVICE_DOWN, function(service){
  console.log("Service down ", service);
});

browser.start();

setTimeout(browser.stop, 4000);

```