import logo from './logo.png';
import './App.css';
import App_Bar from './layout/navi_bar';
import '@fontsource/roboto';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Portfolio_Landing_Page from './portfolio/landing_page';
import Portfolio_Detail_Page from "./portfolio/detail_page"
import Portfolio_Create_Page from './portfolio/create_page';
import Portfolio_Insert_Page from './portfolio/insert_page';
import Strategy_Landing_Page from "./strategy/landing_page";
import Strategy_Insert_Page from "./strategy/insert_page";
import Strategy_Create_Page from "./strategy/create_page";
import Strategy_Detail_Page from './strategy/detail_page';
import Basic_Line from './utils/echart_line';
import { Fragment } from 'react';



let data = [
  { Date: "2021-07-21", Base: -21.00000076293945,AT:10 },
  { Date: "2021-07-22", Base: -21.00000076293945,AT:10 },
  { Date: "2021-07-23", Base: -25.140000152587888,AT:21 },
  { Date: "2021-07-24", Base: -25.140000152587888,AT:22 },
  { Date: "2021-07-25", Base: -25.140000152587888,AT:22 },
  { Date: "2021-07-26", Base: -25.140000152587888,AT:21 },
  { Date: "2021-07-27", Base: -25.140000152587888,AT:23 },
  { Date: "2021-07-28", Base: -25.140000152587888,AT:21 },
  { Date: "2021-07-29", Base: -25.140000152587888,AT:25 },
  { Date: "2021-07-30", Base: -25.140000152587888,AT:21 },
  { Date: "2021-07-31", Base: -25.140000152587888,AT:21 },
];




function Home() {
  return <Fragment>
    <h1>Home</h1>
    <br/>
    <img src={logo} alt="Kiwi standing on oval"  width={"300"} height={"300"}></img>
    <Basic_Line data={data} xCol={'Date'}/>
  </Fragment>
}

function Portfolio() {
  return <Portfolio_Landing_Page/>;
}
function Strategy() {
  return <h2>Strategy</h2>;
}
function BackTest() {
  return <h2>Back</h2>;
}
function RiskAssessment() {
  return <h2>Risk</h2>;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <div>
            <App_Bar />
            <Switch>
              <Route exact path='/' component={Home}></Route>
              <Route path="/portfolio" component={Portfolio_Landing_Page}>
                <Route exact path="/portfolio" component={Portfolio_Landing_Page}/>
                <Route exact path="/portfolio/create" component={Portfolio_Create_Page}/>
                <Route exact path="/portfolio/insert" component={Portfolio_Insert_Page}/>
                <Route path="/portfolio/detail/:name" component={Portfolio_Detail_Page}/>
              </Route>
              <Route path="/strategy" component={Strategy_Landing_Page}>
                <Route exact path="/strategy" component={Strategy_Landing_Page}/>
                <Route exact path="/strategy/create" component={Strategy_Create_Page}/>
                <Route exact path="/strategy/insert" component={Strategy_Insert_Page}/>
                <Route path="/strategy/detail/:name" component={Strategy_Detail_Page}/>
              </Route>
              <Route path="/back-test">
                <BackTest />
              </Route>
              <Route path="/assessment">
                <RiskAssessment />
              </Route>
            </Switch>
          </div>
        </Router>
      </header>
    </div>
  );
}

export default App;
