import React from "react";

const functionClasses = (func, pos, functions) => {
  const funcObj = functions[func];
  if (!funcObj) return "";
  const obj = funcObj[pos];
  if (!obj) return "";
  const { command, color } = obj;
  const paint = command && command.indexOf("paint") > -1;
  return `command ${paint ? "paint" : ""} ${command} ${
    color ? `${color} color` : ""
  }`;
};
const Commands = ({
  SubLengths,
  dragging,
  functions,
  onMouseDown
}) => {
  return (
    <div
      className={`game-controls ${
        dragging ? "dragging" : ""
      }`}
    >
      {SubLengths.map(
        (s, i) =>
          parseInt(s, 10) > 0 && (
            <div className="function-holder">
              <img
                src={`/img/f${i + 1}.svg`}
                alt={`F${i + 1}`}
              />
              <div className="function-area">
                {Array(parseInt(s, 10))
                  .fill(0)
                  .map((f, fi) => (
                    <div
                      className={`function-block ${functionClasses(
                        `f${i + 1}`,
                        fi,
                        functions
                      )}`}
                      data-funcnum={`f${i + 1}`}
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

export default Commands;
