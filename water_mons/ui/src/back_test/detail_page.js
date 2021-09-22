import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Data_Table from "../utils/data_table";
import Basic_Pie from '../utils/echart_pie';
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Box from "@material-ui/core/Box";
import Basic_Bar from "../utils/echart_bar";
import Radio from '@material-ui/core/Radio';
import Basic_Line from "../utils/echart_line";
import DeleteIcon from "@material-ui/icons/Delete";
import Accordion from "@material-ui/core/Accordion";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Efficient_Frontier from "../utils/echart_efficient_frontier";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";



class BackTest_Detail_Page extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            backtestName:props.match.params.name,
            strategyRow:[],
            strategyCol:[
                { field: 'id', headerName: 'id', width: 90 },
                {field:'ticker',headerName:'Ticker',width:200,editable:false},
                {field:'createdDate',headerName:'Date',width:200,editable:false},
                {field:'stock_signal',headerName:'Signal',width:150,editable:false}
            ],
            strategyTicker:[],
            testCol : [
                { field: 'id', headerName: 'id', width: 90 },
                {field:'ticker',headerName:'Ticker',width:200,editable:true},
                {field:'createdDate',headerName:'Date',width:200,editable:true},
                {field:'stock_signal',headerName:'Signal',width:150,editable:true}
            ],
            testRow:[]
        }
        this.update_all = this.update_all.bind(this);
        this.create_test_row = this.create_test_row.bind(this);
        this.getStrategyStocks = this.getStrategyStocks.bind(this);
    }

    create_table(rows, columns) {
        const { path, url } = this.props.match;
        return Data_Table(rows, columns, (e) => {
          console.log(e.row.name);
          this.props.history.push(`${path}/detail/${e.row.name}`);
        });
      }

    create_test_row(){
        let testRow = [...this.state.testRow];
        testRow.push({id: testRow.length, ticker: '', createdDate: '', stock_signal:''})
        this.setState({'testRow':testRow})
    }

    create_date_range_filter() {
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Start Date"
              value={this.state.startDate}
              onChange={this.handlestartDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="End Date"
              label="End Date"
              minDate={this.state.startDate}
              value={this.state.endDate}
              onChange={this.handleendDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        );
      }

    async getStrategyStocks(){
        let queryInfo = {
            backtest_name: this.state.backtestName,
            startDate: '2021-01-01',
            endDate: '2021-12-31',
          };
          const data = await fetch(
            "http://localhost:5000/db/getBaseStrategyStocks",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(queryInfo),
            }
          ).then((d) => d.json());
          console.log(data)
          this.setState({'strategyRow':data})
    
    }


    async componentDidMount() {
        this.update_all();
    }

    async componentDidUpdate() {
    }

    async update_all(){
        this.getStrategyStocks()
    }


    render(){
        return (
          <div>
            <Grid justifyContent="center" alignContent="center" spacing={12}>
              <Grid item container sm={12} justifyContent="center">
                <h1>Back Test: {this.state.backtestName}</h1>
              </Grid>

              <Grid spacing={12} container justifyContent="center">
                <Accordion rounded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div>
                      <Typography>Filter</Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid item sm={10} container>
                      {this.create_date_range_filter()}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid sm={12}>
                <Box m={5} ml={21} mr={21}>
                  {this.create_table(
                    this.state.strategyRow,
                    this.state.strategyCol
                  )}
                </Box>
              </Grid>
              <Grid sm={12}>
                <Box m={5} ml={21} mr={21}>
                <Grid sm={1}>
                <Box m={0}>
                    <Button
                        color={"primary"}
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={this.create_test_row}
                        />
                </Box>
                </Grid>
                  {this.create_table(
                    this.state.testRow,
                    this.state.testCol
                  )}
                </Box>
              </Grid>
            </Grid>
          </div>
        );
    }
}


export default BackTest_Detail_Page;