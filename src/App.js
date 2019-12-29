import React from 'react'
import PropTypes from 'prop-types'

import DeviceList from './components/DeviceList'

export default class App extends React.Component {
  render () {
    return (
      <div>
        {
          this.props.bluetoothApiAvailable
            ? null
            : <div className="alert alert-danger" role="alert">
                We couldn&rsquo;t detect support for the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API">Web Bluetooth API</a> in your web browser.
                Please try either Google Chrome (desktop or Android), Edge or <a href="https://caniuse.com/web-bluetooth">any of the supported browsers</a>.
            </div>
        }
        <DeviceList enabled={this.props.bluetoothApiAvailable} />
      </div>
    )
  }
}

App.propTypes = {
  bluetoothApiAvailable: PropTypes.bool.isRequired,
}
