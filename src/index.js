import './styles/main.scss'

import ble from './ble'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

function connect() {
  navigator.bluetooth.requestDevice({
    filters: [
      {
        namePrefix: 'Aranet',
      },
    ],
  }).then((device) => {
    return device.gatt.connect();
  }).then(function(server) {
    return server.getPrimaryService(0xf0cd140095da4f4b9ac8aa55d312af0c);
  }).then(function(service) {
    console.log('service', service)
    return service.getCharacteristic(0xf0cd300195da4f4b9ac8aa55d312af0c);
  }).then(function(characteristic) {
    console.log('characteristic', characteristic);
  }).catch(function(error) {
      console.error('Connection failed!', error);
  });
}

if ('bluetooth' in navigator) {
  document.querySelector('#ble-connect').addEventListener(
    'click',
    event => {
      connect();
    });
} else {
  // Display browser compatability warning.
}
