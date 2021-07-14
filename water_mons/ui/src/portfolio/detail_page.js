import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles, createTheme, ThemeProvider,createMuiTheme } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Data_Table from '../utils/data_table';
import Line_Chart from '../utils/line_chart';



const weight = 700;
const height = 500;
const startDate = '2021-01-01';
const endDate = '2021-01-10';
const data = [
    {"Date":'2021-01-01',"Base":10,"Benchmark":20},
    {"Date":'2021-01-02',"Base":11,"Benchmark":12},
    {"Date":'2021-01-03',"Base":12,"Benchmark":10},
    {"Date":'2021-01-04',"Base":13,"Benchmark":5},
    {"Date":'2021-01-05',"Base":14,"Benchmark":6},
    {"Date":'2021-01-06',"Base":15,"Benchmark":1},
];
const margin=50;



class Portfolio_Detail_Page extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(<div>
            <Line_Chart 
            startDate={startDate} 
            endDate={endDate} 
            width={weight} 
            height={height}
            data={data}
            margin={margin}
            />
        </div>)
    }

}

export default Portfolio_Detail_Page;