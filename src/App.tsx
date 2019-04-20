import * as React from "react";
import * as ReactDOM from "react-dom";
import Board from "./components/Board";

type Tarn = 0 | 1;
export interface AppProps {}

export interface AppState {
  stone: number[];
  hWall: boolean[];
  wWall: boolean[];
  tarn: Tarn;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      stone: [36, 44],
      hWall: Array(72).fill(false),
      wWall: Array(72).fill(false),
      tarn: 0
    };

    this.moveCharacter = this.moveCharacter.bind(this);
  }

  isWall(isW: boolean, x: any, y: any): boolean {
    const interval = isW ? 9 : 8;
    const index = x + y * interval;
    return isW ? this.state.wWall[index] : this.state.hWall[index];
  }

  isEnemy(i: any, j: any, x: any, y: any): number | null {
    // 端の判定
    if (x + i < 0 || x + i >= 9 || y + j < 0 || y + j >= 9) {
      return null;
    }

    // 壁判定
    if (this.isWall(i === 0, i === 1 ? x : x + i, j === 1 ? y : y + j)) {
      return null;
    }

    const index = x + i + 9 * (y + j);
    const enemy = this.state.stone[this.state.tarn === 0 ? 1 : 0];
    if (enemy === index) {
      return this.isEnemy(i, j, x + i, y + j);
    }

    return index;
  }

  canPut(index: any): boolean {
    const { stone, tarn } = this.state;
    if (stone.includes(index)) {
      return false;
    }
    const nums = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const canPutPlace = [];
    for (let i = 0; i < nums.length; i += 1) {
      canPutPlace.push(this.isEnemy(nums[i][0], nums[i][1], stone[tarn] % 9, Math.floor(stone[tarn] / 9)));
    }
    return canPutPlace.includes(index);
  }

  moveCharacter(index: any) {
    console.log("---");
    if (this.canPut(index)) {
      const { stone, tarn } = this.state;
      stone[tarn] = index;
      this.setState({ stone, tarn: tarn === 0 ? 1 : 0 });
    }
  }

  render() {
    const { stone, hWall, wWall } = this.state;
    return (
      <div className="app">
        <Board stone={stone} moveCharacter={this.moveCharacter} hWall={hWall} wWall={wWall} />
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
