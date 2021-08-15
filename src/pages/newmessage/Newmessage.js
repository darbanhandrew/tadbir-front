import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Paper, Tabs, Tab, Snackbar, Backdrop, CircularProgress} from '@material-ui/core';
import MuiAlert  from '@material-ui/lab/Alert';
import PageTitle from '../../components/PageTitle/PageTitle';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PhoneIcon from '@material-ui/icons/Phone';
import Button from '@material-ui/core/Button';
import {createMessageMutation} from './createMessageMutation';
import { useMutation } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: 'center',
    textAlign: 'center'
  },
  formGrid: {
    padding: theme.spacing(2)
  },
  buttonGrid: {
    padding: theme.spacing(1),
    margin : theme.spacing(1)
  },
  textfield:{
    marginBottom: theme.spacing(5)
  },
  input: {
    display: 'none',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#000',
  },
}));
export default function Neworder() {
  const classes = useStyles();
  const [backDropOpen, setBackDropOpen] = React.useState(false);
  const [name, setName] = React.useState('شخص');
  const [open, setOpen] = React.useState(false);
  const [color, setColor] = React.useState('success');
  const [mutationMessage, setMutationMessage] = React.useState("")
  const [inputField, setInputField] = React.useState({
    tab_value: "person",
    name: '',
    phone_number: '',
    file: '',
  })

  const handleChange = (event, newValue) => {
    setInputField(inputField => ({ ...inputField, ["tab_value"]: newValue }));
    if (newValue =='person'){
      setName("شخص");
    }
    else {
      setName("شرکت");
    }
  };
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputField(inputField => ({ ...inputField, [name]: value }));
  };
  const handleFileInputChange = (event) => {
    if(event.target.files){
      const file = event.target.files[0];
      setInputField(inputField => ({ ...inputField, ["file"]: file }));
    }
    else 
    {
      setInputField(inputField => ({ ...inputField, ["file"]: '' }));
    }
  };
  const [creteMessage, { data,error}] = useMutation(createMessageMutation,{
    onCompleted()
    {
      setBackDropOpen(false);
      setOpen(true);
      setColor('success');
      setInputField(inputField => ({ ...inputField, ["file"]: '' }));
      setInputField(inputField => ({ ...inputField, ["name"]: '' }));
      setInputField(inputField => ({ ...inputField, ["phone_number"]: '' }));
      setMutationMessage("ارسال با موفقیت انجام شد.");
    }
  });
  const handleSubmission = (event) => {
    event.preventDefault();
    if(inputField.file)
    {
      console.log(inputField);
      setBackDropOpen(true);
      creteMessage({ variables: { input:{phoneNumber:inputField.phone_number, name:inputField.name,category:inputField.tab_value,file:inputField.file} } });
      if (error) {
        setOpen(true);
        setColor('warning');
        setMutationMessage("اشکالی در ارسال پیامک وجود دارد." + error.message)
      }
    }
    else 
    {
              setOpen(true);
        setColor('warning');
      setMutationMessage("فایل را هم بارگذاری کنید.");
    }
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (

    <div className={classes.root}>
      <PageTitle title="ارسال پیامک" />
      <Grid container spacing={1}>
        <Grid item sm={2} xs={1} />
        <Grid item sm={8} xs={10}>
          <Paper>
            <Tabs
              value={inputField.tab_value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab value="person" label="شخصی" />
              <Tab value="company" label="شرکتی" />
            </Tabs>
            <Grid item xs={12} className={classes.formGrid}>
              <form onSubmit={handleSubmission}>
              <TextField
                fullWidth
                required
                label={"نام " + name}
                onChange={handleInputChange}
                value={inputField.name}
                name="name"
                className={classes.textfield}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                required
                label="شماره تلفن"
                onChange={handleInputChange}
                value={inputField.phone_number}
                name="phone_number"
                type="number"
                className={classes.textfield}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Grid item xs={12} className={classes.buttonGrid}>
              <input 
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={handleFileInputChange}
                name="file"
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  {inputField.file && inputField.file.name ?
                  inputField.file.name :
                  <>
                  آپلود فایل
                  </>
                  }
                </Button>
              </label>
              </Grid>
              <Grid item xs={12} className={classes.buttonGrid}>
              <input
                className={classes.input}
                id="form-submit"
                type="submit"
              />
              <label htmlFor="form-submit">
              <Button variant="contained" color="secondary" component="span">
                ارسال پیامک
              </Button>
              </label>
              </Grid>
              </form>
            </Grid>
          </Paper>
          <Backdrop className={classes.backdrop} open={backDropOpen}>
  <CircularProgress color="inherit" />
  در حال ارسال پیامک
</Backdrop>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={color}>
          {mutationMessage}
        </MuiAlert>
      </Snackbar>
        </Grid>
        <Grid item sm={2} xs={1} />
      </Grid>
    </div>
  );
}