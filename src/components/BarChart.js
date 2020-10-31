import React from 'react'
import { orderBy } from 'lodash'
import moment from 'moment'
import generateRainbow from '../utils/generateRainbow'
import { Bar } from 'react-chartjs-2'

/**
 * BarChart formatter for expenses
 * @param expenses
 * @param width
 * @param height
 * @returns {JSX.Element}
 * @constructor
 */
const BarChart = ({ expenses, width, height }) => {
  const periods = []
  const cats = []

  expenses = orderBy(expenses, (item) => item.createdAt)

  expenses.map((item) => {
    // eslint-disable-next-line new-cap
    const month = new moment(item.createdAt).format('MM/YYYY')

    let monthKey = periods.findIndex((i) => i === month)

    if (monthKey === -1) {
      monthKey = periods.push(month)
      monthKey--
    }

    let catKey = cats.findIndex((i) => i.label === item.tags[0])

    if (catKey === -1) {
      if (typeof item.tags[0] !== 'undefined') {
        catKey = cats.push({
          label: item.tags[0],
          data: [],
          backgroundColor: null,
          borderColor: null,
          borderWidth: 1,
          stack: 'default'
        })

        catKey = catKey - 1
      }
    }

    if (typeof cats[catKey] !== 'undefined') {
      if (typeof cats[catKey].data[monthKey] === 'undefined') {
        cats[catKey].data[monthKey] = 0
      }

      cats[catKey].data[monthKey] += item.amount / 100
    }
  })

  cats.map((i, k) => {
    cats[k].backgroundColor = generateRainbow(cats.length, k)
    cats[k].borderColor = generateRainbow(cats.length, k)
  })

  const formattedData = {
    labels: periods,
    datasets: cats
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  }

  return (
    <div style={{ height: width > 600 ? 350 : 450, position: 'relative' }}>
      <Bar
        data={formattedData}
        options={options}
      />
    </div>
  )
}

export default BarChart
