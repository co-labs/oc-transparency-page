import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Bar } from 'react-chartjs-2';
import { IntlProvider, FormattedMessage } from 'react-intl';
import moment from 'moment';
import { orderBy } from 'lodash';

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

var styles = {"title":"_2KezC","header__logo":"_1XkLR"};

var generateRainbow = (function (numOfSteps, step) {
  var r, g, b;
  var h = step / numOfSteps;
  var i = ~~(h * 6);
  var f = h * 6 - i;
  var q = 1 - f;

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

  return "#" + ("00" + (~~(r * 255)).toString(16)).slice(-2) + ("00" + (~~(g * 255)).toString(16)).slice(-2) + ("00" + (~~(b * 255)).toString(16)).slice(-2);
});

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  query ExpensesPage(\n    $account: AccountReferenceInput!\n    $slug: String!\n    $offset: Int!\n    $dateFrom: ISODateTime!\n  ) {\n    expenses(\n      account: $account\n      orderBy: { field: CREATED_AT, direction: ASC }\n      offset: $offset\n      limit: 100\n      status: PAID\n      dateFrom: $dateFrom\n    ) {\n      offset\n      totalCount\n      limit\n      nodes {\n        id\n        amount\n        tags\n        description\n        currency\n        status\n        createdAt\n      }\n    }\n    account(slug: $slug) {\n      id\n      imageUrl\n      name\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var ALL_EXPENSES = gql(_templateObject());

var TransparencyPage = function TransparencyPage(_ref) {
  var slug = _ref.slug,
      locale = _ref.locale,
      messages = _ref.messages,
      date = _ref.date;

  var _useState = useState(800),
      width = _useState[0];

  var _useState2 = useState(300),
      height = _useState2[0];

  var offset = 0;
  var dateFrom = useState(date != null ? date : '2001-01-01');

  var _useQuery = useQuery(ALL_EXPENSES, {
    variables: {
      account: {
        slug: slug
      },
      slug: slug,
      offset: offset,
      dateFrom: dateFrom
    }
  }),
      loading = _useQuery.loading,
      error = _useQuery.error,
      data = _useQuery.data,
      fetchMore = _useQuery.fetchMore;

  if (loading) return /*#__PURE__*/React.createElement("p", null, "Loading...");
  if (error) return /*#__PURE__*/React.createElement("p", null, "Error :(");
  var account = data.account;
  var expenses = data.expenses.nodes;
  var periods = [];
  var cats = [];
  fetchMore({
    variables: {
      offset: data.expenses.nodes.length
    },
    updateQuery: function updateQuery(prev, _ref2) {
      var fetchMoreResult = _ref2.fetchMoreResult;
      if (!fetchMoreResult) return prev;
      fetchMoreResult.expenses.nodes = prev.expenses.nodes.concat(fetchMoreResult.expenses.nodes);
      return Object.assign({}, fetchMoreResult);
    }
  }).then(function (res) {
    console.log('Res', res);
  });
  console.log('Count', expenses.length);
  expenses = orderBy(expenses, function (item) {
    return item.createdAt;
  });
  expenses.map(function (item) {
    var month = new moment(item.createdAt).format('MM/YYYY');
    var monthKey = periods.findIndex(function (i) {
      return i === month;
    });

    if (monthKey === -1) {
      monthKey = periods.push(month);
    }

    var catKey = cats.findIndex(function (i) {
      return i.label === item.tags[0];
    });

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
  var formattedBarData = {
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
