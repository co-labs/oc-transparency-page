function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var client = require('@apollo/client');
var reactIntl = require('react-intl');
var styles$1 = require('@material-ui/core/styles');
var Grid = _interopDefault(require('@material-ui/core/Grid'));
var lodash = require('lodash');
var moment = _interopDefault(require('moment'));
var reactChartjs2 = require('react-chartjs-2');
var PropTypes = _interopDefault(require('prop-types'));
var Table = _interopDefault(require('@material-ui/core/Table'));
var TableBody = _interopDefault(require('@material-ui/core/TableBody'));
var TableCell = _interopDefault(require('@material-ui/core/TableCell'));
var TableContainer = _interopDefault(require('@material-ui/core/TableContainer'));
var TableHead = _interopDefault(require('@material-ui/core/TableHead'));
var TableRow = _interopDefault(require('@material-ui/core/TableRow'));
var TableFooter = _interopDefault(require('@material-ui/core/TableFooter'));
var TablePagination = _interopDefault(require('@material-ui/core/TablePagination'));
var Paper = _interopDefault(require('@material-ui/core/Paper'));
var IconButton = _interopDefault(require('@material-ui/core/IconButton'));
var FirstPageIcon = _interopDefault(require('@material-ui/icons/FirstPage'));
var KeyboardArrowLeft = _interopDefault(require('@material-ui/icons/KeyboardArrowLeft'));
var KeyboardArrowRight = _interopDefault(require('@material-ui/icons/KeyboardArrowRight'));
var LastPageIcon = _interopDefault(require('@material-ui/icons/LastPage'));

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

var styles = {"container":"_1Lxpd","title":"_2KezC","logo":"_Lw2P8"};

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

var BarChart = function BarChart(_ref) {
  var expenses = _ref.expenses;
  var periods = [];
  var cats = [];
  expenses = lodash.orderBy(expenses, function (item) {
    return item.createdAt;
  });
  expenses.map(function (item) {
    var month = new moment(item.createdAt).format('MM/YYYY');
    var monthKey = periods.findIndex(function (i) {
      return i === month;
    });

    if (monthKey === -1) {
      monthKey = periods.push(month);
      monthKey--;
    }

    console.log('Month', monthKey);
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
      }
    }

    if (typeof cats[catKey] !== 'undefined') {
      if (typeof cats[catKey].data[monthKey] === 'undefined') {
        cats[catKey].data[monthKey] = 0;
      }

      cats[catKey].data[monthKey] += item.amount / 100;
    }
  });
  cats.map(function (i, k) {
    cats[k].backgroundColor = generateRainbow(cats.length, k);
    cats[k].borderColor = generateRainbow(cats.length, k);
  });
  var formattedData = {
    labels: periods,
    datasets: cats
  };
  return /*#__PURE__*/React__default.createElement(reactChartjs2.Bar, {
    data: formattedData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2
    }
  });
};

var useStyles1 = styles$1.makeStyles(function (theme) {
  return {
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5)
    }
  };
});

