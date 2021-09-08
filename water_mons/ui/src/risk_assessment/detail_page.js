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
import Box from "@material-ui/core/Box";
import Basic_Bar from "../utils/echart_bar";
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

let rows = [
  { id: 1, stock_name: "AT.TO", price: 12 },
  { id: 1, stock_name: "AT.TO", price: 12 },
  { id: 1, stock_name: "AT.TO", price: 12 },
];

let columns = [
  { field: "stock_name", headerName: "Stock Name", width: 200 },
  { field: "price", headerName: "Price Name", width: 150 },
];
let LineData = [
  { Date: "2021-01-01", "BB.TO": 11 },
  { Date: "2021-01-02", "BB.TO": 11 },
  { Date: "2021-01-03", "BB.TO": 11 },
];

class Risk_Assessment_Detail_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assessmentName: props.match.params.name,
      compositionTableRow: [],
      compositionTableCol: [],
      compositionTickers: [],
      portfolioCompoRow: [],
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
      ]
    }
    this.get_portfolio_stocks = this.get_portfolio_stocks.bind(this);
    this.get_portfolio_performance = this.get_portfolio_performance.bind(this);
  }

  create_table(rows, columns) {
    const { path, url } = this.props.match;
    return Data_Table(rows, columns, (e) => {
      console.log(e.row.name);
      this.props.history.push(`${path}/detail/${e.row.name}`);
    });
  }

  async componentDidMount() {
    this.update_all();
  }

  async componentDidUpdate() {
  }

  async update_all() {
    await this.get_portfolio_stocks();
    await this.get_portfolio_performance();
  }

  async get_portfolio_performance(){
    let queryInfo = {
      assessment_name: this.state.assessmentName,
      startDate: "2021-01-01",
      endDate: "2021-12-31",
    };
    const data = await fetch(
      "http://localhost:5000/db/getBasePortfolioPerformance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryInfo),
      }
    ).then((d) => d.json());
    this.setState({ portfolioCompoRow: data });
  }

  async get_portfolio_stocks() {
    let queryInfo = {
      assessment_name: this.state.assessmentName,
      startDate: "2021-01-01",
      endDate: "2021-12-31",
    };
    const data = await fetch(
      "http://localhost:5000/db/getBasePortfolioStocks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryInfo),
      }
    ).then((d) => d.json());

    let compositionTableCol = [
      { field: "Date", headerName: "Date", width: 200 },
    ];
    let compositionTableRow = [];
    let compositionTickers = [];

    data.map((d, ix) => {
      let tmp = { id: ix };
      for (const [key, value] of Object.entries(d)) {
        if (key != "Date") compositionTickers.push(key);
        tmp[key] = value;
      }
      compositionTableRow.push(tmp);
    });

    compositionTickers = [...new Set(compositionTickers)];
    compositionTickers.map((d) => {
      compositionTableCol.push({ field: d, headerName: d, width: 200 });
    });
    this.setState({
      compositionTickers: compositionTickers,
      compositionTableCol: compositionTableCol,
      compositionTableRow: compositionTableRow,
    });
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
    return (
      <div>
        <Grid container spacing={12}>
          <Grid item container sm={12} justifyContent="center">
            <h1>Portfolio: {this.state.assessmentName}</h1>
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
          <Grid container justifyContent="left">
            <Grid sm={12}>
              <Box m={5} ml={21} mr={21}>
                {this.create_table(this.state.compositionTableRow, this.state.compositionTableCol)}
              </Box>
            </Grid>
          </Grid>
          <Grid container justifyContent="left">
            <Grid sm={5}>
              <Box ml={21}>{this.create_table(this.state.portfolioCompoRow, this.state.performanceColumn)}</Box>
            </Grid>
            <Grid sm={6}>
              <Box ml={15} mr={5}>
                <Basic_Line data={LineData} xCol={"Date"} />
              </Box>
            </Grid>
          </Grid>
          <Grid container justifyContent="left">
            <Grid sm={6}>
              <Box mt={5}>
                <Basic_Line data={LineData} xCol={"Date"} />
              </Box>
            </Grid>
            <Grid sm={6}>
              <Box mt={5}>
                <Efficient_Frontier
                  tickerList={this.state.compositionTickers}
                  method={"sharpe"}
                  startDate={"2021-01-01"}
                  endDate={"2021-01-21"}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Risk_Assessment_Detail_Page;
