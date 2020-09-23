import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { orderBy } from 'lodash'
import moment from 'moment'
import generateRainbow from '../utils/generateRainbow'
import { FormattedMessage, IntlProvider } from 'react-intl'
import styles from '../styles.module.css'
import { Bar } from 'react-chartjs-2'

/**
 * Transparency page component
 * @param slug The account slug
 * @returns {JSX.Element}
 * @constructor
 */
const BarChart = ({ formattedBarData, width, height }) => {

  return (
    <Bar
      data={formattedBarData}
      width={width}
      height={height}
      options={{
        maintainAspectRatio: true
      }}
    />
  )
}

export default BarChart
