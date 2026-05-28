
import type { CurrentInstruction, DragInfo, FunctionCommands } from "./baseTypes";

import F0 from './img/f0.svg'
import F1 from './img/f1.svg'
import F2 from './img/f2.svg'
import F3 from './img/f3.svg'
import F4 from './img/f4.svg'
import F5 from './img/f5.svg'

const fnimg = [F0, F1, F2, F3, F4, F5]

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
                src={fnimg[i]}
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
