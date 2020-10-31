import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
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
}))
