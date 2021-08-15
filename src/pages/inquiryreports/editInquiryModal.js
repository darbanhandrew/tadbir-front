import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_PAZIRESH_MUTATION, GET_PAZIRESHES_FOR_TABLE, GET_PAZIRESH_FOR_MODAL } from './getInquiries';
import { Card, CardActions, CardContent, TextField, Typography, Grid, Checkbox, Button, List } from '@material-ui/core';
import PdfViewer from './components/pdfviewer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import HazineAutocomplete from 'pages/newinquiry/components/HazineAutocomplete';
import { ListItem } from '@material-ui/core';
import { useUserState } from 'context/UserContext';
const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    root: {
        minWidth: 700,
    },
    form: {
        flexGrow: 1,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    pdf: {
        maxHeight: 500,
        overflow: "scroll",
    },
    button : {
        marginLeft: 10,
    }
}));

export default function EditInquiryModal(props) {
    const classes = useStyles();
    const { open, handleCloseModal, id } = props;
    const userContext = useUserState();
    const [editPazireshMutation] = useMutation(EDIT_PAZIRESH_MUTATION);
    const [openSate, setOpenState] = React.useState(open);
    const [inputRef, setInputRef] = React.useState({
        id: id,
        hazineDarkhasti: null,
        hazineTaeidi: null,
        bimePaye: null,
        hazine: null,
        arzyabMessage: null,
    });
    const hazineDarkhastiRef = React.useRef(null);
    const hazineTaeidiRef = React.useRef(null);
    const bimePayeRef = React.useRef(null);
    const arzyabMessageRef = React.useRef(null);
    const { loading, error, data } = useQuery(GET_PAZIRESH_FOR_MODAL,
        {
            variables: { id: id },
            fetchPolicy: "network-only"
        });
    const handleHazineChange = (event, newInputValue, reason) => {
        if (reason === 'clear') {
            setInputRef(inputRef => ({ ...inputRef, ["hazine"]: null }));
            return
        } else {
            setInputRef(inputRef => ({ ...inputRef, ["hazine"]: newInputValue }));
        }
    }
    const handleInputChange = (event) => {
        const name = event.target.id;
        let value = event.target.value;
        if (name === "hazineTaeidi") {
            if (value > data.paziresh.bimeshavandeGharardadHazine.personalSaghf) {
                value = data.paziresh.bimeshavandeGharardadHazine.personalSaghf
            }
        }
        if (name === "bimePaye") {
            value = event.target.checked;
        }
        setInputRef(inputRef => ({ ...inputRef, [name]: value }));
    };
    const modalClose = () => {
        setInputRef({
            id: null,
            hazineDarkhasti: null,
            hazineTaeidi: null,
            bimePaye: null,
            hazine: null,
            arzyabMessage: null,
        });
        handleCloseModal();
    }
    const checkZero = (value) => {
        return value === 0 ? '' : value;
    }
    const submit = (status) => {
        const sentHazine = inputRef.hazine ? inputRef.hazine : data.paziresh.bimeshavandeGharardadHazine.hazine.id;
        const sentData =
        {
            id: id,
            hazineDarkhasti: Number(hazineDarkhastiRef.current.value),
            hazine: sentHazine,
            hazineTaeidi: Number(hazineTaeidiRef.current.value),
            bimePaye: bimePayeRef.current.checked,
            arzyabMessage:arzyabMessageRef.current.value,
            profileType:userContext.type,
            profileId:userContext.id,
            status: status,
        }
        editPazireshMutation({
            variables:sentData
        });
        modalClose();
    }
    if (loading) return <>'Loading...'</>;
    if (error) return <>`Error! ${error.message}`</>;
    return (
        <div className={classes.form}>
            {id && data && data.paziresh &&
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={modalClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>

                        <Card className={classes.root} variant="outlined">
                            <CardContent>
                                <Grid container>
                                    <Grid  item  xs={12} sm={4}>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                            جزییات پذیرش
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                            {data.paziresh.bimeshavandeGharardadHazine.bimeshavandeGharardad.bimeshavande.firstName
                                                + ' ' +
                                                data.paziresh.bimeshavandeGharardadHazine.bimeshavandeGharardad.bimeshavande.lastName
                                            }
                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            {data.paziresh.bimeshavandeGharardadHazine.bimeshavandeGharardad.bimeshavande.melliCode}
                                        </Typography>
                                        <List>
                                            <ListItem>
                                            <HazineAutocomplete handleChange={handleHazineChange} value={data.paziresh.bimeshavandeGharardadHazine.hazine.id} id="QmltZVNoYXZhbmRlTm9kZTox" />
                                            </ListItem>
                                            <ListItem>
                                        <TextField onChange={handleInputChange} value={inputRef.hazineDarkhasti ? inputRef.hazineDarkhasti : checkZero(data.paziresh.hazineDarkhasti)} inputRef={hazineDarkhastiRef} id="hazineDarkhasti" label="هزینه درخواستی" variant="outlined" type="number" />
                                        </ListItem>
                                        <ListItem>
                                        <Typography component="h6" color="textSecondary">
                                            سقف بیمار :{data.paziresh.bimeshavandeGharardadHazine.personalSaghf} ریال
                                        </Typography>
                                        </ListItem>
                                        <ListItem>
                                        <TextField onChange={handleInputChange} value={inputRef.hazineTaeidi ? inputRef.hazineTaeidi : checkZero(data.paziresh.hazineTaeidi)} inputRef={hazineTaeidiRef} id="hazineTaeidi" label={"هزینه تاییدی"} variant="outlined" type="number" />
                                        </ListItem>
                                        <ListItem>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={inputRef.bimePaye ? inputRef.bimePaye : data.paziresh.bimePaye}
                                                    onChange={handleInputChange}
                                                    name="bimePaye"
                                                    color="primary"
                                                    id="bimePaye"
                                                    inputRef={bimePayeRef}
                                                />
                                            }
                                            label="بیمه پایه"
                                        />
                                        </ListItem>
                                        <ListItem>
                                        <TextField onChange={handleInputChange} multiline value={inputRef.arzyabMessage ? inputRef.arzyabMessage : (data.paziresh.arzyabMessage===null?'':data.paziresh.arzyabMessage)} inputRef={arzyabMessageRef} id="arzyabMessage" label={"توضیحات"} variant="outlined" />
                                        </ListItem>
                                        <ListItem>
                                        <Button className={classes.button} onClick={()=>submit(true)}  variant="contained" color="primary"> تایید و ثبت</Button>
                                        <Button className={classes.button} onClick={()=>submit(false)}  variant="contained" color="secondary"> عودت</Button>
                                        </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <div className={classes.pdf}>
                                            <PdfViewer file={data.paziresh.file} />
                                        </div>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>


                    </Fade>
                </Modal>
            }
        </div>
    );
}