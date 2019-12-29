import React from 'react'
import PropTypes from 'prop-types'

export default function SensorValue (props) {
  return (
    <span className="sensor-value">
      {props.value ? props.value : '…'}
      {props.suffix}
    </span>
  )
}

SensorValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string]),
  suffix: PropTypes.string,
}
