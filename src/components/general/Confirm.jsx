import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {CheckOutlined, CloseOutlined} from '@mui/icons-material'

export default function Confirm(props) {

  const handleClose = () => {
    props.onCancel();
  };

  const handleOk=()=>{
    props.onOk();
    props.onCancel()
  }

  return (
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} ><CloseOutlined color='secondary' /></Button>
          <Button onClick={handleOk} autoFocus>
            <CheckOutlined color='primary' />
          </Button>
        </DialogActions>
      </Dialog>
  );
}
Confirm.defaultProps={
    open:true,
    onConfirm:()=>{},
    onCancel:()=>{},
    onOk:()=>{},
    text:"Do you want to continue selected action?"
}