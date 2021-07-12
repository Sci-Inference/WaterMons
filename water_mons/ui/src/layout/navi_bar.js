
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
    BrowserRouter as Router,
    Switch,
    useHistory,
    Route,
    Link
} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
   appColor:{
       background:"#3F9FB4",
    },
    tabText:{
        textTransform: "none" ,
        fontWeight:500
    }
  }));

function App_Bar() {
    const classes = useStyles();
    let history = useHistory();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        history.push(newValue.toLowerCase())
    };
    return (
        <div>
            <AppBar position="static" className={classes.appColor}>
                <Tabs value={value} onChange={handleChange} centered variant="fullWidth">
                    <Tab label='Portfolio' value='portfolio' className={classes.tabText}/>
                    <Tab label='Strategy' value='strategy' className={classes.tabText}/>
                    <Tab label='Back Test' value='back-test' className={classes.tabText}/>
                    <Tab label='Risk Assessment' value='assessment' className={classes.tabText}/>
                </Tabs>
            </AppBar>
        </div>
    )
}


export default  App_Bar ;
