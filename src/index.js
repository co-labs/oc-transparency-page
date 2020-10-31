import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { IntlProvider, FormattedMessage } from 'react-intl'
import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import { useStyles } from './theme'
import BarChart from './components/BarChart'
import ExpensesTable from './components/ExpensesTable'
import PieChart from './components/PieChart'
import { useWindowSize } from "./utils/useWindowSize";

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
  const classes = useStyles()
  const [width, height] = useWindowSize()
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
  const expenses = data.expenses.nodes

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

  if (!messages) {
    messages = {}
  }

  if (!locale) {
    locale = 'en'
  }

  return (
    <IntlProvider locale={locale} defaultLocale='en' messages={messages}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <h1 className={classes.header__title}>
            <img className={classes.header__logo} src={account.imageUrl} alt='' />
            {account.name}
          </h1>
        </div>
        <div className={classes.body}>
          <Grid className={classes.charts} container spacing={5}>
            <Grid className={classes.charts__bar} item xs={12} md={8}>
              <BarChart expenses={expenses} width={width} height={height} />
            </Grid>
            <Grid className={classes.charts__pie} item xs={12} md={4}>
              <PieChart expenses={expenses} width={width} height={height} />
            </Grid>
            <Grid className={classes.charts__table} item xs={12}>
              <ExpensesTable expenses={expenses} width={width} height={height} />
            </Grid>
          </Grid>
        </div>
      </div>
    </IntlProvider>
  )
}

export * from './components/BarChart'
export * from './components/PieChart'
export * from './components/ExpensesTable'

export default TransparencyPage
