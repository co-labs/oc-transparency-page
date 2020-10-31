function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var client = require('@apollo/client');
var reactIntl = require('react-intl');
var moment = _interopDefault(require('moment'));
var Grid = _interopDefault(require('@material-ui/core/Grid'));
var styles = require('@material-ui/core/styles');
var lodash = require('lodash');
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

var useStyles = styles.makeStyles(function (theme) {
  var _body__title, _header__title, _table__head__row__ce, _table__body__row__ce;

  return {
    body: {},
    body__title: (_body__title = {
      fontSize: '1.5em',
      textAlign: 'center'
    }, _body__title[theme.breakpoints.down('xs')] = {
      fontSize: '1.2em'
    }, _body__title),
    charts: {
      flexGrow: 1
    },
    charts__bar: {},
    charts__pie: {},
    charts__table: {},
    header: {
      padding: '.5em',
      textAlign: 'center'
    },
    header__logo: {
      height: '1em !important'
    },
    header__title: (_header__title = {
      fontSize: '2em'
    }, _header__title[theme.breakpoints.down('xs')] = {
      fontSize: '1.6em'
    }, _header__title),
    pagination: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5)
    },
    pagination__first: {},
    pagination__prev: {},
    pagination__next: {},
    pagination__last: {},
    table: {},
    table__head: {},
    table__head__row: {},
    table__head__row__cell: (_table__head__row__ce = {
      fontSize: '1em'
    }, _table__head__row__ce[theme.breakpoints.down('xs')] = {
      fontSize: '.8em',
      padding: 10
    }, _table__head__row__ce),
    table__body: {},
    table__body__row: {},
    table__body__row__cell: (_table__body__row__ce = {
      fontSize: '.9em'
    }, _table__body__row__ce[theme.breakpoints.down('xs')] = {
      fontSize: '.7em',
      padding: 10
    }, _table__body__row__ce),
    table__footer: {},
    table__footer__row: {},
    'table-container': {},
    wrapper: {}
  };
});

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
  var expenses = _ref.expenses,
      width = _ref.width;
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
  var options = {
    maintainAspectRatio: false,
    responsive: true
  };
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      height: width > 600 ? 350 : 450,
      position: 'relative'
    }
  }, /*#__PURE__*/React__default.createElement(reactChartjs2.Bar, {
    data: formattedData,
    options: options
  }));
};

