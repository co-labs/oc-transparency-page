import React, { useState } from 'react'
import styles from './styles.module.css'
import { useQuery, gql } from '@apollo/client'
import { Bar } from 'react-chartjs-2'
import { IntlProvider, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { orderBy } from 'lodash'
import generateRainbow from './utils/generateRainbow'

const ALL_EXPENSES = gql`
  query ExpensesPage(
    $account: AccountReferenceInput!
    $slug: String!
    $offset: Int!
    $dateFrom: ISODateTime!
  ) {
    expenses(
      account: $account
      orderBy: { field: CREATED_AT, direction: ASC }
      offset: $offset
      limit: 100
      status: PAID
      dateFrom: $dateFrom
    ) {
      offset
      totalCount
      limit
      nodes {
        id
        amount
        tags
        description
        currency
        status
        createdAt
      }
    }
    account(slug: $slug) {
      id
      imageUrl
      name
    }
  }
`
/**
 * Transparency page component
 * @param slug The account slug
 * @returns {JSX.Element}
 * @constructor
 */
const TransparencyPage = ({ slug, locale, messages, date }) => {
  const [width] = useState(800)
  const [height] = useState(300)
  const offset = 0
  const dateFrom = useState(date ?? '2001-01-01')
  /**
   * Get all expenses
   */
  const { loading, error, data, fetchMore } = useQuery(ALL_EXPENSES, {
    variables: {
      account: { slug: slug },
      slug,
      offset,
      dateFrom
    }
  })
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const account = data.account

  let expenses = data.expenses.nodes

  const periods = []
  const cats = []

  fetchMore({
    variables: {
      offset: data.expenses.nodes.length
    },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) return prev

      fetchMoreResult.expenses.nodes = prev.expenses.nodes.concat(
        fetchMoreResult.expenses.nodes
      )

      return Object.assign({}, fetchMoreResult)
    }
  }).then((res) => {
    console.log('Res', res)
  })

  console.log('Count', expenses.length)

  expenses = orderBy(expenses, (item) => item.createdAt)

  expenses.map((item) => {
    // eslint-disable-next-line new-cap
    const month = new moment(item.createdAt).format('MM/YYYY')

    let monthKey = periods.findIndex((i) => i === month)

    if (monthKey === -1) {
      monthKey = periods.push(month)
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

        cats[catKey].backgroundColor = generateRainbow(12, catKey + 1)
        cats[catKey].borderColor = generateRainbow(12, catKey + 1)
      }
    }

    if (typeof cats[catKey] !== 'undefined') {
      if (typeof cats[catKey].data[monthKey] === 'undefined') {
        cats[catKey].data[monthKey] = 0
      }

      cats[catKey].data[monthKey] += item.amount / 100
    }
  })

  const formattedBarData = {
    labels: periods,
    datasets: cats
  }

  if (!messages) {
    messages = {}
  }

  if (!locale) {
    locale = 'en'
  }

  return (
    <IntlProvider locale={locale} defaultLocale='en' messages={messages}>
      <div className={styles.title}>
        <h1 className='header'>
          <img className={styles.header__logo} src={account.imageUrl} alt='' />
          {account.name}
        </h1>
        <div className='content'>
          <h2>
            <FormattedMessage
              id='allExpensesFrom'
              defaultMessage='All expenses from {date}'
              values={{
                date: moment(dateFrom, 'YYYY-MM-DD').format('DD/MM/YYYY')
              }}
            />
          </h2>
          <Bar
            data={formattedBarData}
            width={width}
            height={height}
            options={{
              maintainAspectRatio: true
            }}
          />
        </div>
      </div>
    </IntlProvider>
  )
}

export default TransparencyPage
