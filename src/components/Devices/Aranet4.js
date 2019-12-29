import React from 'react'
import BleDevice from '../../ble-device'
import SensorValue from '../SensorValue'

const decoder = new TextDecoder('utf-8') // TODO: Add a polyfill for this.
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
      },
    },
  },
  device: {
    serviceUuid: 'device_information',
    resolvers: {
      manufacturer_name_string: (value) => decoder.decode(value),
      model_number_string: (value) => decoder.decode(value),
      serial_number_string: (value) => decoder.decode(value),
      hardware_revision_string: (value) => decoder.decode(value),
      software_revision_string: (value) => decoder.decode(value),
    },
  },
}

const aranet4Device = new BleDevice(
  navigator.bluetooth,
  {
    filters: [
      {
        services: [SENSOR_SERVICE_UUID],
      },
    ],
    optionalServices: [
      'device_information',
      'battery_service',
    ],
  },
)

export default class Aranet4 extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      connected: false,
      lastUpdated: null,
      error: null,
      sensorValues: {
        co2: null,
        temperature: null,
        pressure: null,
        humidity: null,
        battery: null,
      },
    }

    this.toggleConnection = this.toggleConnection.bind(this)
  }

  toggleConnection () {
    aranet4Device.serviceCharacteristics(
      aranetServices.sensor.serviceUuid,
      aranetServices.sensor.resolvers,
    ).then(sensorReadings => {
      this.setState({
        error: null,
        connected: true,
        sensorValues: {
          co2: String(sensorReadings[0].co2),
          temperature: String(sensorReadings[0].temperature),
          pressure: String(sensorReadings[0].pressure),
          humidity: String(sensorReadings[0].humidity),
          battery: String(sensorReadings[0].battery),
        },
      })
    }).catch((err) => {
      this.setState({
        error: err.toString(),
        connected: false,
      })
    })
  }

  render () {
    return (
      <div>
        <div className="card-header d-flex flex-row justify-content-between">
          <h3 className="flex-grow-1">
            Aranet4
            <a href="https://aranet4.com" className="btn btn-link btn-sm align-middle" title="Learn more about Aranet4">Learn More</a>
          </h3>
          <input type="button" className="btn btn-primary" onClick={this.toggleConnection} value={this.state.connected ? 'Refresh' : 'Connect'} />
        </div>
        <div className="card-body">
          {this.state.error
            ? <div className="alert alert-danger" role="alert">
              <code>{this.state.error}</code>
            </div>
            : null}
          <table className="table table-borderless aranet-sensor-data">
            <tbody>
              <tr>
                <th>CO<sub>2</sub></th>
                <td><SensorValue value={this.state.sensorValues.co2} suffix="ppm" /></td>
              </tr>
              <tr>
                <th>Temperature</th>
                <td><SensorValue value={this.state.sensorValues.temperature} suffix="°C" /></td>
              </tr>
              <tr>
                <th>Pressure</th>
                <td><SensorValue value={this.state.sensorValues.pressure} suffix="hPa" /></td>
              </tr>
              <tr>
                <th>Humidity</th>
                <td><SensorValue value={this.state.sensorValues.humidity} suffix="%" /></td>
              </tr>
              <tr>
                <th>Battery</th>
                <td><SensorValue value={this.state.sensorValues.battery} suffix="%" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
