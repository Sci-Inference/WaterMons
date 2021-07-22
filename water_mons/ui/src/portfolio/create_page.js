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

class Portfolio_Create_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: [],
    };
    this.appendInput = this.appendInput.bind(this);
    this.create_stock_list = this.create_stock_list.bind(this);
    this.removeInput = this.removeInput.bind(this);
    this.theme = createMuiTheme({
      palette: {
        primary: {
          main: "#0D0C0C",
          contrastText: "#A5A5A5",
        },
      },
    });
  }

  appendInput() {
    var newInput = `input-${this.state.inputs.length}`;
    this.setState((prevState) => ({
      inputs: prevState.inputs.concat([newInput]),
    }));
  }

  removeInput() {
    this.setState((prevState) => ({
      inputs: prevState.inputs.length > 1 ? prevState.inputs.slice(-1) : [],
    }));
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
                    <Typography variant={'h6'}>Create New Portfolio</Typography>
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
                <TextField id="portfolio_name" />
              </Box>
            </Grid>
          </Grid>
          <Grid item container sm={8}>
            <Grid sm={3}>
                <Box m={5}>
                    <Typography>Description</Typography>
                </Box>
            </Grid>
            <Grid sm={6}>
                <Box m={5}>
                    <TextField id="description" multiline rows={3} />
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
      </div>
    );
  }
}

export default Portfolio_Create_Page;
