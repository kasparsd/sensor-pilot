import '@babel/polyfill'
import './styles/main.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
  })
}

ReactDOM.render(
  <App bluetoothApiAvailable={'bluetooth' in navigator} />,
  document.getElementById('root'),
)
