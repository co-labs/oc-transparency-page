import React, { useState, useLayoutEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { IntlProvider, FormattedMessage } from 'react-intl';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { orderBy, debounce } from 'lodash';
import { Bar, Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles = makeStyles(theme => ({
  body: {},
  body__title: {
    fontSize: '1.5em',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2em'
    }
  },
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
  header__title: {
    fontSize: '2em',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.6em'
    }
  },
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
  table__head__row__cell: {
    fontSize: '1em',
    [theme.breakpoints.down('xs')]: {
      fontSize: '.8em',
      padding: 10
    }
  },
  table__body: {},
  table__body__row: {},
  table__body__row__cell: {
    fontSize: '.9em',
    [theme.breakpoints.down('xs')]: {
      fontSize: '.7em',
      padding: 10
    }
  },
  table__footer: {},
  table__footer__row: {},
  'table-container': {},
  wrapper: {}
}));

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

const BarChart = ({
  expenses,
  width,
  height
}) => {
  const periods = [];
  const cats = [];
  expenses = orderBy(expenses, item => item.createdAt);
  expenses.map(item => {
    const month = new moment(item.createdAt).format('MM/YYYY');
    let monthKey = periods.findIndex(i => i === month);

    if (monthKey === -1) {
      monthKey = periods.push(month);
      monthKey--;
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
      }
    }

    if (typeof cats[catKey] !== 'undefined') {
      if (typeof cats[catKey].data[monthKey] === 'undefined') {
        cats[catKey].data[monthKey] = 0;
      }

      cats[catKey].data[monthKey] += item.amount / 100;
    }
  });
  cats.map((i, k) => {
    cats[k].backgroundColor = generateRainbow(cats.length, k);
    cats[k].borderColor = generateRainbow(cats.length, k);
  });
  const formattedData = {
    labels: periods,
    datasets: cats
  };
  const options = {
    maintainAspectRatio: false,
    responsive: true
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: width > 600 ? 350 : 450,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Bar, {
    data: formattedData,
    options: options
  }));
};

function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    count,
    page,
    rowsPerPage,
    onChangePage
  } = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return /*#__PURE__*/React.createElement("div", {
    className: classes.pagination
  }, /*#__PURE__*/React.createElement(IconButton, {
    className: classes.pagination__first,
    onClick: handleFirstPageButtonClick,
    disabled: page === 0,
    "aria-label": "first page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React.createElement(LastPageIcon, null) : /*#__PURE__*/React.createElement(FirstPageIcon, null)), /*#__PURE__*/React.createElement(IconButton, {
    className: classes.pagination__prev,
    onClick: handleBackButtonClick,
    disabled: page === 0,
    "aria-label": "previous page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React.createElement(KeyboardArrowRight, null) : /*#__PURE__*/React.createElement(KeyboardArrowLeft, null)), /*#__PURE__*/React.createElement(IconButton, {
    className: classes.pagination__next,
    onClick: handleNextButtonClick,
    disabled: page >= Math.ceil(count / rowsPerPage) - 1,
    "aria-label": "next page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React.createElement(KeyboardArrowLeft, null) : /*#__PURE__*/React.createElement(KeyboardArrowRight, null)), /*#__PURE__*/React.createElement(IconButton, {
    className: classes.pagination__last,
    onClick: handleLastPageButtonClick,
    disabled: page >= Math.ceil(count / rowsPerPage) - 1,
    "aria-label": "last page"
  }, theme.direction === 'rtl' ? /*#__PURE__*/React.createElement(FirstPageIcon, null) : /*#__PURE__*/React.createElement(LastPageIcon, null)));
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

