import { TextField, Button, Tooltip, Typography,Grid } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BimeshavandeAutocomplete from './components/BimeshavandeAutocomplete';
import HazineAutocomplete from './components/HazineAutocomplete';
import { PAZIRESH_MUTATION, UPLOAD_TEST } from './NewInquiryQueriesMutations';
import { useMutation } from '@apollo/client';
import moment from 'jalali-moment';
import DatePicker  from "react-modern-calendar-datepicker";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  datepicker: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  input: {
    display: 'none'
  },
  dp__input:{
    display:'none'
  }
}));
export default function Newinquiry() {
  const classes = useStyles()
  const [bimeshavande, setBimeshavande] = React.useState(null);
  const [gharardad,setGharardad] = React.useState(null)
  const [hazine, setHazine] = React.useState(null);
  const [files, setFiles] = React.useState(null);
  const [date,setDate] = React.useState(null);
  const [pazireshMutation, { data, loading, error }] = useMutation(PAZIRESH_MUTATION);
  const [inputField,setInputField] = React.useState(null);
  const handleBimeshavandeChange = (event, newInputValue, reason) => {
    if (reason === 'clear') {
      setBimeshavande(null);
      setHazine(null);
      setGharardad(null)
      return
    } else {
      setBimeshavande(newInputValue);
    }
  }
  const handleHazineChange = (event, newInputValue, reason) => {
    if (reason === 'clear') {
      setHazine(null);
      return
    } else {
      console.log(newInputValue)
      setHazine(newInputValue);
    }
  }
  const handleFileInputChange = (event) => {
    if (event.target.files) {
      setFiles(event.target.files);

      console.log(event.target.files);
      window.name = event.target.files;
    }
  };
  const handleInputChange = (event) => {
    const name = event.target.id;
    const value = event.target.value;
    setInputField(inputField => ({ ...inputField, [name]: value }));
  };
  const dateConverter = (value) =>{
    if(value.days<10)
    value.days = "0" + value.days.toString();
    if(value.month<10)
    value.month = "0" + value.month.toString();
    return value.year.toString() +'/'+value.month.toString()+'/'+value.day.toString();
  
  }
  const submit = ()=>{
    const input = {
      bimeShavande:bimeshavande.node.id,
      files:files,
      gharardad:gharardad,
      hazine:hazine.node.hazine.id,
      date:moment.from(dateConverter(date),'fa','YYYY/MM/DD').locale('en').format('YYYY-MM-DD'),
      hazineDarkhasti:parseInt(inputField.hazineDarkhasti),
      moarefiname:inputField.moarefiname,
      shomareNezamPezeshki:inputField.shomareNezamPezeshki,
      markazDarmani:inputField.markazDarmani,
    }
    console.log(input)
    pazireshMutation({ variables: input });
  }
  const handlerGharardad =(value) =>
  {
    setGharardad(value)
  }
  return (
    <div>
      <form className={classes.root} noValidate>
        <BimeshavandeAutocomplete handleChange={handleBimeshavandeChange} value={bimeshavande} />
        {bimeshavande &&
          <div id="rest">
            <HazineAutocomplete handleChange={handleHazineChange} value={hazine} id={bimeshavande.node.id} giveGharardad={handlerGharardad}/>
            <TextField onChange={handleInputChange} id="hazineDarkhasti" label="مبلغ هزینه" variant="outlined" type="number" />
            <TextField onChange={handleInputChange} id="moarefiname" label="سریال معرفی نامه" variant="outlined" type="number" />
            <TextField onChange={handleInputChange} id="shomareNezamPezeshki" label="شماره نظام پزشکی" variant="outlined" type="number" />
            <TextField onChange={handleInputChange} id="markazDarmani" label="نام مرکز درمانی" variant="outlined" />
            <input
              accept=".jpg,.jpeg"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleFileInputChange}
            />
            <label htmlFor="contained-button-file">
              {files ?
                <>
                <Tooltip title={<React.Fragment>{Array.from(files).map((file) => <Typography id={file.name} color="inherit">{file.name}</Typography>)}</React.Fragment>} placement="left-start">
                  <Button variant="contained" color="primary" component="span">
                    {Array.from(files).length}  فایل انتخاب شده است
                  </Button>
                </Tooltip>
                </>
            :
            <>
              <Button variant="contained" color="primary" component="span">
                آپلود فایل
              </Button>
            </>
              }
            </label>
            <Button variant="contained" color="primary" component="span" onClick={submit}>
                ثبت پذیرش
              </Button>
              <Grid container>
                <Grid item xs={12} alignContent="center">
                <DatePicker
      value={date}
      onChange={setDate}
      shouldHighlightWeekends
      calendarClassName="custom-calendar"
      calendarPopperPosition="bottom"
      locale="fa" // add this
    />
                </Grid>
              </Grid>
          </div>
        }
      </form>
    </div >
  )
}