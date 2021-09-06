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

class Risk_Assessment_Create_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: [],
      portOption: [],
    };
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

  async componentDidMount() {
    console.log("mount");
    let data = await fetch("http://localhost:5000/db/getPortfolio").then(
      (res) => res.json()
    );
    let rows = data.map((element) => {
      return element["name"];
    });
    console.log(rows);
    this.setState({ portOption: rows });
  }

  async handleSubmit() {
    let alertMsg = null;
    let assessmentName = document.querySelector("#risk_assessment_name").value;
    let basePort = document.getElementById('portfolio_name').innerText;
    let desc = document.querySelector("#description").value;
    if (assessmentName == "" && alertMsg === null) {
      alertMsg = "Assessment name is required";
    }
    if (desc == "" && alertMsg === null) {
      alertMsg = "portfolio description is required";
    }
    if (!this.state.portOption.includes(basePort)) 
    {alertMsg='Base portfolio is required'};
    if (alertMsg != null) {
      alert(alertMsg);
      return;
    }

    let today = new Date();
    let insertData = {
      name: assessmentName,
      description: desc,
      basePort:basePort,
      createdDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
    };

    let createPortRes = await fetch(
      "http://localhost:5000/db/createRiskAssessment",
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
    console.log("render");
    return (
      <div>
        <Grid justifyContent="center" alignContent="center" spacing={12}>
          <Grid item contianer sm={2}>
            <Box m={3}>
              <Typography variant={"h6"}>Create New Portfolio</Typography>
            </Box>
          </Grid>
          <Grid item container sm={8}>
            <Grid sm={3}>
              <Box m={3}>
                <Typography>Risk Assessment Name</Typography>
              </Box>
            </Grid>
            <Grid sm={6}>
              <Box m={3}>
                <TextField id="risk_assessment_name" />
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
                <Typography>Base Portfolio</Typography>
              </Box>
            </Grid>
            <Grid sm={6}>
              <Box m={3}>
                <TextField id={`portfolio_name`} select>
                  {this.state.portOption.map((option) => (
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

export default Risk_Assessment_Create_Page;
