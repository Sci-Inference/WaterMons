import React from "react";
import Button from "@material-ui/core/Button";
import {
  makeStyles,
  withStyles,
  createTheme,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Data_Table from "../utils/data_table";
import Box from "@material-ui/core/Box";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import Portfolio_Detail_Page from "./detail_page";

function DetailPage() {
  return <h1>1232</h1>;
}

class Portfolio_Landing_Page extends React.Component {
  constructor(props) {
    super(props);
    this.create_table = this.create_table.bind(this);
    this.theme = createMuiTheme({
      palette: {
        primary: {
          main: "#E9E9E9",
          contrastText: "#A5A5A5",
        },
      },
    });

    this.styleClass = makeStyles({
      root: {
        backgroundColor: "red",
        margin: "10",
      },
    });

    this.columns = [
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

    this.rows = [
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
  }

  create_route(path) {
    let res = this.rows.map((d) => {
      console.log(path);
      return (
        // <Route path={`${path}/:${d.name}`} >
        <Route path="/task">
          <Portfolio_Detail_Page />
        </Route>
      );
    });
    console.log(res);
    return res;
  }

  create_table(rows, columns) {
    const { path, url } = this.props.match;
    return Data_Table(rows, columns, (e) => {
      console.log(e.row.name);
      this.props.history.push(`${path}/${e.row.name}`);
    });
  }

  render() {
    const { path, url } = this.props.match;
    return (
      <div>
        <Container>
          <Grid container spacing={12}>
            <Grid item xs={1} className={this.styleClass.root}>
              <ThemeProvider theme={this.theme}>
                <Box pb={5}>
                  <Button
                    variant="contained"
                    color={"primary"}
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Create
                  </Button>
                </Box>
              </ThemeProvider>
            </Grid>
            <Grid item xs={12} alignContent={"center"}>
              {this.create_table(this.rows, this.columns)}
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default withRouter(Portfolio_Landing_Page);
