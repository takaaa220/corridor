import * as React from "react";
import * as ReactDOM from "react-dom";

export interface AppProps {}

export interface AppState {}

class App extends React.Component<AppProps, AppState> {
  render() {
    return <div>hello</div>;
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
