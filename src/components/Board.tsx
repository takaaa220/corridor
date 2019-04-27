import * as React from "react";

enum Status {
  Stone,
  Vertical,
  Horizon
}

interface BoardProps {
  stone: number[];
  onClick: Function;
  hWall: boolean[];
  wWall: boolean[];
  gaps: boolean[];
  status: Status;
}

const Board: React.SFC<BoardProps> = props => {
  const { stone, onClick, hWall, wWall, status, gaps } = props;
  const cHWall = hWall.slice();

  const boards = [];
  let gapIndex = 0;
  for (let ii = 0; ii < 9; ii += 1) {
    for (let jj = 0; jj < 9; jj += 1) {
      const index = ii * 9 + jj;
      boards.push(
        // tslint:disable-next-line:jsx-no-lambda
        <div key={index} className="board__item" onClick={() => onClick(index, Status.Stone)}>
          {index === stone[0] ? <div className="stone stone_p1" /> : null}
          {index === stone[1] ? <div className="stone stone_p2" /> : null}
        </div>
      );
      if (jj !== 8) {
        const indexI = 72 - cHWall.length;
        const first = cHWall[0];
        cHWall.shift();
        // tslint:disable-next-line:jsx-no-lambda
        boards.push(<div className={first ? "exist" : ""} onClick={() => onClick(indexI, Status.Vertical)} />);
      }
    }
    if (ii !== 8) {
      for (let jj = 0; jj < 9; jj += 1) {
        const ind = ii * 9 + jj;
        // tslint:disable-next-line:jsx-no-lambda
        boards.push(<div className={wWall[ind] ? " exist" : ""} onClick={() => onClick(ind, Status.Horizon)} />);
        if (jj !== 8) {
          boards.push(<div className={gaps[gapIndex] ? "exist" : ""} />);
          gapIndex += 1;
        }
      }
    }
  }

  const statusPointer = ["stone", "vertical", "horizon"];

  return <div className={`board board_${statusPointer[status]}`}>{boards}</div>;
};

export default Board;
