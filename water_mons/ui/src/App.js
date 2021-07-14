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
import Portfolio_Detail_Page from './portfolio/detail_page';


function Home() {
  return <h2>Home</h2>;
}

function Portfolio() {
  // return <Portfolio_Landing_Page/>;
  return <Portfolio_Detail_Page/>
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
              <Route path="/portfolio">
                <Portfolio />
              </Route>
              <Route path="/strategy">
                <Strategy />
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
