import React from "react";
import { CurrentInstruction, DragInfo, FunctionCommands } from "./baseTypes";


const functionClasses = (func: string, pos: number, functions: FunctionCommands, currentInstruction: CurrentInstruction) => {
  const funcObj = functions[func];
  if (!funcObj) return "";
  const obj = funcObj[pos];
  if (!obj) return "";
  const { command, color } = obj;
  const paint = command && command.indexOf("paint") > -1;
  if (currentInstruction && func == currentInstruction.function && pos == currentInstruction.index) {
    return `command ${paint ? "paint" : ""} ${command} ${color ? `${color} color` : ""} highlight`;
  } else {
    return `command ${paint ? "paint" : ""} ${command} ${color ? `${color} color` : ""}`;
  }
};


interface CommandsProps {
  SubLengths: number[],
  dragging: DragInfo,
  functions: any,
  onMouseDown,
  currentInstruction: CurrentInstruction,
}


const Controls = ({ SubLengths, dragging, functions, onMouseDown, currentInstruction }: CommandsProps) => {
  return (
    <div className={`game-controls ${dragging ? "dragging" : ""}`}>
      {SubLengths.map(
        (s, i) =>
          s > 0 && (
            <div key={`f${i}`} className="function-holder">
              <img
                draggable="false"
                src={require(`./img/f${i}.svg`)}
                alt={`F${i}`}
              />
              <div className="function-area">
                {Array(s)
                  .fill(0)
                  .map((f, fi) => (
                    <div
                      key={`f${i}-${fi}`}
                      className={`function-block ${functionClasses(`f${i}`, fi, functions, currentInstruction)} `}
                      data-funcnum={`f${i}`}
                      data-position={fi}
                      onMouseDown={onMouseDown}
                    />
                  ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default Controls;
