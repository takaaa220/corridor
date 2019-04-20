import * as React from "react";

interface BoardProps {
  stone: number[];
  moveCharacter: Function;
  hWall: boolean[];
  wWall: boolean[];
}

const Board: React.SFC<BoardProps> = props => {
  const { stone, moveCharacter, hWall, wWall } = props;

  const boards = [];
  for (let index = 0; index < 81; index += 1) {
    boards.push(
      // tslint:disable-next-line:jsx-no-lambda
      <div key={index} className="board__item" onClick={() => moveCharacter(index)}>
        {index}
        {index === stone[0] ? <div className="stone stone_p1" /> : null}
        {index === stone[1] ? <div className="stone stone_p2" /> : null}
      </div>
    );
  }

  const wWalls = [];
  for (let index = 0; index < wWall.length; index += 1) {
    wWalls.push(<div key={index} className={`board__w-wall ${wWall[index] ? " board__w-wall_exist" : ""}`} />);
  }

  const hWalls = [];
  for (let index = 0; index < hWall.length; index += 1) {
    hWalls.push(<div key={index} className={`board__h-wall ${hWall[index] ? " board__h-wall_exist" : ""}`} />);
  }

  return <div className="board">{boards}</div>;
};

export default Board;
