import React, { useState } from 'react'
import styles from './styles.module.css'
import { useQuery, gql } from '@apollo/client'
import { IntlProvider, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import BarChart from './components/BarChart'
import ExpensesTable from './components/ExpensesTable'
import PieChart from './components/PieChart'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing(2)
  }
}))

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
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={8}>
              <BarChart expenses={expenses} width={width} height={height} />
            </Grid>
            <Grid item xs={4}>
              <PieChart expenses={expenses} width={width} height={height} />
            </Grid>
          </Grid>
          <ExpensesTable expenses={expenses} width={width} height={height} />
        </div>
      </div>
    </IntlProvider>
  )
}

export * from './components/BarChart'
export * from './components/PieChart'
export * from './components/ExpensesTable'

export default TransparencyPage
