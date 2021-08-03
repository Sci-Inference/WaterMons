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
import getOverlappingDaysInIntervals from "date-fns/esm/fp/getOverlappingDaysInIntervals/index.js";

let margin = 50;

class Portfolio_Detail_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date("2021-07-01"),
      endDate: new Date("2021-07-31"),
      benchmarkList: [],
      strategyName: props.match.params.name,
      performanceRow: [],
      performanceColumn: [
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
      ],
      lineChartData: [],
      barChartData: [],
      dataCategory: [],
    };
    this.create_table = this.create_table.bind(this);
    this.fetch_stockData = this.fetch_stockData.bind(this);
    this.handleCompareField = this.handleCompareField.bind(this);
    this.handleendDateChange = this.handleendDateChange.bind(this);
    this.handlestartDateChange = this.handlestartDateChange.bind(this);
    this.createSelectedBenchmark = this.createSelectedBenchmark.bind(this);
    this.create_date_range_filter = this.create_date_range_filter.bind(this);
    this.updatePortflioData = this.updatePortflioData.bind(this);
    this.fetch_portfolioData = this.fetch_portfolioData.bind(this);
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

  async fetch_performanceData(queryInfo) {
    const data = await fetch("http://localhost:5000/db/getPerformance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryInfo),
    }).then((d) => d.json());
    this.setState({ performanceRow: data });

    return data;
  }

  componentDidMount() {
    this.updatePortflioData(this.state.benchmarkList);
  }

  componentDidUpdate() {
    console.log(`component did update ${this.state.benchmarkList}`);
  }

  async fetch_portfolioData(queryInfo, withoutUpdate = false) {
    const data = await fetch("http://localhost:5000/db/getPortfolioStockData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryInfo),
    }).then((d) => d.json());
    this.updateStateLineChart(data);
    this.updateBarChart(data);
    this.updateStateDataCategory([{ ticker: "portfolio_value" }]);
    return data;
  }

  async fetch_stockData(queryInfo) {
    const data = await fetch("http://localhost:5000/db/getStockData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryInfo),
    }).then((d) => d.json());

    let devData = this.stock_data_to_date_dict(data);
    this.updateStateLineChart(devData);
    this.updateBarChart(devData);
    this.updateStateDataCategory(data);
    this.updatePortflioData(queryInfo.ticker);
  }

  updatePortflioData(benchmarkList) {
    let queryInfo = {
      startDate: this.state.startDate.toISOString().split(["T"])[0],
      endDate: this.state.endDate.toISOString().split(["T"])[0],
      portfolio_name: this.state.strategyName,
      padding: true,
      benchmarks: benchmarkList,
    };
    let pData = this.fetch_portfolioData(queryInfo);
    let peroformance_data = this.fetch_performanceData(queryInfo);
    let columnInfo = [...this.state.performanceColumn];
    benchmarkList.map((d) => {
      let tmp = {
        width: 150,
        editable: true,
      };
      tmp["field"] = d;
      tmp["headerName"] = d;
      columnInfo.push(tmp);
    });
    this.setState({ performanceColumn: columnInfo });
  }

  updateStateLineChart(devData) {
    let orgData = this.state.lineChartData;
    orgData.map((d) => {
      if (devData[d["Date"]] !== undefined) {
        devData[d["Date"]]["portfolio_value"] = d["portfolio_value"];
      }
    });
    let lineChartData = orgData;
    if (Object.keys(devData).length > 0) {
      lineChartData = Object.keys(devData).map((d) => {
        let tmp = {};
        tmp["Date"] = d;
        Object.keys(devData[d]).map((k) => {
          tmp[k] = devData[d][k];
        });
        return tmp;
      });
    } else {
      lineChartData = lineChartData.map((d) => {
        return { Date: d["Date"], portfolio_value: d["portfolio_value"] };
      });
    }
    lineChartData = lineChartData.sort((first, sec) => {
      if (first["Date"] > sec["Date"]) {
        return 1;
      } else {
        return -1;
      }
    });
    this.setState({ lineChartData: lineChartData });
  }

  updateBarChart(devData) {
    let devDatacp = { ...devData };
    let orderedDate = Object.keys(devData).sort((a, b) => {
      if (a > b) {
        return 1;
      } else {
        return -1;
      }
    });
    orderedDate.map((d, index) => {
      if (index == 0) {
        return undefined;
      }
      let tmp = {};
      Object.keys(devDatacp[d]).map((j) => {
        tmp[j] = devDatacp[d][j] - devDatacp[orderedDate[index - 1]][j];
      });
      devData[d] = tmp;
    });
    let orgData = this.state.barChartData;
    orgData.map((d) => {
      if (devData[d["Date"]] !== undefined) {
        devData[d["Date"]]["portfolio_value"] = d["portfolio_value"];
      }
    });
    let barChartData = orgData;
    if (Object.keys(devData).length > 0) {
      barChartData = Object.keys(devData).map((d) => {
        let tmp = {};
        tmp["Date"] = d;
        Object.keys(devData[d]).map((k) => {
          tmp[k] = devData[d][k];
        });
        return tmp;
      });
    } else {
      barChartData = barChartData.map((d) => {
        return { Date: d["Date"], portfolio_value: d["portfolio_value"] };
      });
    }
    barChartData = barChartData.sort((first, sec) => {
      if (first["Date"] > sec["Date"]) {
        return 1;
      } else {
        return -1;
      }
    });
    this.setState({ barChartData: barChartData });
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
        orgDataCategory[i]["name"] != "portfolio_value"
      ) {
        orgDataCategory.splice(i, 1);
      }
    }
    this.setState({ dataCategory: orgDataCategory });
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
      let queryInfo = {
        ticker: benchmark,
        startDate: this.state.startDate.toISOString().split("T")[0],
        endDate: this.state.endDate.toISOString().split("T")[0],
      };
      this.fetch_stockData(queryInfo);
    }
  }

  OnClick_deleteSelectedBenchmark(e) {
    let selectValue = e.currentTarget.value;
    let benchmark = [...this.state.benchmarkList].filter(
      (d) => d != selectValue
    );
    this.setState({
      benchmarkList: benchmark,
    });
    let queryInfo = {
      ticker: benchmark,
      startDate: this.state.startDate.toISOString().split("T")[0],
      endDate: this.state.endDate.toISOString().split("T")[0],
    };
    this.fetch_stockData(queryInfo);
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
            <h1>Portfolio: {this.state.strategyName}</h1>
          </Grid>
          <Grid item sm={1}></Grid>
          <Grid
            item
            sm={10}
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
                <Grid item sm={10} container>
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
                <Grid item sm={10} alignContent="center" container>
                  {this.createSelectedBenchmark()}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item sm={1}></Grid>
          <Grid item sm={6}>
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

          <Grid item sm={6}>
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
                  {this.create_table(
                    this.state.performanceRow,
                    this.state.performanceColumn
                  )}
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
          <Grid item sm={3}></Grid>
          <Grid item sm={6} alignContent="center">
            <Box m={0}>
              {this.create_table(
                this.state.performanceRow,
                this.state.performanceColumn
              )}
            </Box>
          </Grid>
        </Grid>
        <Grid item sm={3}></Grid>
      </div>
    );
  }
}

export default Portfolio_Detail_Page;
