import React from "react";
import shipImage from './img/ship.svg';

const cellColor = (row: number, col: number, Colors: string[]): string | null => {
  const color = Colors[row][col];
  if (color === "R") return "red";
  if (color === "B") return "blue";
  if (color === "G") return "green";
  return null;
};

const cellPiece = (row: number, col: number, Items: string[]): string | null => {
  const piece = Items[row][col];
  if (piece === "#") return "transparent";
  if (piece === "*") return "star";
  if (piece === "%") return "star gone";
  if (piece === ".") return "";
  return null
};


interface GameBoardProps {
  Colors: string[],
  Items: string[],
  RobotCol: number,
  RobotRow: number;
  RobotDir: number,
}

const GameBoard = ({ Colors, Items, RobotCol, RobotRow, RobotDir }: GameBoardProps) => (
  <div className="gameboard">
    <div className="spacer" />
    <div className="game-grid">
      {Array(12)
        .fill(0)
        .map((_, r) => (
          <div key={`row-${r}`} className="game-row">
            {Array(16)
              .fill(0)
              .map((__, c) => (
                <div
                  key={`cell-${r}-${c}`}
                  className={`game-cell ${cellColor(r, c, Colors)} ${cellPiece(
                    r,
                    c,
                    Items
                  )}`}
                />
              ))}
          </div>
        ))}
    </div>
    <div
      className="game-ship-holder"
      style={{
        transform: `translate(${(100 / 16) * RobotCol}%, ${(100 / 12) * RobotRow}%)`
      }}
    >
      <img
        className="game-ship"
        alt="ship"
        src={shipImage}
        draggable="false"
        style={{
          transform: `rotate(${RobotDir * 90 + 90}deg)`
        }}
      />
    </div>
  </div>
);

export default GameBoard;
