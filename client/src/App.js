import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Army from "./component/Army";
import AddArmy from "./component/AddArmy";
import EditArmy from "./component/EditArmy"
import "./App.css"
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={Army} />
            <Route path="/AddArmy" exact component={AddArmy} />
            <Route path="/EditArmy/:id" exact component={EditArmy} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
