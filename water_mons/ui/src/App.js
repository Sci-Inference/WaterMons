import logo from './logo.svg';
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

function Home() {
  return <h2>Home</h2>;
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
