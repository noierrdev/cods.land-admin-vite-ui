import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,{tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { TableHead, TextField, Typography } from '@mui/material';
import {styled} from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign:"left"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const refJump=React.useRef(null);
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const onChangeJump=e=>{
    e.preventDefault();
    if(!refJump.current.value) return;
    onPageChange(e, Number(refJump.current.value)-1);
    
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5,display:"flex",alignItems:"center" }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
      <form onSubmit={e=>onChangeJump(e)} >
        <div style={{display:"flex",alignItems:"center"}} >
        <Typography>Jump to : </Typography>
        <TextField placeholder='Jump' inputRef={refJump} inputProps={{min:1,max:Math.max(0, Math.ceil(count / rowsPerPage) - 1)}}  defaultValue={page+1} type='number' variant='outlined' size='small' margin='normal' sx={{width:"5vw"}} />
        </div>
      </form>
    </Box>
    
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
  return { name, calories, fat };
}


export default function MyDataTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(()=>{
        props.onFetchData(page,rowsPerPage)
  },[page,rowsPerPage])

  return (
    <TableContainer component={Paper}>
      <Table size='small' sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow >
            {props.headers&&props.headers.map((header,index)=>{
              return (<StyledTableCell align='left' key={index} >{header.title}</StyledTableCell>)
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.pagedata&&props.pagedata.map((row,index) => (
            <TableRow hover selected key={index}>
              {props.headers.map((header,index)=>{
                if(header.tooltip) return (
                  <TableCell align='left' key={index} >
                    <Tooltip title={<div dangerouslySetInnerHTML={{ __html: header.tooltip(row) }} ></div>} >
                      <div>
                        {
                          header.component?header.component(row):(row[header.body]&&row[header.body])
                        }
                      </div>
                    </Tooltip>
                  </TableCell>
                )
                else return (
                  <TableCell align='left' key={index} >
                    {
                      header.component?header.component(row):(row[header.body]&&row[header.body])
                    }
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={props.total?props.total:10}
              rowsPerPage={rowsPerPage}
              page={props.page?props.page:page}
              
              
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            >
              
            </TablePagination>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
MyDataTable.defaultProps={
  onFetchData:()=>{

  },
  pagedata:[],
  headers:[]
}