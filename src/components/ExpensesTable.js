import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { useStyles } from '../theme'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'

function TablePaginationActions(props) {
  const classes = useStyles()
  const theme = useTheme()
  const { count, page, rowsPerPage, onChangePage } = props

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.pagination}>
      <IconButton
        className={classes.pagination__first}
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        className={classes.pagination__prev}
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        className={classes.pagination__next}
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        className={classes.pagination__last}
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
}

/**
 * ExpensesTable formatter
 * @param expenses
 * @param width
 * @param height
 * @returns {JSX.Element}
 * @constructor
 */
const ExpensesTable = ({ expenses, width, height }) => {
  const classes = useStyles()
  const rows = expenses
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

  return (
    <TableContainer className={classes['table-container']} component={Paper}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead className={classes.table__head}>
          <TableRow className={classes.table__head__row}>
            <TableCell className={classes.table__head__row__cell} align='left'>Description</TableCell>
            <TableCell className={classes.table__head__row__cell} align='left'>Amount</TableCell>
            <TableCell className={classes.table__head__row__cell} align='right'>Status</TableCell>
            <TableCell className={classes.table__head__row__cell} align='right'>Tags</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.table__body}>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow className={classes.table__body__row} key={row.id}>
              <TableCell className={classes.table__body__row__cell} component='th' scope='row'>
                {row.description}
              </TableCell>
              <TableCell className={classes.table__body__row__cell} style={{ width: 160 }} align='right'>
                {row.amount / 100} {row.currency}
              </TableCell>
              <TableCell className={classes.table__body__row__cell} style={{ width: 160 }} align='right'>
                {row.status}
              </TableCell>
              <TableCell className={classes.table__body__row__cell} style={{ width: 160 }} align='right'>
                {row.tags}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow className={classes.table__body__row} style={{ height: 53 * emptyRows }}>
              <TableCell className={classes.table__body__row__cell} colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter className={classes.table__footer}>
          <TableRow className={classes.table__footer__row}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={4}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default ExpensesTable
