import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {CheckOutlined, CloseOutlined} from '@mui/icons-material'

export default function Confirm(props) {
  const {
    open=true,
    onConfirm=()=>{},
    onCancel=()=>{},
    onOk=()=>{},
    text="Do you want to continue selected action?"
  }=props;

  const handleClose = () => {
    onCancel();
  };

  const handleOk=()=>{
    onOk();
    onCancel()
  }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
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