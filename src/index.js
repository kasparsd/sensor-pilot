import "@babel/polyfill";
import './styles/main.scss'
import Ble from './ble'

const decoder = new TextDecoder('utf-8')

const SENSOR_SERVICE_UUID = 'f0cd1400-95da-4f4b-9ac8-aa55d312af0c'

const aranetServices = {

  sensor: {
    serviceUuid: SENSOR_SERVICE_UUID,
    resolvers: {
      'f0cd3001-95da-4f4b-9ac8-aa55d312af0c': (value) => {
        return {
          co2: value.getUint16(0, true),
          temperature: value.getUint16(2, true) / 20,
          pressure: value.getUint16(4, true) / 10,
          humidity: value.getUint8(6),
          battery: value.getUint8(7),
        }
      }
    }
  },

  device: {
    serviceUuid: 'device_information',
    resolvers: {
      'manufacturer_name_string': (value) => decoder.decode(value),
      'model_number_string': (value) => decoder.decode(value),
      'serial_number_string': (value) => decoder.decode(value),
      'hardware_revision_string': (value) => decoder.decode(value),
      'software_revision_string': (value) => decoder.decode(value),
    }
  }

}

const ble = new Ble(
  navigator.bluetooth,
  {
    filters: [
      {
        services: [SENSOR_SERVICE_UUID]
      }
    ],
    optionalServices: [
      'device_information',
      'battery_service',
    ],
  }
)

async function connect() {
  const sensorValues = await ble.serviceCharacteristics(
    aranetServices.sensor.serviceUuid,
    aranetServices.sensor.resolvers
  )

  document.querySelectorAll('.aranet-sensor-data .sensor-value').forEach(node => {
    if (node.dataset.value in sensorValues[0]) {
      node.textContent = sensorValues[0][node.dataset.value]
    }
  })
}

if ('bluetooth' in navigator) {
  document.querySelector('#ble-connect')
    .addEventListener('click', () => {
      connect();
    });
} else {
  // Display browser compatability warning.
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
