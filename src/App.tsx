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
  gaps: boolean[];
  tarn: Tarn;
  status: Status;
  hadWalls: number[];
  winner: Tarn | null;
  roomId: string;
  isIniting: boolean;
  isLoading: boolean;
  player: Tarn;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      recordId: 0,
      stone: [36, 44],
      hWall: Array(72).fill(false),
      wWall: Array(72).fill(false),
      gaps: Array(64).fill(false),
      tarn: 0,
      status: Status.Stone,
      hadWalls: [10, 10],
      winner: null,
      roomId: "",
      isIniting: true,
      isLoading: false,
      player: 0
    };

    this.moveCharacter = this.moveCharacter.bind(this);
    this.putHWall = this.putHWall.bind(this);
    this.putWWall = this.putWWall.bind(this);
    this.initFunc = this.initFunc.bind(this);
    this.setRoomId = this.setRoomId.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.endLoading = this.endLoading.bind(this);
    this.checkLoading = this.checkLoading.bind(this);
    this.onClick = this.onClick.bind(this);
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
      .add({ isPlaying: false })
      .then(ref => {
        this.setRoomId(ref.id, true, 0);
        this.waitPlayer();
      })
      .catch(error => {
        console.log(error);
        alert("errorが発生しました．リロードして下さい");
      });
    console.log("heeelo");
  }

  setRoomId(roomId: string, isIniting: boolean, player: Tarn) {
    this.setState({ roomId, isIniting, player });
    this.catchRecord(roomId);
  }

  postRecord(type: Status, record: number) {
    const { recordId, roomId, player } = this.state;
    firestore
      .collection("records")
      .doc()
      .set({ roomId, recordId, type, record, player })
      .then(() => {
        console.log(roomId, recordId, record, type, player);
      })
      .catch(error => {
        console.error(error);
      });
  }

  waitPlayer() {
    firestore
      .collection("rooms")
      .doc(this.state.roomId)
      .onSnapshot(doc => {
        if (doc.data()!.isPlaying) {
          this.setState({ isIniting: false, isLoading: false });
        }
      });
  }

  catchRecord(roomId: string) {
    firestore
      .collection("records")
      .where("roomId", "==", roomId)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc);
          if (this.state.recordId === doc.data().recordId) {
            switch (doc.data()!.type) {
              case Status.Stone:
                this.moveCharacter(doc.data()!.record);
                break;
              case Status.Horizon:
                this.putWWall(doc.data()!.record);
                break;
              case Status.Vertical:
                this.putHWall(doc.data()!.record);
                break;
              default:
                alert("error");
            }
          }
        });
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
      const recordId = this.state.recordId + 1;
      stone[tarn] = index;
      this.setState({ stone, recordId });
      this.chagneTarn();
    }
  }

  putHWall(index: any) {
    if (this.state.hadWalls[this.state.tarn] === 0) {
      return;
    }

    // 一番下はおけない
    if (64 <= index && index < 72) {
      return;
    }

    const gaps = this.state.gaps;
    if (gaps[index]) {
      return;
    }
    gaps[index] = true;

    const hWall = this.state.hWall;
    if (hWall[index] || hWall[index + 8]) {
      return;
    }

    hWall[index] = true;
    hWall[index + 8] = true;

    const hadWalls = this.state.hadWalls;
    const recordId = this.state.recordId + 1;
    hadWalls[this.state.tarn] -= 1;
    this.setState({ hWall, hadWalls, recordId, gaps, status: Status.Stone });
    this.chagneTarn();
  }

  putWWall(index: any) {
    if (this.state.hadWalls[this.state.tarn] === 0) {
      return;
    }

    if (index % 9 === 8) {
      return;
    }

    const gaps = this.state.gaps;
    const convertedIndex = Math.floor(index / 9) * 8 + (index % 9);
    if (gaps[convertedIndex]) {
      return;
    }
    gaps[convertedIndex] = true;

    const wWall = this.state.wWall;
    if (wWall[index] || wWall[index + 1]) {
      return;
    }

    wWall[index] = true;
    wWall[index + 1] = true;

    const hadWalls = this.state.hadWalls;
    const recordId = this.state.recordId + 1;
    hadWalls[this.state.tarn] -= 1;

    this.setState({ wWall, hadWalls, recordId, gaps, status: Status.Stone });
    this.chagneTarn();
  }

  endGame(winner: Tarn) {
    this.setState({ winner });

    firestore
      .collection("rooms")
      .doc(this.state.roomId)
      .delete()
      .then(() => {
        console.log("delete");
      })
      .catch(error => {
        console.log(error);
      });
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

  onClick(index: any, type: Status) {
    if (this.state.tarn !== this.state.player || this.state.status !== type) {
      return;
    }
    switch (type) {
      case Status.Stone:
        this.moveCharacter(index);
        this.postRecord(Status.Stone, index);
        break;
      case Status.Vertical:
        this.putHWall(index);
        this.postRecord(Status.Vertical, index);
        break;
      case Status.Horizon:
        this.putWWall(index);
        this.postRecord(Status.Horizon, index);
        break;
      default:
        break;
    }
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
    const { tarn, stone, hWall, wWall, status, hadWalls, winner, isIniting, player, gaps } = this.state;
    return (
      <div className="app">
        <div className="app__player">
          {tarn === 0 ? <p style={{ color: "red" }}>{player === 0 ? "あなた" : "相手"} のターンです！</p> : null}
          <h3>{player === 0 ? "あなた" : "相手"} (黄)</h3>
          <p>残り壁枚数：{hadWalls[0]}枚</p>
        </div>
        <div className="app__board">
          <Board stone={stone} hWall={hWall} wWall={wWall} gaps={gaps} onClick={this.onClick} status={status} />
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
          {tarn === 1 ? <p style={{ color: "red" }}>{player === 1 ? "あなた" : "相手"} のターンです！</p> : null}
          <h3>{player === 1 ? "あなた" : "相手"} (グレー)</h3>
          <p>残り壁枚数：{hadWalls[0]}枚</p>
        </div>
        <ReactModal isOpen={winner !== null} style={customStyles}>
          {winner === player ? "あなたの勝ち" : "あなたの負け"}
        </ReactModal>
        <InitialModal
          isOpen={isIniting}
          initFunc={this.initFunc}
          setRoomId={this.setRoomId}
          startLoading={this.startLoading}
          endLoading={this.endLoading}
          checkLoading={this.checkLoading}
          roomId={this.state.roomId}
        />
        <Loading isLoading={this.state.isLoading} />
      </div>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
