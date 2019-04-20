import * as React from "react";
import * as ReactDOM from "react-dom";
import Board from "./components/Board";

export interface AppProps {}

export interface AppState {
  p1: number;
  p2: number;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      p1: 36,
      p2: 44
    };
  }

  moveCharacter() {}

  render() {
    const { p1, p2 } = this.state;
    return (
      <div className="app">
        <Board p1={p1} p2={p2} />
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
