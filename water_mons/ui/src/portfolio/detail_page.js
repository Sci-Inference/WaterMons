import React from "react";
import Button from "@material-ui/core/Button";
import {
  makeStyles,
  withStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Data_Table from "../utils/data_table";
import Line_Chart from "../utils/line_chart";
import Bar_Chart from "../utils/barchart";
import Paper from "@material-ui/core/Paper";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import DeleteIcon from "@material-ui/icons/Delete";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

let weight = 700;
let height = 600;
const startDate = "2021-01-01";
const endDate = "2021-01-10";
const data = [
  { Date: "2021-01-01", Base: 10, Benchmark: 20 },
  { Date: "2021-01-02", Base: -11, Benchmark: 12 },
  { Date: "2021-01-03", Base: -12, Benchmark: 10 },
  { Date: "2021-01-04", Base: 13, Benchmark: 5 },
  { Date: "2021-01-05", Base: 14, Benchmark: 6 },
  { Date: "2021-01-06", Base: 15, Benchmark: 12 },
];
let margin = 50;
const dataColor = [
  { time: "Date", name: "Base", color: "black", dot: "blue" },
  { time: "Date", name: "Benchmark", color: "red", dot: "black" },
];

const columns = [
  {
    field: "metric",
    headerName: "Metrics",
    width: 150,
    editable: true,
  },
  {
    field: "base",
    headerName: "Base",
    width: 300,
    editable: true,
  },
  {
    field: "benchmark",
    headerName: "Benchmark",
    type: "date",
    width: 150,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    metric: "Period Return",
    base: "11",
    benchmark: "12",
  },
  {
    id: 2,
    metric: "Period Return (%)",
    base: "0.2",
    benchmark: "1",
  },
  {
    id: 3,
    metric: "Max Drawdown",
    base: "10",
    benchmark: "12",
  },
  {
    id: 4,
    metric: "Period Voltility (std.)",
    base: "0.2",
    benchmark: "1.2",
  },
  {
    id: 5,
    metric: "Sharpe Ratio",
    base: "0.25",
    benchmark: "1.1",
  },
  {
    id: 6,
    metric: "Sortino Ratio",
    base: "2.2",
    benchmark: "1.3",
  },
  {
    id: 7,
    metric: "Number Transaction",
    base: "2",
    benchmark: "13",
  },
  {
    id: 8,
    metric: "Transaction Fee",
    base: "0",
    benchmark: "0",
  },
];

class Portfolio_Detail_Page extends React.Component {
  constructor(props) {
    super(props);
    this.create_table = this.create_table.bind(this);
    this.handleCompareField = this.handleCompareField.bind(this);
    this.handleendDateChange = this.handleendDateChange.bind(this);
    this.handlestartDateChange = this.handlestartDateChange.bind(this);
    this.createSelectedBenchmark = this.createSelectedBenchmark.bind(this);
    this.create_date_range_filter = this.create_date_range_filter.bind(this);
    this.OnClick_deleteSelectedBenchmark =
      this.OnClick_deleteSelectedBenchmark.bind(this);
    this.state = {
      startDate: new Date("2021-01-01"),
      endDate: new Date("2021-01-01"),
      benchmarkList: new Array(),
    };
  }

  create_table(rows, columns) {
    return Data_Table(rows, columns);
  }

  handlestartDateChange(date) {
    this.setState({ startDate: date });
  }

  handleendDateChange(date) {
    this.setState({ endDate: date });
  }

  handleCompareField(e) {
    if (e.keyCode == 13) {
      this.setState({
        benchmarkList: [...this.state.benchmarkList, e.target.value],
      });
      e.target.value = "";
    }
  }

  OnClick_deleteSelectedBenchmark(e) {
    let selectValue = e.currentTarget.value;
    console.log(e.currentTarget.value);
    this.setState({
      benchmarkList: [...this.state.benchmarkList].filter(
        (d) => d != selectValue
      ),
    });
  }

  createSelectedBenchmark() {
    let benchmarkList = this.state.benchmarkList;
    let res = benchmarkList.map((d) => {
      return (
        <Button
          endIcon={<DeleteIcon />}
          value={d}
          onClick={this.OnClick_deleteSelectedBenchmark}
        >
          {d}
        </Button>
      );
    });
    console.log(benchmarkList);
    return res;
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

  render() {
    let full_width = window.innerWidth * 0.5;
    return (
      <div>
        <Grid container spacing={12}>
          <Grid item sm={3}></Grid>
          <Grid
            item
            sm={6}
            justifyContent="center"
            alignItems="center"
            container
          >
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
                <Grid item sm={6} alignContent="center" container>
                  {this.createSelectedBenchmark()}
                </Grid>
                <Grid item sm={6} container>
                  <FormControl>
                    <TextField
                      id="benchmark_text_field"
                      label="Benchmark"
                      margin="normal"
                      onKeyDown={this.handleCompareField}
                    />
                  </FormControl>
                  {this.create_date_range_filter()}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item sm={3}></Grid>
          <Grid item sm={12}>
            <Box m={5}>
              <Line_Chart
                startDate={startDate}
                endDate={endDate}
                width={full_width}
                height={full_width * 0.5 + 20}
                data={data}
                margin={10}
                dataColor={dataColor}
              />
            </Box>
          </Grid>

          <Grid sm={12}>
              <Box m={5}>
                <Accordion rounded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div>
                      <Typography>Portfolio Composition</Typography>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    {this.create_table(rows, columns)}
                  </AccordionDetails>
                </Accordion>
              </Box>
          </Grid>

          <Grid item sm={6}>
            <Grid>
              <Box m={0} mb={0}>
                <Bar_Chart
                  startDate={startDate}
                  endDate={endDate}
                  width={full_width * 0.9}
                  height={full_width * 0.5 * 0.7}
                  data={data}
                  margin={10}
                  dataColor={dataColor}
                />
              </Box>
            </Grid>
            <Grid>
              <Box m={0}>
                <Line_Chart
                  startDate={startDate}
                  endDate={endDate}
                  width={full_width * 0.9}
                  height={full_width * 0.5 * 0.7}
                  data={data}
                  margin={10}
                  dataColor={dataColor}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid item sm={6}>
            <Box m={0}>{this.create_table(rows, columns)}</Box>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Portfolio_Detail_Page;
