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
import { fi } from "date-fns/locale";

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

class BackTest_Create_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: [],
      sOption:[]
    };
    this.appendInput = this.appendInput.bind(this);
    this.removeInput = this.removeInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.theme = createMuiTheme({
      palette: {
        primary: {
          main: "#0D0C0C",
          contrastText: "#A5A5A5",
        },
        secondary: {
          main: "#E9E9E9",
          contrastText: "#A5A5A5",
        },
      },
    });
  }

  appendInput() {
    var newInput = `strategy_name${this.state.inputs.length}`;
    this.setState((prevState) => ({
      inputs: prevState.inputs.concat([newInput]),
    }));
  }

  removeInput() {
    this.setState((prevState) => ({
      inputs: prevState.inputs.length > 1 ? prevState.inputs.slice(-1) : [],
    }));
  }

  async componentDidMount() {
    console.log("mount");
    let data = await fetch("http://localhost:5000/db/getStrategy").then(
      (res) => res.json()
    );
    let rows = data.map((element) => {
      return element["name"];
    });
    console.log(rows);
    this.setState({ sOption: rows });
  }

  async handleSubmit() {
    let alertMsg = null;
    let backtestName = document.querySelector("#backtest_name").value;
    let baseStrategy = document.getElementById("strategy_name").innerText;
    let desc = document.querySelector("#description").value;
    if (backtestName == "" && alertMsg === null) {
      alertMsg = "Back test name is required";
    }
    if (desc == "" && alertMsg === null) {
      alertMsg = "backtest description is required";
    }
    if (!this.state.sOption.includes(baseStrategy)) {
      alertMsg = "Base strategy is required";
    }
    if (alertMsg != null) {
      alert(alertMsg);
      return;
    }
    
    let today = new Date();
    let insertData = {
      name: backtestName,
      description: desc,
      baseStrategy: baseStrategy,
      createdDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
    };

    let createPortRes = await fetch(
      "http://localhost:5000/db/createBacktest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(insertData),
      }
    );

    if (createPortRes.status == 200) {
      this.props.history.goBack();
    }
  }


  render() {
    return (
      <div>
        <Grid justifyContent="center" alignContent="center" spacing={12}>
          <Grid item contianer sm={2}>
            <Box m={3}>
              <Typography variant={"h6"}>Create New Strategy</Typography>
            </Box>
          </Grid>
          <Grid item container sm={8}>
            <Grid sm={3}>
              <Box m={3}>
                <Typography>Back Test Name</Typography>
              </Box>
            </Grid>
            <Grid sm={6}>
              <Box m={3}>
                <TextField id="backtest_name" />
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
            <Grid sm={3}>
              <Box m={3}>
                <Typography>Base Strategy</Typography>
              </Box>
            </Grid>
            <Grid sm={6}>
              <Box m={3}>
                <TextField id={`strategy_name`} select>
                  {this.state.sOption.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid sm={2}>
          <ThemeProvider theme={this.theme}>
            <Button
              color={"secondary"}
              onClick={this.handleSubmit}
              variant="contained"
            >
              Submit
            </Button>
          </ThemeProvider>
        </Grid>
      </div>
    );
  }
}

export default BackTest_Create_Page;
