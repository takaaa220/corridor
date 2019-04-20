import * as React from "react";

enum BoardType {
  None,
  P1,
  P2
}

interface BoardProps {
  boards: BoardType[];
}

const stone = ["", "p1", "p2"];

const Board: React.SFC<BoardProps> = props => {
  return (
    <ul className="board">
      {props.boards.map((board, index) => {
        return (
          <li key={index} className="board__item">
            {board !== 0 ? <div className={`stone stone_${stone[board]}`} /> : null}
          </li>
        );
      })}
    </ul>
  );
};

export default Board;
