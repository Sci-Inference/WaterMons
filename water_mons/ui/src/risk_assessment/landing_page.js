import React from "react";
import Button from "@material-ui/core/Button";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Data_Table from "../utils/data_table";
import Box from "@material-ui/core/Box";
import {
  withRouter,
} from "react-router-dom";
import CreateIcon from '@material-ui/icons/Create';


class Risk_Assessment_Landing_Page extends React.Component {
  constructor(props) {
    super(props);
    this.create_table = this.create_table.bind(this);
    this.handleCreateButton = this.handleCreateButton.bind(this);
    this.handleInsertButton = this.handleInsertButton.bind(this);
    this.state = {'rows':[]}
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
        field: "createdDate",
        headerName: "Create",
        type: "date",
        width: 200,
        editable: true,
      },
    ];

    this.rows = []
  }

  async componentDidMount() {
    let data = await fetch('http://localhost:5000/db/getRiskAssessment')
      .then(res => res.json())
    let rows = data.map((element,index)=>{
        element['id'] = index
        return element
    })
    console.log(rows)
    this.setState({'rows':rows})
    console.log(this.state.rows);
  }

  create_table(rows, columns) {
    const { path, url } = this.props.match;
    return Data_Table(rows, columns, (e) => {
      console.log(e.row.name);
      this.props.history.push(`${path}/detail/${e.row.name}`);
    });
  }

  handleCreateButton(){
    const { path, url } = this.props.match;
    this.props.history.push(`${path}/create`);
  }

  handleInsertButton(){
    const { path, url } = this.props.match;
    this.props.history.push(`${path}/insert`);
  }

  render() {
    return (
      <div>
        <Container>
          <Grid spacing={12}>
            <Grid sm={8} container className={this.styleClass.root} direction={'row'}>
              <ThemeProvider theme={this.theme}>
                <Grid sm={3}>
                  <Button
                    variant="contained"
                    color={"primary"}
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={this.handleCreateButton}
                  >
                    Create
                  </Button>
                </Grid>
                <Grid sm={3}>
                  <Button
                    variant="contained"
                    color={"primary"}
                    startIcon={<CreateIcon />}
                    onClick={this.handleInsertButton}
                  >
                    Insert
                  </Button>
                </Grid>
              </ThemeProvider>
            </Grid>
            <br/>
            <Grid item xs={12} alignContent={"center"}>
              {this.create_table(this.state.rows, this.columns)}
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default withRouter(Risk_Assessment_Landing_Page);
