import React from "react";
import Button from "@material-ui/core/Button";
import {
  makeStyles,
  withStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Data_Table from "../utils/data_table";
import Line_Chart from "../utils/line_chart";
import Bar_Chart from "../utils/barchart";
import Paper from "@material-ui/core/Paper";

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
    field: "name",
    headerName: "Name",
    width: 150,
    editable: true,
  },
  {
    field: "description",
    headerName: "Description",
    width: 300,
    editable: true,
  },
  {
    field: "create",
    headerName: "Create",
    type: "date",
    width: 150,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    name: "Industry",
    description: "Industry Leader",
    create: "2021-01-02",
  },
  {
    id: 2,
    name: "Technical",
    description: "Tenical Indicator Selection",
    create: "2021-01-01",
  },
];

class Portfolio_Detail_Page extends React.Component {
  constructor(props) {
    super(props);
    this.create_table = this.create_table.bind(this);
  }

  create_table(rows, columns) {
    return Data_Table(rows, columns);
  }

  render() {
    let full_width = window.innerWidth * 0.5;
    return (
      <div>
        <Grid container spacing={12}>
          <Grid item sm={12}>
            <Paper elevation={3}>
              <Line_Chart
                startDate={startDate}
                endDate={endDate}
                width={full_width}
                height={full_width * 0.5 + 20}
                data={data}
                margin={10}
                dataColor={dataColor}
              />
            </Paper>
          </Grid>
          <Grid item sm={6}>
            <Grid>
              <Paper elevation={2}>
                <Bar_Chart
                  startDate={startDate}
                  endDate={endDate}
                  width={full_width * 0.9}
                  height={full_width * 0.5 * 0.7}
                  data={data}
                  margin={10}
                  dataColor={dataColor}
                />
              </Paper>
            </Grid>
            <Grid>
              <Paper elevation={2}>
                <Line_Chart
                  startDate={startDate}
                  endDate={endDate}
                  width={full_width * 0.9}
                  height={full_width * 0.5 * 0.7}
                  data={data}
                  margin={10}
                  dataColor={dataColor}
                />
              </Paper>
            </Grid>
          </Grid>
          <Grid item sm={6}>
            <Paper elevation={3}>{this.create_table(rows, columns)}</Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Portfolio_Detail_Page;
