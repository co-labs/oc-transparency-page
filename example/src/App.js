import React from 'react'

import TransparencyPage from 'oc-transparency-page'
import 'oc-transparency-page/dist/index.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

/**
 * An Open Collective Api Key is highly recommended
 * @type {string}
 */
const apiKey = '9e8e9328c1bb3cbfb9bf460dacef5e18bd7b87d8'

const client = new ApolloClient({
  uri: 'https://api.opencollective.com/graphql/v2/' + apiKey,
  cache: new InMemoryCache()
})

const App = () => {
  return <ApolloProvider client={client}>
    <TransparencyPage client={client} slug={'co-labs'}
                      date={"2018-01-01"}
                      messages={{ 'allExpensesFrom': 'All expenses from {date}' }} />
  </ApolloProvider>
}

export default App
