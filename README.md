# Open Collective Transparency Page React Component

> A React Component to integrate a transparency page of your collective into your project

[![NPM](https://img.shields.io/npm/v/@co-labs/oc-transparency-page.svg)](https://www.npmjs.com/package/@co-labs/oc-transparency-page) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm i @co-labs/oc-transparency-page
```

## Usage

```jsx
import React from 'react'

import TransparencyPage from 'oc-transparency-page'
import 'oc-transparency-page/dist/index.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

/**
 * An Open Collective Api Key is highly recommended !
 * @type {string}
 */
const apiKey = '';

const client = new ApolloClient({
  uri: 'https://api.opencollective.com/graphql/v2'+apiKey,
  cache: new InMemoryCache()
});

const App = () => {
  return <ApolloProvider client={client}>
    <TransparencyPage client={client} slug={'co-labs'} messages={{'allExpensesFrom' : 'Toutes les dépenses du {date}'}} />
  </ApolloProvider>
}

export default App
```

## How to overwrite messages ?

You can customize the messages by including your own labels inside the messages props

## License

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/co-labs/oc-transparency-page) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.

MIT © [Co-Labs](https://github.com/co-labs)
