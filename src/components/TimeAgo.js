import React from 'react'
import PropTypes from 'prop-types'

export default class TimeAgo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      timeNow: new Date(),
    }
  }

  tick () {
    this.setState({
      timeNow: new Date(),
    })
  }

  componentDidMount () {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  dateToTimestamp (date) {
    return Math.floor(date.getTime() / 1000)
  }

  render () {
    return (
      <span className="time-ago">
        {this.dateToTimestamp(this.state.timeNow) - this.dateToTimestamp(this.props.timestamp)} seconds ago
      </span>
    )
  }
}

TimeAgo.propTypes = {
  timestamp: PropTypes.date,
}