function TablePaginationActions(props) {
  var classes = useStyles();
  var theme = styles.useTheme();
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
    className: classes.pagination
  }, /*#__PURE__*/React__default.createElement(IconButton, {
    className: classes.pagination__first,
    onClick: handleFirstPageButtonClick,
    disabled: page === 0,
    "aria-label": "first page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React__default.createElement(LastPageIcon, null) : /*#__PURE__*/React__default.createElement(FirstPageIcon, null)), /*#__PURE__*/React__default.createElement(IconButton, {
    className: classes.pagination__prev,
    onClick: handleBackButtonClick,
    disabled: page === 0,
    "aria-label": "previous page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React__default.createElement(KeyboardArrowRight, null) : /*#__PURE__*/React__default.createElement(KeyboardArrowLeft, null)), /*#__PURE__*/React__default.createElement(IconButton, {
    className: classes.pagination__next,
    onClick: handleNextButtonClick,
    disabled: page >= Math.ceil(count / rowsPerPage) - 1,
    "aria-label": "next page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React__default.createElement(KeyboardArrowLeft, null) : /*#__PURE__*/React__default.createElement(KeyboardArrowRight, null)), /*#__PURE__*/React__default.createElement(IconButton, {
    className: classes.pagination__last,
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
  var classes = useStyles();
  var rows = expenses;

  var _React$useState = React__default.useState(0),
      page = _React$useState[0],
      setPage = _React$useState[1];

  var _React$useState2 = React__default.useState(10),
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
    className: classes['table-container'],
    component: Paper
  }, /*#__PURE__*/React__default.createElement(Table, {
    className: classes.table,
    "aria-label": "simple table"
  }, /*#__PURE__*/React__default.createElement(TableHead, {
    className: classes.table__head
  }, /*#__PURE__*/React__default.createElement(TableRow, {
    className: classes.table__head__row
  }, /*#__PURE__*/React__default.createElement(TableCell, {
    className: classes.table__head__row__cell,
    align: "left"
  }, "Description"), /*#__PURE__*/React__default.createElement(TableCell, {
    className: classes.table__head__row__cell,
    align: "left"
  }, "Amount"), /*#__PURE__*/React__default.createElement(TableCell, {
    className: classes.table__head__row__cell,
    align: "right"
  }, "Status"), /*#__PURE__*/React__default.createElement(TableCell, {
    className: classes.table__head__row__cell,
    align: "right"
  }, "Tags"))), /*#__PURE__*/React__default.createElement(TableBody, {
    className: classes.table__body
  }, (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(function (row) {
    return /*#__PURE__*/React__default.createElement(TableRow, {
      className: classes.table__body__row,
      key: row.id
    }, /*#__PURE__*/React__default.createElement(TableCell, {
      className: classes.table__body__row__cell,
      component: "th",
      scope: "row"
    }, row.description), /*#__PURE__*/React__default.createElement(TableCell, {
      className: classes.table__body__row__cell,
      style: {
        width: 160
      },
      align: "right"
    }, row.amount / 100, " ", row.currency), /*#__PURE__*/React__default.createElement(TableCell, {
      className: classes.table__body__row__cell,
      style: {
        width: 160
      },
      align: "right"
    }, row.status), /*#__PURE__*/React__default.createElement(TableCell, {
      className: classes.table__body__row__cell,
      style: {
        width: 160
      },
      align: "right"
    }, row.tags));
  }), emptyRows > 0 && /*#__PURE__*/React__default.createElement(TableRow, {
    className: classes.table__body__row,
    style: {
      height: 53 * emptyRows
    }
  }, /*#__PURE__*/React__default.createElement(TableCell, {
    className: classes.table__body__row__cell,
    colSpan: 6
  }))), /*#__PURE__*/React__default.createElement(TableFooter, {
    className: classes.table__footer
  }, /*#__PURE__*/React__default.createElement(TableRow, {
    className: classes.table__footer__row
  }, /*#__PURE__*/React__default.createElement(TablePagination, {
    rowsPerPageOptions: [5, 10, 25, {
      label: 'All',
      value: -1
    }],
    colSpan: 4,
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
  var expenses = _ref.expenses,
      width = _ref.width;
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
  var options = {
    maintainAspectRatio: false,
    responsive: true
  };
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      height: width > 600 ? 300 : 350,
      position: 'relative'
    }
  }, /*#__PURE__*/React__default.createElement(reactChartjs2.Doughnut, {
    data: formattedData,
    options: options
  }));
};

function useWindowSize() {
  var _useState = React.useState([0, 0]),
      size = _useState[0],
      setSize = _useState[1];

  React.useEffect(function () {
    var updateSize = lodash.debounce(function () {
      setSize([window.innerWidth, window.innerHeight]);
    }, 100);
    window.addEventListener('resize', updateSize);
    updateSize();
    return function () {
      return window.removeEventListener('resize', updateSize);
    };
  }, []);
  return size;
}

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  query ExpensesPage(\n    $account: AccountReferenceInput!\n    $slug: String!\n    $offset: Int!\n    $dateFrom: ISODateTime!\n  ) {\n    expenses(\n      account: $account\n      orderBy: { field: CREATED_AT, direction: ASC }\n      offset: $offset\n      limit: 100\n      status: PAID\n      dateFrom: $dateFrom\n    ) {\n      offset\n      totalCount\n      limit\n      nodes {\n        id\n        amount\n        tags\n        description\n        currency\n        status\n        createdAt\n      }\n    }\n    account(slug: $slug) {\n      id\n      imageUrl\n      name\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var ALL_EXPENSES = client.gql(_templateObject());

var TransparencyPage = function TransparencyPage(_ref) {
  var slug = _ref.slug,
      locale = _ref.locale,
      messages = _ref.messages,
      date = _ref.date;
  var classes = useStyles();

  var _useWindowSize = useWindowSize(),
      width = _useWindowSize[0],
      height = _useWindowSize[1];

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
    className: classes.wrapper
  }, /*#__PURE__*/React__default.createElement("div", {
    className: classes.header
  }, /*#__PURE__*/React__default.createElement("h1", {
    className: classes.header__title
  }, /*#__PURE__*/React__default.createElement("img", {
    className: classes.header__logo,
    src: account.imageUrl,
    alt: ""
  }), account.name)), /*#__PURE__*/React__default.createElement("div", {
    className: classes.body
  }, /*#__PURE__*/React__default.createElement(Grid, {
    className: classes.charts,
    container: true,
    spacing: 5
  }, /*#__PURE__*/React__default.createElement(Grid, {
    className: classes.charts__bar,
    item: true,
    xs: 12,
    md: 8
  }, /*#__PURE__*/React__default.createElement(BarChart, {
    expenses: expenses,
    width: width,
    height: height
  })), /*#__PURE__*/React__default.createElement(Grid, {
    className: classes.charts__pie,
    item: true,
    xs: 12,
    md: 4
  }, /*#__PURE__*/React__default.createElement(PieChart, {
    expenses: expenses,
    width: width,
    height: height
  })), /*#__PURE__*/React__default.createElement(Grid, {
    className: classes.charts__table,
    item: true,
    xs: 12
  }, /*#__PURE__*/React__default.createElement(ExpensesTable, {
    expenses: expenses,
    width: width,
    height: height
  }))))));
};

module.exports = TransparencyPage;
//# sourceMappingURL=index.js.map
