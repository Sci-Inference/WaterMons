import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Data_Table from "../utils/data_table";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Container } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import NumberFormat from "react-number-format";
import { Paper } from "@material-ui/core";



function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
      />
    );
  }
  
  class Portfolio_Insert_Page extends React.Component {
      constructor(props){
        super(props);
        this.state = {
          inputs: ['portfolio_name1'],
          portOption:['portfolio 1','MACD selection','Multi-Selection']
        };
        this.appendInput = this.appendInput.bind(this);
        this.create_stock_list = this.create_stock_list.bind(this);
        this.removeInput = this.removeInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.theme = createMuiTheme({
          palette: {
            primary: {
              main: "#0D0C0C",
              contrastText: "#A5A5A5",
            },
            secondary:{
              main:"#E9E9E9",
              contrastText: "#A5A5A5",
            }
          },
        });
      }

      appendInput() {
        var newInput = `portfolio_name${this.state.inputs.length}`;
        this.setState((prevState) => ({
          inputs: prevState.inputs.concat([newInput]),
        }));
      }
    
      removeInput() {
        this.setState((prevState) => ({
          inputs: prevState.inputs.slice(-1),
        }));
      }

      handleSubmit(){
        let alertMsg = null
        let portfolioSelection = document.getElementById('portfolio_name').innerText;
        if (!this.state.portOption.includes(portfolioSelection)) {alertMsg='Portfolio name is required'};
        console.log(portfolioSelection)
        let stockInfo = this.state.inputs.map((d)=>{
          let tmp = {
            'stock_name':document.querySelector(`#${d}-ticker`).value,
            'stock_date':document.querySelector(`#${d}-date`).value,
            'stock_option':document.querySelector(`#${d}-option`).innerText,
            'stock_number':document.querySelector(`#${d}-number`).value,
            'stock_price':document.querySelector(`#${d}-price`).value,
          }
          for (const [key, value] of Object.entries(tmp)) {
            if(((value == '') || (value===undefined))&& (alertMsg ===null)) {alertMsg=`${key} is required`};
            if((key=='stock_option') && (alertMsg ===null)){
              console.log(value)
              if((value!= 'buy') && (value!='sell')) {alertMsg=`${key} is required`}
            }
          }
        })
        if(alertMsg != null){
          alert(alertMsg);
        }
        console.log(stockInfo);
      }
    
      create_stock_list() {
        return this.state.inputs.map((d) => {
          let options = ["sell", "buy"];
          return (
            <Grid justifyContent="center" alignContent="center" spacing={12}>
              <Grid item container sm={12}>
                <Grid sm={3}>
                  <TextField id={`${d}-ticker`} label={"Ticker"} />
                </Grid>
                <Grid sm={3}>
                  <TextField
                    id={`${d}-date`}
                    label={"Create"}
                    type="date"
                    defaultValue={new Date()}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid sm={2}>
                  <TextField
                    id={`${d}-option`}
                    label={"Option"}
                    select
                    InputLabelProps={{ shrink: true }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid sm={2}>
                  <TextField
                    id={`${d}-number`}
                    label={"Number"}
                    InputProps={{ inputComponent: NumberFormatCustom }}
                  />
                </Grid>
                <Grid sm={2}>
                  <TextField
                    id={`${d}-price`}
                    label={"Price"}
                    InputProps={{ inputComponent: NumberFormatCustom }}
                  />
                </Grid>
              </Grid>
            </Grid>
          );
        });
      }
    
      render() {
        return (
          <div>
            <Grid justifyContent="center" alignContent="center" spacing={12}>
              <Grid item contianer sm={2}>
                <Box m={3}>
                  <Typography variant={"h6"}>Insert Stocks</Typography>
                </Box>
              </Grid>
              <Grid item container sm={8}>
                <Grid sm={3}>
                  <Box m={3}>
                    <Typography>Portfolio Name</Typography>
                  </Box>
                </Grid>
                <Grid sm={6}>
                  <Box m={3}>
                    <TextField
                    id={`portfolio_name`}
                    select
                  >
                    {this.state.portOption.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  </Box>
                </Grid>
              </Grid>
              <Grid item container sm={8}>
                <ThemeProvider theme={this.theme}>
                  <Grid sm={3}>
                    <Typography>Stock List</Typography>
                  </Grid>
                  <Grid sm={6}>
                    <Button
                      color={"primary"}
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={this.appendInput}
                    />
                    <Button
                      color={"primary"}
                      startIcon={<RemoveCircleOutlineIcon />}
                      onClick={this.removeInput}
                    />
                  </Grid>
                </ThemeProvider>
              </Grid>
            </Grid>
            <Box m={5}>
              {this.state.inputs.length > 0 && (
                <Paper variant={"outlined"}>
                  <Container>{this.create_stock_list()}</Container>
                </Paper>
              )}
            </Box>
            <Grid sm={2}>
              <ThemeProvider theme={this.theme}>
                <Button
                  color={"secondary"}
                  onClick={this.handleSubmit}
                  variant='contained'
                >
                  Submit
                </Button>
              </ThemeProvider>
            </Grid>
          </div>
        );
      }
    }



export default Portfolio_Insert_Page;