import * as React from "react";
import * as ReactDOM from "react-dom";
import Board from "./components/Board";

enum BoardType {
  None,
  P1,
  P2
}

export interface AppProps {}

export interface AppState {
  boards: BoardType[];
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      boards: this.init()
    };
  }

  init(): BoardType[] {
    const boards: BoardType[] = Array(81).fill(BoardType.None);
    boards[36] = BoardType.P1;
    boards[44] = BoardType.P2;

    return boards;
  }

  render() {
    return (
      <div className="app">
        <Board boards={this.state.boards} />
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
