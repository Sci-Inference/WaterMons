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


class Risk_Assessment_Detail_Page extends React.Component {
  constructor(props) {
    super(props);
    this.fronteirRef = React.createRef();
    this.state = {
      assessmentName: props.match.params.name,
      holdingPercentRadio:'share',
      performanceLineBarControl:'line',
      performanceLineBarMode:false, // cumulative is true
      performanceLineBarData:[],
      efficientFrontierWeight:[],
      startDate:new Date("2021-07-01"),
      endDate:new Date("2021-07-31"),
      holdingPercentageData:[],
      efficientFrontierTicker:[],
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
    this.get_efficient_frontier_percent = this.get_efficient_frontier_percent.bind(this);
    this.get_holding_percentage_data = this.get_holding_percentage_data.bind(this);
    this.get_performance_line_bar_data = this.get_performance_line_bar_data.bind(this);
    this.handleendDateChange = this.handleendDateChange.bind(this);
    this.handlestartDateChange = this.handlestartDateChange.bind(this);
    this.handle_holding_percent_radio_change = this.handle_holding_percent_radio_change.bind(this);
    this.handle_performance_line_bar_change = this.handle_performance_line_bar_change.bind(this);
    this.handle_performance_line_bar_mode_change = this.handle_performance_line_bar_mode_change.bind(this);
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
    console.log('frontier')
    console.log(this.fronteirRef.current)
  }

  async componentDidUpdate() {
    console.log(this.state.efficientFrontierTicker)
  }

  async update_all(
    startDate=this.state.startDate.toISOString().split(["T"])[0], 
    endDate = this.state.endDate.toISOString().split(["T"])[0]
    ) {
    console.log(startDate)
    await this.get_portfolio_stocks(startDate,endDate);
    await this.get_portfolio_performance(startDate,endDate);
    await this.get_holding_percentage_data(this.state.holdingPercentRadio,startDate,endDate);
    await this.get_performance_line_bar_data(this.state.performanceLineBarMode,startDate,endDate);
  }

  async get_portfolio_performance(
    startDate=this.state.startDate.toISOString().split(["T"])[0], 
    endDate = this.state.endDate.toISOString().split(["T"])[0]
    ){
    let queryInfo = {
      assessment_name: this.state.assessmentName,
      startDate: startDate,
      endDate: endDate,
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

  async get_performance_line_bar_data(
    mode,
    startDate=this.state.startDate.toISOString().split(["T"])[0],
    endDate = this.state.endDate.toISOString().split(["T"])[0]
    ){
    let queryInfo = {
      assessment_name: this.state.assessmentName,
      startDate: startDate,
      endDate: endDate,
      mode:mode
    };
    const data = await fetch(
      "http://localhost:5000/db/getPerformanceLineBar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryInfo),
      }
    ).then((d) => d.json());
    this.setState({'performanceLineBarData':data})
  }

  async get_holding_percentage_data(
    mode,
    startDate=this.state.startDate.toISOString().split(["T"])[0], 
    endDate = this.state.endDate.toISOString().split(["T"])[0]
    ){
    let queryInfo = {
      assessment_name: this.state.assessmentName,
      startDate: startDate,
      endDate: endDate,
      mode:mode
    };
    const data = await fetch(
      "http://localhost:5000/db/getPortfolioHoldingPercent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryInfo),
      }
    ).then((d) => d.json());
    console.log('holding')
    console.log(data)
    let res = [];
    Object.keys(data).map((e)=>{
      if (e != 'Date'){
        res.push([e,data[e]])
      }
    })
    this.setState({ holdingPercentageData: res });
  }

  async get_portfolio_stocks(
    startDate=this.state.startDate.toISOString().split(["T"])[0], 
    endDate = this.state.endDate.toISOString().split(["T"])[0]
    ) {
    let queryInfo = {
      assessment_name: this.state.assessmentName,
      startDate: startDate,
      endDate: endDate,
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

  get_efficient_frontier_percent(data){
    console.log('chart click data')
    console.log(data)
    this.setState({
      efficientFrontierWeight:data['weights'],
      efficientFrontierTicker:data['tickers']
    })
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


  handlestartDateChange(date) {
    this.setState({ startDate: date });
    this.update_all(date,this.state.endDate);
  }

  handleendDateChange(date) {
    this.setState({ endDate: date });
    this.update_all(this.state.startDate,date);
  }

  handle_holding_percent_radio_change (event) {
    console.log(event.target.value)
    this.setState({holdingPercentRadio:event.target.value});
    this.get_holding_percentage_data(event.target.value)
  };

  handle_performance_line_bar_change (event) {
    console.log(event.target.value)
    this.setState({performanceLineBarControl:event.target.value});
  };

  handle_performance_line_bar_mode_change(event){
    this.setState({performanceLineBarMode:event.target.checked});
    this.get_performance_line_bar_data(event.target.checked);
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
                {this.create_table(
                  this.state.compositionTableRow,
                  this.state.compositionTableCol
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid container justifyContent="left">
            <Grid sm={5}>
              <Box ml={21}>
                {this.create_table(
                  this.state.portfolioCompoRow,
                  this.state.performanceColumn
                )}
              </Box>
            </Grid>
            <Grid sm={6}>
              <Box ml={15} mr={5} height="100%">
                <Efficient_Frontier
                  tickerList={this.state.compositionTickers}
                  method={"sharpe"}
                  startDate={this.state.startDate.toISOString().split(["T"])[0]}
                  endDate={this.state.endDate.toISOString().split(["T"])[0]}
                  ref={this.fronteirRef}
                  onClick={this.get_efficient_frontier_percent}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container justifyContent="left">
            <Grid sm={6}>
              <Box mt={5}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="selectType"
                    name="selectType"
                    value={this.state.performanceLineBarControl}
                    onChange={this.handle_performance_line_bar_change}
                  >
                    <FormControlLabel
                      value="line"
                      control={<Radio />}
                      label="Line"
                    />
                    <FormControlLabel
                      value="bar"
                      control={<Radio />}
                      label="Bar"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.performanceLineBarMode}
                        onChange={this.handle_performance_line_bar_mode_change}
                        name="cumulative"
                        color="primary"
                      />
                    }
                    label="Cumulative Performance"
                  />
                </FormControl>
                {this.state.performanceLineBarControl === 'line'? 
                <Basic_Line data={this.state.performanceLineBarData} xCol={"Date"} />:
                <Basic_Bar data={this.state.performanceLineBarData} xCol={"Date"} />}
              </Box>
            </Grid>
            <Grid sm={6}>
              <Box mt={5}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="selectType"
                    name="selectType"
                    value={this.state.holdingPercentRadio}
                    onChange={this.handle_holding_percent_radio_change}
                  >
                    <FormControlLabel
                      value="share"
                      control={<Radio />}
                      label="Share"
                    />
                    <FormControlLabel
                      value="value"
                      control={<Radio />}
                      label="Value"
                    />
                    <FormControlLabel
                      value="share-value"
                      control={<Radio />}
                      label="Share-Value"
                    />
                  </RadioGroup>
                </FormControl>
                <Basic_Pie data={this.state.holdingPercentageData} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Risk_Assessment_Detail_Page;
