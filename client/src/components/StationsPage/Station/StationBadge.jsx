import React from 'react'

const StationBadge = ({ title }) => {
  let type = 'badge-primary'

  switch (title) {
    case 'Air Quolity Index':
      type = 'badge-success'
      break
    case 'Humidity':
      type = 'badge-primary'
      break
    case 'PM10':
      type = 'badge-dark'
      break
    case 'PM2.5':
      type = 'badge-light'
      break
    case 'Pressure':
      type = 'badge-secondary'
      break
    case 'Temperature':
      type = 'badge-warning'
      break
    default:
      break
  }

  return <span class={`badge badge-pill ${type} ms-2`}>{title}</span>
}

export default StationBadge
