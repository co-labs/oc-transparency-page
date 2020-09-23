import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Bar } from 'react-chartjs-2';
import { IntlProvider, FormattedMessage } from 'react-intl';
import moment from 'moment';
import { orderBy } from 'lodash';

var styles = {"title":"_styles-module__title__2KezC","header__logo":"_styles-module__header__logo__1XkLR"};

var generateRainbow = ((numOfSteps, step) => {
  let r, g, b;
  const h = step / numOfSteps;
  const i = ~~(h * 6);
  const f = h * 6 - i;
  const q = 1 - f;

  switch (i % 6) {
    case 0:
      r = 1;
      g = f;
      b = 0;
      break;

    case 1:
      r = q;
      g = 1;
      b = 0;
      break;

    case 2:
      r = 0;
      g = 1;
      b = f;
      break;

    case 3:
      r = 0;
      g = q;
      b = 1;
      break;

    case 4:
      r = f;
      g = 0;
      b = 1;
      break;

    case 5:
      r = 1;
      g = 0;
      b = q;
      break;
  }

  return `#${`00${(~~(r * 255)).toString(16)}`.slice(-2)}${`00${(~~(g * 255)).toString(16)}`.slice(-2)}${`00${(~~(b * 255)).toString(16)}`.slice(-2)}`;
});

let _ = t => t,
    _t;
const ALL_EXPENSES = gql(_t || (_t = _`
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
`));

const TransparencyPage = ({
  slug,
  locale,
  messages,
  date
}) => {
  const [width] = useState(800);
  const [height] = useState(300);
  const offset = 0;
  const dateFrom = useState(date ?? '2001-01-01');
  const {
    loading,
    error,
    data,
    fetchMore
  } = useQuery(ALL_EXPENSES, {
    variables: {
      account: {
        slug: slug
      },
      slug,
      offset,
      dateFrom
    }
  });
  if (loading) return /*#__PURE__*/React.createElement("p", null, "Loading...");
  if (error) return /*#__PURE__*/React.createElement("p", null, "Error :(");
  const account = data.account;
  let expenses = data.expenses.nodes;
  const periods = [];
  const cats = [];
  fetchMore({
    variables: {
      offset: data.expenses.nodes.length
    },
    updateQuery: (prev, {
      fetchMoreResult
    }) => {
      if (!fetchMoreResult) return prev;
      fetchMoreResult.expenses.nodes = prev.expenses.nodes.concat(fetchMoreResult.expenses.nodes);
      return Object.assign({}, fetchMoreResult);
    }
  }).then(res => {
    console.log('Res', res);
  });
  console.log('Count', expenses.length);
  expenses = orderBy(expenses, item => item.createdAt);
  expenses.map(item => {
    const month = new moment(item.createdAt).format('MM/YYYY');
    let monthKey = periods.findIndex(i => i === month);

    if (monthKey === -1) {
      monthKey = periods.push(month);
    }

    let catKey = cats.findIndex(i => i.label === item.tags[0]);

    if (catKey === -1) {
      if (typeof item.tags[0] !== 'undefined') {
        catKey = cats.push({
          label: item.tags[0],
          data: [],
          backgroundColor: null,
          borderColor: null,
          borderWidth: 1,
          stack: 'default'
        });
        catKey = catKey - 1;
        cats[catKey].backgroundColor = generateRainbow(12, catKey + 1);
        cats[catKey].borderColor = generateRainbow(12, catKey + 1);
      }
    }

    if (typeof cats[catKey] !== 'undefined') {
      if (typeof cats[catKey].data[monthKey] === 'undefined') {
        cats[catKey].data[monthKey] = 0;
      }

      cats[catKey].data[monthKey] += item.amount / 100;
    }
  });
  const formattedBarData = {
    labels: periods,
    datasets: cats
  };

  if (!messages) {
    messages = {};
  }

  if (!locale) {
    locale = 'en';
  }

  return /*#__PURE__*/React.createElement(IntlProvider, {
    locale: locale,
    defaultLocale: "en",
    messages: messages
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.title
  }, /*#__PURE__*/React.createElement("h1", {
    className: "header"
  }, /*#__PURE__*/React.createElement("img", {
    className: styles.header__logo,
    src: account.imageUrl,
    alt: ""
  }), account.name), /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement(FormattedMessage, {
    id: "allExpensesFrom",
    defaultMessage: "All expenses from {date}",
    values: {
      date: moment(dateFrom, 'YYYY-MM-DD').format('DD/MM/YYYY')
    }
  })), /*#__PURE__*/React.createElement(Bar, {
    data: formattedBarData,
    width: width,
    height: height,
    options: {
      maintainAspectRatio: true
    }
  }))));
};

export default TransparencyPage;
//# sourceMappingURL=index.modern.js.map
