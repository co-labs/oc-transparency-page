import React from 'react'
import { orderBy } from 'lodash'
import generateRainbow from '../utils/generateRainbow'
import { Doughnut } from 'react-chartjs-2'

const PieChart = ({ expenses, width, height }) => {
  const labels = []
  const datasets = [
    {
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }
  ]

  expenses = orderBy(expenses, (item) => item.createdAt)

  expenses.map((item) => {
    // eslint-disable-next-line new-cap
    const label = item.tags[0] ?? 'undefined'

    let labelKey = labels.findIndex((i) => i === label)

    if (labelKey === -1) {
      labelKey = labels.push(label)
      datasets[0].data[labelKey - 1] = item.amount / 100
    } else {
      datasets[0].data[labelKey] += item.amount / 100
    }
  })

  labels.map((i, k) => {
    datasets[0].backgroundColor[k] = generateRainbow(labels.length, k)
    datasets[0].hoverBackgroundColor[k] = generateRainbow(labels.length, k)
  })

  const formattedData = {
    labels: labels,
    datasets: datasets
  }

  return (
    <Doughnut
      data={formattedData}
      options={{
        maintainAspectRatio: true
      }}
    />
  )
}

export default PieChart