const ExpensesTable = ({
  expenses,
  width,
  height
}) => {
  const classes = useStyles();
  const rows = expenses;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  return /*#__PURE__*/React.createElement(TableContainer, {
    className: classes['table-container'],
    component: Paper
  }, /*#__PURE__*/React.createElement(Table, {
    className: classes.table,
    "aria-label": "simple table"
  }, /*#__PURE__*/React.createElement(TableHead, {
    className: classes.table__head
  }, /*#__PURE__*/React.createElement(TableRow, {
    className: classes.table__head__row
  }, /*#__PURE__*/React.createElement(TableCell, {
    className: classes.table__head__row__cell,
    align: "left"
  }, "Description"), /*#__PURE__*/React.createElement(TableCell, {
    className: classes.table__head__row__cell,
    align: "left"
  }, "Amount"), /*#__PURE__*/React.createElement(TableCell, {
    className: classes.table__head__row__cell,
    align: "right"
  }, "Status"), /*#__PURE__*/React.createElement(TableCell, {
    className: classes.table__head__row__cell,
    align: "right"
  }, "Tags"))), /*#__PURE__*/React.createElement(TableBody, {
    className: classes.table__body
  }, (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(row => /*#__PURE__*/React.createElement(TableRow, {
    className: classes.table__body__row,
    key: row.id
  }, /*#__PURE__*/React.createElement(TableCell, {
    className: classes.table__body__row__cell,
    component: "th",
    scope: "row"
  }, row.description), /*#__PURE__*/React.createElement(TableCell, {
    className: classes.table__body__row__cell,
    style: {
      width: 160
    },
    align: "right"
  }, row.amount / 100, " ", row.currency), /*#__PURE__*/React.createElement(TableCell, {
    className: classes.table__body__row__cell,
    style: {
      width: 160
    },
    align: "right"
  }, row.status), /*#__PURE__*/React.createElement(TableCell, {
    className: classes.table__body__row__cell,
    style: {
      width: 160
    },
    align: "right"
  }, row.tags))), emptyRows > 0 && /*#__PURE__*/React.createElement(TableRow, {
    className: classes.table__body__row,
    style: {
      height: 53 * emptyRows
    }
  }, /*#__PURE__*/React.createElement(TableCell, {
    className: classes.table__body__row__cell,
    colSpan: 6
  }))), /*#__PURE__*/React.createElement(TableFooter, {
    className: classes.table__footer
  }, /*#__PURE__*/React.createElement(TableRow, {
    className: classes.table__footer__row
  }, /*#__PURE__*/React.createElement(TablePagination, {
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
      native: true
    },
    onChangePage: handleChangePage,
    onChangeRowsPerPage: handleChangeRowsPerPage,
    ActionsComponent: TablePaginationActions
  })))));
};

const PieChart = ({
  expenses,
  width,
  height
}) => {
  const labels = [];
  const datasets = [{
    data: [],
    backgroundColor: [],
    hoverBackgroundColor: []
  }];
  expenses = orderBy(expenses, item => item.createdAt);
  expenses.map(item => {
    const label = item.tags[0] ?? 'undefined';
    let labelKey = labels.findIndex(i => i === label);

    if (labelKey === -1) {
      labelKey = labels.push(label);
      datasets[0].data[labelKey - 1] = item.amount / 100;
    } else {
      datasets[0].data[labelKey] += item.amount / 100;
    }
  });
  labels.map((i, k) => {
    datasets[0].backgroundColor[k] = generateRainbow(labels.length, k);
    datasets[0].hoverBackgroundColor[k] = generateRainbow(labels.length, k);
  });
  const formattedData = {
    labels: labels,
    datasets: datasets
  };
  const options = {
    maintainAspectRatio: false,
    responsive: true
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: width > 600 ? 300 : 350,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Doughnut, {
    data: formattedData,
    options: options
  }));
};

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = debounce(() => {
      setSize([window.innerWidth, window.innerHeight]);
    }, 100);
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

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
  const classes = useStyles();
  const [width, height] = useWindowSize();
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
  const expenses = data.expenses.nodes;
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
    className: classes.wrapper
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.header
  }, /*#__PURE__*/React.createElement("h1", {
    className: classes.header__title
  }, /*#__PURE__*/React.createElement("img", {
    className: classes.header__logo,
    src: account.imageUrl,
    alt: ""
  }), account.name)), /*#__PURE__*/React.createElement("div", {
    className: classes.body
  }, /*#__PURE__*/React.createElement("h2", {
    className: classes.body__title
  }, /*#__PURE__*/React.createElement(FormattedMessage, {
    id: "allExpensesFrom",
    defaultMessage: "All expenses from {date}",
    values: {
      date: moment(dateFrom, 'YYYY-MM-DD').format('DD/MM/YYYY')
    }
  })), /*#__PURE__*/React.createElement(Grid, {
    className: classes.charts,
    container: true,
    spacing: 5
  }, /*#__PURE__*/React.createElement(Grid, {
    className: classes.charts__bar,
    item: true,
    xs: 12,
    md: 8
  }, /*#__PURE__*/React.createElement(BarChart, {
    expenses: expenses,
    width: width,
    height: height
  })), /*#__PURE__*/React.createElement(Grid, {
    className: classes.charts__pie,
    item: true,
    xs: 12,
    md: 4
  }, /*#__PURE__*/React.createElement(PieChart, {
    expenses: expenses,
    width: width,
    height: height
  })), /*#__PURE__*/React.createElement(Grid, {
    className: classes.charts__table,
    item: true,
    xs: 12
  }, /*#__PURE__*/React.createElement(ExpensesTable, {
    expenses: expenses,
    width: width,
    height: height
  }))))));
};

export default TransparencyPage;
//# sourceMappingURL=index.modern.js.map
