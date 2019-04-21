import * as React from "react";

enum Status {
  Stone,
  Vertical,
  Horizon
}

interface BoardProps {
  stone: number[];
  moveCharacter: Function;
  hWall: boolean[];
  wWall: boolean[];
  putHWall: Function;
  putWWall: Function;
  status: Status;
}

const Board: React.SFC<BoardProps> = props => {
  const { stone, moveCharacter, putHWall, putWWall, hWall, wWall, status } = props;
  const cHWall = hWall.slice();

  const boards = [];
  for (let ii = 0; ii < 9; ii += 1) {
    for (let jj = 0; jj < 9; jj += 1) {
      const index = ii * 9 + jj;
      boards.push(
        // tslint:disable-next-line:jsx-no-lambda
        <div key={index} className="board__item" onClick={() => moveCharacter(index)}>
          {index === stone[0] ? <div className="stone stone_p1" /> : null}
          {index === stone[1] ? <div className="stone stone_p2" /> : null}
        </div>
      );
      if (jj !== 8) {
        const indexI = 72 - cHWall.length;
        const first = cHWall[0];
        cHWall.shift();
        // tslint:disable-next-line:jsx-no-lambda
        boards.push(<div className={first ? "exist" : ""} onClick={() => putHWall(indexI)} />);
      }
    }
    if (ii !== 8) {
      for (let jj = 0; jj < 9; jj += 1) {
        // tslint:disable-next-line:jsx-no-lambda
        boards.push(<div className={wWall[ii * 9 + jj] ? " exist" : ""} onClick={() => putWWall(ii * 9 + jj)} />);
        if (jj !== 8) {
          boards.push(<div />);
        }
      }
    }
  }

  const statusPointer = ["stone", "vertical", "horizon"];

  return <div className={`board board_${statusPointer[status]}`}>{boards}</div>;
};

export default Board;
