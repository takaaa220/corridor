import * as React from "react";

interface BoardProps {
  p1: number;
  p2: number;
}

const Board: React.SFC<BoardProps> = props => {
  const { p1, p2 } = props;

  const boards = [];
  for (let index = 0; index < 81; index += 1) {
    boards.push(
      <li key={index} className="board__item">
        {index === p1 ? <div className="stone stone_p1" /> : null}
        {index === p2 ? <div className="stone stone_p2" /> : null}
      </li>
    );
  }

  return <ul className="board">{boards}</ul>;
};

export default Board;
