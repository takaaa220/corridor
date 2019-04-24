import * as React from "react";
import * as ReactDOM from "react-dom";
import Board from "./components/Board";
import * as ReactModal from "react-modal";
import InitialModal from "./components/InitialModal";
import Loading from "./components/Loading";
import { firestore } from "./utils/firebase";

enum Status {
  Stone,
  Vertical,
  Horizon
}

type Tarn = 0 | 1;
export interface AppProps {}

export interface AppState {
  recordId: number;
  stone: number[];
  hWall: boolean[];
  wWall: boolean[];
  tarn: Tarn;
  status: Status;
  hadWalls: number[];
  winner: Tarn | null;
  roomId: string;
  isIniting: boolean;
  isLoading: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      recordId: 0,
      stone: [36, 44],
      hWall: Array(72).fill(false),
      wWall: Array(72).fill(false),
      tarn: 0,
      status: Status.Stone,
      hadWalls: [10, 10],
      winner: null,
      roomId: "",
      isIniting: true,
      isLoading: false
    };

    this.moveCharacter = this.moveCharacter.bind(this);
    this.putHWall = this.putHWall.bind(this);
    this.putWWall = this.putWWall.bind(this);
    this.initFunc = this.initFunc.bind(this);
    this.setRoomId = this.setRoomId.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.endLoading = this.endLoading.bind(this);
    this.checkLoading = this.checkLoading.bind(this);
  }

  checkLoading(): boolean {
    return this.state.isLoading;
  }

  startLoading() {
    this.setState({ isLoading: true });
  }

  endLoading() {
    this.setState({ isLoading: false });
  }

  initFunc() {
    firestore
      .collection("rooms")
      .add({
        hWalls: [-1, -1],
        wWalls: [-1, -1],
        hasWalls: [10, 10]
      })
      .then(ref => {
        this.setRoomId(ref.id);
      })
      .catch(error => {
        console.log(error);
        alert("errorが発生しました．リロードして下さい");
      });
    this.endLoading();
  }

  setRoomId(roomId: string) {
    this.setState({ roomId, isIniting: false });
  }

  postRecord(type: Status, record: number) {
    const { recordId, roomId } = this.state;
    firestore
      .collection("records")
      .doc()
      .set({ roomId, recordId, type, record })
      .then(() => {
        this.setState({ recordId: recordId + 1 });
        console.log("finished!");
      })
      .catch(error => {
        console.error(error);
      });
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
    if (this.state.status === Status.Stone && this.canPut(index)) {
      const { stone, tarn } = this.state;
      stone[tarn] = index;
      this.setState({ stone });
      this.postRecord(Status.Stone, index);
      this.chagneTarn();
    }
  }

  putHWall(index: any) {
    if (this.state.status !== Status.Vertical || this.state.hadWalls[this.state.tarn] === 0) {
      return;
    }

    // 一番下はおけない
    if (64 <= index && index < 72) {
      return;
    }

    const hWall = this.state.hWall;
    if (hWall[index] || hWall[index + 8]) {
      return;
    }

    hWall[index] = true;
    hWall[index + 8] = true;

    const hadWalls = this.state.hadWalls;
    hadWalls[this.state.tarn] -= 1;
    this.setState({ hWall, hadWalls, status: Status.Stone });
    this.postRecord(Status.Vertical, index);
    this.chagneTarn();
  }

  putWWall(index: any) {
    if (this.state.status !== Status.Horizon || this.state.hadWalls[this.state.tarn] === 0) {
      return;
    }

    if (index % 9 === 8) {
      return;
    }

    const wWall = this.state.wWall;
    if (wWall[index] || wWall[index + 1]) {
      return;
    }

    wWall[index] = true;
    wWall[index + 1] = true;

    const hadWalls = this.state.hadWalls;
    hadWalls[this.state.tarn] -= 1;
    console.log(hadWalls);
    this.setState({ wWall, hadWalls, status: Status.Stone });
    this.postRecord(Status.Horizon, index);
    this.chagneTarn();
  }

  chagneTarn() {
    let winner: Tarn | null = null;
    if (this.state.stone[0] % 9 === 8) {
      winner = 0;
    } else if (this.state.stone[1] % 9 === 0) {
      winner = 1;
    }
    winner === null ? this.setState({ tarn: this.state.tarn === 1 ? 0 : 1 }) : this.setState({ winner });
  }

  changeStatus(status: Status) {
    this.setState({ status });
  }

  render() {
    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        fontSize: "40px"
      }
    };
    const { tarn, stone, hWall, wWall, status, hadWalls, winner, isIniting } = this.state;
    return (
      <div className="app">
        <div className="app__player">
          {tarn === 0 ? <p style={{ color: "red" }}>あなたのターンです！</p> : null}
          <h3>Player1 (黄)</h3>
          <p>残り壁枚数：{hadWalls[0]}枚</p>
        </div>
        <div className="app__board">
          <Board
            stone={stone}
            moveCharacter={this.moveCharacter}
            hWall={hWall}
            wWall={wWall}
            putWWall={this.putWWall}
            putHWall={this.putHWall}
            status={status}
          />
          <div>
            <div className="app__buttons">
              <div
                className={`app__button${status === Status.Stone ? " app__button_selected" : ""}`}
                onClick={this.changeStatus.bind(this, Status.Stone)}
              >
                石を動かす
              </div>
              <div
                className={`app__button${status === Status.Vertical ? " app__button_selected" : ""}`}
                onClick={this.changeStatus.bind(this, Status.Vertical)}
              >
                縦の壁を置く
              </div>
              <div
                className={`app__button${status === Status.Horizon ? " app__button_selected" : ""}`}
                onClick={this.changeStatus.bind(this, Status.Horizon)}
              >
                横の壁を置く
              </div>
            </div>
            <p>
              マウスカーソルが矢印のときはPlayerを移動させる事ができる．
              <br />
              マウスカーソルが黄色の壁のときは壁を設置することができる．
            </p>
          </div>
        </div>
        <div className="app__player">
          {tarn === 1 ? <p style={{ color: "red" }}>あなたのターンです！</p> : null}
          <h3>Player2 (グレー)</h3>
          <p>残り壁枚数：{hadWalls[0]}枚</p>
        </div>
        <ReactModal isOpen={winner !== null} style={customStyles}>
          {winner === 0 ? "Player1" : "Player2"} の勝ち
        </ReactModal>
        <InitialModal
          isOpen={isIniting}
          initFunc={this.initFunc}
          setRoomId={this.setRoomId}
          startLoading={this.startLoading}
          endLoading={this.endLoading}
          checkLoading={this.checkLoading}
        />
        <Loading isLoading={this.state.isLoading} />
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