function TablePaginationActions(props) {
  var classes = useStyles1();
  var theme = styles$1.useTheme();
  var count = props.count,
      page = props.page,
      rowsPerPage = props.rowsPerPage,
      onChangePage = props.onChangePage;

  var handleFirstPageButtonClick = function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  };

  var handleBackButtonClick = function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  };

  var handleNextButtonClick = function handleNextButtonClick(event) {
    onChangePage(event, page + 1);
  };

  var handleLastPageButtonClick = function handleLastPageButtonClick(event) {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/React__default.createElement(IconButton, {
    onClick: handleFirstPageButtonClick,
    disabled: page === 0,
    "aria-label": "first page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React__default.createElement(LastPageIcon, null) : /*#__PURE__*/React__default.createElement(FirstPageIcon, null)), /*#__PURE__*/React__default.createElement(IconButton, {
    onClick: handleBackButtonClick,
    disabled: page === 0,
    "aria-label": "previous page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React__default.createElement(KeyboardArrowRight, null) : /*#__PURE__*/React__default.createElement(KeyboardArrowLeft, null)), /*#__PURE__*/React__default.createElement(IconButton, {
    onClick: handleNextButtonClick,
    disabled: page >= Math.ceil(count / rowsPerPage) - 1,
    "aria-label": "next page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React__default.createElement(KeyboardArrowLeft, null) : /*#__PURE__*/React__default.createElement(KeyboardArrowRight, null)), /*#__PURE__*/React__default.createElement(IconButton, {
    onClick: handleLastPageButtonClick,
    disabled: page >= Math.ceil(count / rowsPerPage) - 1,
    "aria-label": "last page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React__default.createElement(FirstPageIcon, null) : /*#__PURE__*/React__default.createElement(LastPageIcon, null)));
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

var ExpensesTable = function ExpensesTable(_ref) {
  var expenses = _ref.expenses;
  var rows = expenses;

  var _React$useState = React__default.useState(0),
      page = _React$useState[0],
      setPage = _React$useState[1];

  var _React$useState2 = React__default.useState(5),
      rowsPerPage = _React$useState2[0],
      setRowsPerPage = _React$useState2[1];

  var handleChangePage = function handleChangePage(event, newPage) {
    setPage(newPage);
  };

  var handleChangeRowsPerPage = function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  var emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  return /*#__PURE__*/React__default.createElement(TableContainer, {
    component: Paper
  }, /*#__PURE__*/React__default.createElement(Table, {
    "aria-label": "simple table"
  }, /*#__PURE__*/React__default.createElement(TableHead, null, /*#__PURE__*/React__default.createElement(TableRow, null, /*#__PURE__*/React__default.createElement(TableCell, {
    align: "left"
  }, "Description"), /*#__PURE__*/React__default.createElement(TableCell, {
    align: "left"
  }, "Amount"), /*#__PURE__*/React__default.createElement(TableCell, {
    align: "right"
  }, "Status"), /*#__PURE__*/React__default.createElement(TableCell, {
    align: "right"
  }, "Tags"))), /*#__PURE__*/React__default.createElement(TableBody, null, (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(function (row) {
    return /*#__PURE__*/React__default.createElement(TableRow, {
      key: row.id
    }, /*#__PURE__*/React__default.createElement(TableCell, {
      component: "th",
      scope: "row"
    }, row.description), /*#__PURE__*/React__default.createElement(TableCell, {
      style: {
        width: 160
      },
      align: "right"
    }, row.amount / 100, " ", row.currency), /*#__PURE__*/React__default.createElement(TableCell, {
      style: {
        width: 160
      },
      align: "right"
    }, row.status), /*#__PURE__*/React__default.createElement(TableCell, {
      style: {
        width: 160
      },
      align: "right"
    }, row.tags));
  }), emptyRows > 0 && /*#__PURE__*/React__default.createElement(TableRow, {
    style: {
      height: 53 * emptyRows
    }
  }, /*#__PURE__*/React__default.createElement(TableCell, {
    colSpan: 6
  }))), /*#__PURE__*/React__default.createElement(TableFooter, null, /*#__PURE__*/React__default.createElement(TableRow, null, /*#__PURE__*/React__default.createElement(TablePagination, {
    rowsPerPageOptions: [5, 10, 25, {
      label: 'All',
      value: -1
    }],
    colSpan: 3,
    count: rows.length,
    rowsPerPage: rowsPerPage,
    page: page,
    SelectProps: {
      inputProps: {
        'aria-label': 'rows per page'
      },
      "native": true
    },
    onChangePage: handleChangePage,
    onChangeRowsPerPage: handleChangeRowsPerPage,
    ActionsComponent: TablePaginationActions
  })))));
};

var PieChart = function PieChart(_ref) {
  var expenses = _ref.expenses;
  var labels = [];
  var datasets = [{
    data: [],
    backgroundColor: [],
    hoverBackgroundColor: []
  }];
  expenses = lodash.orderBy(expenses, function (item) {
    return item.createdAt;
  });
  expenses.map(function (item) {
    var _item$tags$;

    var label = (_item$tags$ = item.tags[0]) != null ? _item$tags$ : 'undefined';
    var labelKey = labels.findIndex(function (i) {
      return i === label;
    });

    if (labelKey === -1) {
      labelKey = labels.push(label);
      datasets[0].data[labelKey - 1] = item.amount / 100;
    } else {
      datasets[0].data[labelKey] += item.amount / 100;
    }
  });
  labels.map(function (i, k) {
    datasets[0].backgroundColor[k] = generateRainbow(labels.length, k);
    datasets[0].hoverBackgroundColor[k] = generateRainbow(labels.length, k);
  });
  var formattedData = {
    labels: labels,
    datasets: datasets
  };
  return /*#__PURE__*/React__default.createElement(reactChartjs2.Doughnut, {
    data: formattedData,
    options: {
      maintainAspectRatio: true,
      aspectRatio: 1,
      responsive: true
    }
  });
};

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  query ExpensesPage(\n    $account: AccountReferenceInput!\n    $slug: String!\n    $offset: Int!\n    $dateFrom: ISODateTime!\n  ) {\n    expenses(\n      account: $account\n      orderBy: { field: CREATED_AT, direction: ASC }\n      offset: $offset\n      limit: 100\n      status: PAID\n      dateFrom: $dateFrom\n    ) {\n      offset\n      totalCount\n      limit\n      nodes {\n        id\n        amount\n        tags\n        description\n        currency\n        status\n        createdAt\n      }\n    }\n    account(slug: $slug) {\n      id\n      imageUrl\n      name\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var useStyles = styles$1.makeStyles(function (theme) {
  return {
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
  };
});
var ALL_EXPENSES = client.gql(_templateObject());

var TransparencyPage = function TransparencyPage(_ref) {
  var slug = _ref.slug,
      locale = _ref.locale,
      messages = _ref.messages,
      date = _ref.date;
  var classes = useStyles();

  var _useState = React.useState(800),
      width = _useState[0];

  var _useState2 = React.useState(300),
      height = _useState2[0];

  var offset = 0;
  var dateFrom = React.useState(date != null ? date : '2001-01-01');

  var _useQuery = client.useQuery(ALL_EXPENSES, {
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

  if (loading) return /*#__PURE__*/React__default.createElement("p", null, "Loading...");
  if (error) return /*#__PURE__*/React__default.createElement("p", null, "Error :(");
  var account = data.account;
  var expenses = data.expenses.nodes;
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

  if (!messages) {
    messages = {};
  }

  if (!locale) {
    locale = 'en';
  }

  return /*#__PURE__*/React__default.createElement(reactIntl.IntlProvider, {
    locale: locale,
    defaultLocale: "en",
    messages: messages
  }, /*#__PURE__*/React__default.createElement("div", {
    className: styles.container
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "logo"
  }, /*#__PURE__*/React__default.createElement("img", {
    className: styles.header__logo,
    src: account.imageUrl,
    alt: ""
  })), /*#__PURE__*/React__default.createElement("h1", {
    className: "title"
  }, account.name), /*#__PURE__*/React__default.createElement("div", {
    className: "content",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React__default.createElement(Grid, {
    container: true,
    className: classes.root,
    spacing: 2
  }, /*#__PURE__*/React__default.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 12,
    md: 8,
    lg: 8,
    style: {
      position: 'relative',
      minHeight: 100,
      minWidth: 500
    }
  }, /*#__PURE__*/React__default.createElement(BarChart, {
    expenses: expenses
  })), /*#__PURE__*/React__default.createElement(Grid, {
    item: true,
    xs: 12,
    sm: 12,
    md: 4,
    lg: 4,
    style: {
      position: 'relative',
      minHeight: 500,
      minWidth: 500
    }
  }, /*#__PURE__*/React__default.createElement(PieChart, {
    expenses: expenses
  }))), /*#__PURE__*/React__default.createElement(ExpensesTable, {
    expenses: expenses,
    width: width,
    height: height
  }))));
};

module.exports = TransparencyPage;
//# sourceMappingURL=index.js.map
