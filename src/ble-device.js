/* global BluetoothUUID */

export default class BleDevice {
  constructor (bluetoothApi, deviceOptions) {
    this.bluetoothApi = bluetoothApi
    this.deviceOptions = deviceOptions

    this.server = null
    this.device = null
  }

  isConnected () {
    return (this.server && this.server.connected)
  }

  getDevice () {
    return this.bluetoothApi.requestDevice(this.deviceOptions)
      .then(device => device.gatt.connect())
  }

  getGATTServer () {
    if (this.isConnected()) {
      return Promise.resolve(this.server)
    }

    return this.getDevice()
      .then(server => {
        this.server = server

        return server
      })
  }

  serviceCharacteristics (serviceUuid, characteristicResolvers) {
    const characteristicUuids = Object.keys(characteristicResolvers)
      .map(name => BluetoothUUID.getCharacteristic(name))

    return this.getGATTServer()
      .then(server => server.getPrimaryService(serviceUuid))
      .then(service => service.getCharacteristics())
      .then(characteristics => {
        return Promise.all(
          characteristics
            .filter(characteristic => characteristicUuids.includes(characteristic.uuid))
            .map(async characteristic => ({
              uuid: characteristic.uuid,
              value: await characteristic.readValue(),
            })),
        )
      })
      .then(values => values.map(value => ({
        uuid: value.uuid,
        value: characteristicResolvers[value.uuid](value.value),
      })))
  }
}
