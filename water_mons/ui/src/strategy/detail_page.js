import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Data_Table from "../utils/data_table";
import Line_Chart from "../utils/line_chart";
import Bar_Chart from "../utils/barchart";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import DeleteIcon from "@material-ui/icons/Delete";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";

let margin = 50;

class Strategy_Detail_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date("2021-07-01"),
      endDate: new Date("2021-07-31"),
      benchmarkList: [],
      strategyName: props.match.params.name,
      performanceRow: [],
      performanceColumn: [],
      lineChartData: [],
      barChartData: [],
      dataCategory: [],
      strategyCompCol: [
        {
          field: "ticker",
          headerName: "Ticker",
          width: 150,
          editable: true,
        },
        {
          field: "createdDate",
          headerName: "Date",
          width: 150,
          editable: true,
        },
        
        {
          field: "stock_signal",
          headerName: "Signal",
          width: 300,
          editable: true,
        },
      ],
      strategyCompoRow: [],
      strategyCompoDate: new Date("2021-07-01"),
    };
    this.create_table = this.create_table.bind(this);
    this.handlestrategyCompoDate = this.handlestrategyCompoDate.bind(this);
    this.handleCompareField = this.handleCompareField.bind(this);
    this.handleendDateChange = this.handleendDateChange.bind(this);
    this.handlestartDateChange = this.handlestartDateChange.bind(this);
    this.createSelectedBenchmark = this.createSelectedBenchmark.bind(this);
    this.create_date_range_filter = this.create_date_range_filter.bind(this);
    this.updateStrategyComposition = this.updateStrategyComposition.bind(this);
    this.OnClick_deleteSelectedBenchmark =
      this.OnClick_deleteSelectedBenchmark.bind(this);
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

  async componentDidMount() {
    console.log("mounted");
    this.updateAllState([]);
  }

  componentDidUpdate() {
    console.log(`component did update ${this.state.benchmarkList}`);
  }

  updateStateDataCategory(data) {
    let uniqueCate = [...new Set(data.map((item) => item.ticker))];
    let orgDataCate = this.state.dataCategory.map((d) => {
      return d["name"];
    });
    let dataCategory = uniqueCate.map((d) => {
      if (!orgDataCate.includes(d)) {
        return {
          time: "Date",
          name: d,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          dot: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        };
      }
    });
    let orgDataCategory = this.state.dataCategory;
    dataCategory.map((d) => {
      if (d !== undefined) {
        orgDataCategory.push(d);
      }
    });
    for (var i = 0; i < orgDataCategory.length; i++) {
      if (
        !uniqueCate.includes(orgDataCategory[i]["name"]) &&
        orgDataCategory[i]["name"] != "strategy_value"
      ) {
        orgDataCategory.splice(i, 1);
      }
    }
    this.setState({ dataCategory: orgDataCategory });
  }

  async updateLineChart(benchmarkList) {
    let queryInfo = {
      startDate: this.state.startDate.toISOString().split(["T"])[0],
      endDate: this.state.endDate.toISOString().split(["T"])[0],
      strategy_name: this.state.strategyName,
      padding: true,
      benchmarks: benchmarkList,
    };

    const data = await fetch(
      "http://localhost:5000/db/getStrategyLineChart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryInfo),
      }
    ).then((d) => d.json());
    this.setState({ lineChartData: data });
    console.log(data);
  }

  async updateBarChart(benchmarkList) {
    let queryInfo = {
      startDate: this.state.startDate.toISOString().split(["T"])[0],
      endDate: this.state.endDate.toISOString().split(["T"])[0],
      strategy_name: this.state.strategyName,
      padding: true,
      benchmarks: benchmarkList,
    };

    const data = await fetch(
      "http://localhost:5000/db/getPerformanceBarChart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryInfo),
      }
    ).then((d) => d.json());
    this.setState({ barChartData: data });
  }

  async updatestrategyPerformance(benchmarkList) {
    let performanceColumn = [
      {
        field: "metric",
        headerName: "Metrics",
        width: 150,
        editable: true,
      },
      {
        field: "Base",
        headerName: "Base",
        width: 300,
        editable: true,
      },
    ];

    benchmarkList.map((d) => {
      performanceColumn.push({
        field: d,
        headerName: d,
        width: 300,
        editable: true,
      });
    });

    let queryInfo = {
      startDate: this.state.startDate.toISOString().split(["T"])[0],
      endDate: this.state.endDate.toISOString().split(["T"])[0],
      strategy_name: this.state.strategyName,
      padding: true,
      benchmarks: benchmarkList,
    };

    const data = await fetch("http://localhost:5000/db/getPerformance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryInfo),
    }).then((d) => d.json());
    this.setState({ performanceRow: data });
    this.setState({ performanceColumn: performanceColumn });
  }

  updateAllState(benchmarkList) {
    let cateList = [{ ticker: "Base" }];
    benchmarkList.map((d) => {
      cateList.push({ ticker: d });
    });
    this.updateStateDataCategory(cateList);
    this.updateLineChart(benchmarkList);
    // this.updateBarChart(benchmarkList);
    // this.updatestrategyPerformance(benchmarkList);
    this.updateStrategyComposition()
  }

  stock_data_to_date_dict(data) {
    let devData = {};
    data.map((d) => {
      if (devData[d["Date"]] === undefined) {
        let tmp = {};
        tmp[d["ticker"]] = d["Close"];
        devData[d["Date"]] = tmp;
      } else {
        devData[d["Date"]][d["ticker"]] = d["Close"];
      }
    });
    return devData;
  }

  handleCompareField(e) {
    if (e.keyCode == 13) {
      let benchmark = [...this.state.benchmarkList, e.target.value];
      this.setState({
        benchmarkList: benchmark,
      });
      e.target.value = "";
      this.updateAllState(benchmark);
    }
  }

  async updateStrategyComposition() {
    let queryInfo = {
      startDate: this.state.startDate.toISOString().split(["T"])[0],
      endDate: this.state.endDate.toISOString().split(["T"])[0],
      strategy_name: this.state.strategyName,
    };

    let data = await fetch("http://localhost:5000/db/getStrategyStocks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryInfo),
    }).then((d) => d.json());
    this.setState({ strategyCompoRow: data });
  }

  handlestrategyCompoDate(e) {
    this.setState({ strategyCompoDate: e });
    this.updatestrategyComposition(e);
  }

  OnClick_deleteSelectedBenchmark(e) {
    let selectValue = e.currentTarget.value;
    let benchmark = [...this.state.benchmarkList].filter(
      (d) => d != selectValue
    );
    this.setState({
      benchmarkList: benchmark,
    });
    this.updateAllState(benchmark);
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
          <Grid item container sm={12} justifyContent="center">
            <h1>strategy: {this.state.strategyName}</h1>
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
                    <Typography>strategy Composition</Typography>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  {this.create_table(
                    this.state.strategyCompoRow,
                    this.state.strategyCompCol
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>

          <Grid
            direction={"column"}
            justifyContent="center"
            alignItems="center"
            item
            sm={6}
          >
            <Grid
              item
              sm={12}
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
                  <Grid item sm={6} alignContent="center" container>
                    {this.createSelectedBenchmark()}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item sm={12} alignContent="center">
              <Box m={12}>
                {this.create_table(
                  this.state.performanceRow,
                  this.state.performanceColumn
                )}
              </Box>
            </Grid>
          </Grid>

          <Grid direction={"column"} item sm={6}>
            <Grid item sm={12}>
              <Box m={5}>
                <Line_Chart
                  startDate={this.state.startDate.toISOString().split("T")[0]}
                  endDate={this.state.endDate.toISOString().split("T")[0]}
                  width={full_width * 0.8}
                  height={full_width * 0.5 * 0.9}
                  data={this.state.lineChartData}
                  margin={10}
                  dataColor={this.state.dataCategory}
                />
              </Box>
            </Grid>
            <Grid item sm={12}>
              <Box m={5}>
                <Bar_Chart
                  startDate={this.state.startDate.toISOString().split("T")[0]}
                  endDate={this.state.endDate.toISOString().split("T")[0]}
                  width={full_width * 0.8}
                  height={full_width * 0.5 * 0.9}
                  data={this.state.barChartData}
                  margin={10}
                  dataColor={this.state.dataCategory}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Strategy_Detail_Page;
