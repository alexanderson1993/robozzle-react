import React, { Component, Fragment } from "react";
import GameBoard from "./gameboard";
import Controls from "./controls";
import Commands from "./commands";
import { DragInfo, DragPosition, Level, StackElement } from "./baseTypes";

function replaceAt(string: string, index: number, replace: string): string {
  return string.substring(0, index) + replace + string.substring(index + 1);
}


// Step speed is a scale from 1-10, where 10 is the fastest (almost instant)
const INTIAL_STEP_SPEED = 8;


interface GameState extends Level {
  stack: StackElement[],
  stepDelay: number,
  clean: boolean,

  dragging: DragInfo | null,
  functions: any,
}

interface GameProps {
  board: Level,
  setDragging: (isDragging: boolean) => void;
}


class Game extends Component<GameProps, GameState> {

  timeout: NodeJS.Timeout;

  constructor(props: GameProps) {
    super(props);
    this.state = {
      ...this.props.board,
      functions: {},
      stack: [],
      stepDelay: this.calculateStepDelay(INTIAL_STEP_SPEED),
      clean: true,
      dragging: null,
    };
  }

  calculateStepDelay = (stepSpeed: number) => {
    return 1000 - (((stepSpeed) * 100) - 20);
  }

  reset = () => {
    clearTimeout(this.timeout);
    this.setState(state => ({
      clean: true,
      functions: state.functions,
      stack: [],
      ...this.props.board
    }));
  };

  commandMouseDown = evt => {
    const funcnum = evt.target.dataset.funcnum;
    const index = evt.target.dataset.position;
    const position = {
      x: evt.clientX - 15,
      y: evt.clientY - 15
    };
    this.setState(state => {
      // Check to see if there is a function there.
      if (state.functions[funcnum] && state.functions[funcnum][index]) {
        const { command, color } = state.functions[funcnum][index];
        this.props.setDragging(true);
        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mouseup", this.mouseUp);
        return {
          ...state,
          dragging: {
            position,
            command,
            color
          },
          functions: {
            ...state.functions,
            [funcnum]: state.functions[funcnum].map((f, i) => {
              if (i === parseInt(index, 10)) return null;
              return f;
            })
          }
        };
      }
      return state;
    });
  };

  mouseDown = (position: DragPosition, command: string, color: string) => {
    this.props.setDragging(true);
    this.setState({
      dragging: {
        position: {
          x: position.x - 15,
          y: position.y - 15
        },
        command,
        color
      }
    });
    document.addEventListener("mousemove", this.mouseMove);
    document.addEventListener("mouseup", this.mouseUp);
  };

  mouseMove = evt => {
    this.setState(state => ({
      dragging: {
        ...state.dragging,
        position: {
          x: state.dragging.position.x + evt.movementX,
          y: state.dragging.position.y + evt.movementY
        }
      }
    }));
  };

  mouseUp = evt => {
    document.removeEventListener("mousemove", this.mouseMove);
    this.props.setDragging(false);
    document.removeEventListener("mouseup", this.mouseUp);
    const funcNum = evt.target.dataset.funcnum;
    const position = parseInt(evt.target.dataset.position, 10);
    if (!funcNum) return this.setState({ dragging: null });
    let newAction = {}
    this.setState(state => {
      if (state.dragging.command) newAction["command"] = state.dragging.command;
      if (state.dragging.color) newAction["color"] = state.dragging.color;
      if (state.dragging.color === "clear") newAction["color"] = null;
      const func = state.functions[funcNum] || [];
      console.log(position)
      func[position] = { ...func[position], ...newAction };
      return {
        dragging: null,
        functions: { ...state.functions, [funcNum]: func }
      };
    });
  };

  start = () => {
    this.reset();
    clearTimeout(this.timeout);
    // Start with F1
    const { functions } = this.state;
    const starting = functions.f1;
    const stack = [].concat(starting);
    this.setState({ stack, clean: false });
    setTimeout(this.runStack, this.state.stepDelay);
  };

  runStack = () => {
    this.setState(state => {
      const { stack, Colors, RobotRow, RobotCol } = state;
      if (stack.length === 0) {
        clearTimeout(this.timeout);
        return;
      }

      const action = stack.shift();
      if (!action) {
        this.runNow();
        return { stack };
      }
      const { command, color } = action;
      const boardColor = Colors[RobotRow][RobotCol];

      if (
        !color ||
        (color === "red" && boardColor === "R") ||
        (color === "green" && boardColor === "G") ||
        (color === "blue" && boardColor === "B")
      ) {
        this.performAction(command);
        this.timeout = setTimeout(this.runStack, this.state.stepDelay);
      } else {
        this.runNow();
      }
      return { stack };
    });
  };

  runNow = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.runStack, 0);
  };

  performAction = action => {
    this.setState(state => {
      const { Colors, RobotRow, RobotCol, RobotDir, functions, stack } = state;
      switch (action) {
        case "left":
          return {
            ...state,
            RobotDir: RobotDir - 1
          };
        case "right":
          return {
            ...state,
            RobotDir: RobotDir + 1
          };
        case "forward":
          switch (Math.abs(RobotDir + 400) % 4) {
            case 0:
              return {
                ...state,
                RobotCol: Math.max(0, RobotCol + 1)
              };
            case 1:
              return {
                ...state,
                RobotRow: Math.max(0, RobotRow + 1)
              };
            case 2:
              return {
                ...state,
                RobotCol: Math.max(0, RobotCol - 1)
              };
            case 3:
              return {
                ...state,
                RobotRow: Math.max(0, RobotRow - 1)
              };
            default:
              return state;
          }
        case "f1":
        case "f2":
        case "f3":
        case "f4":
        case "f5":
        case "f6":
          this.runNow();
          return {
            ...state,
            stack: functions[action].concat(stack)
          };
        case "paint-red":
        case "paint-green":
        case "paint-blue":
          let color = action.split("-")[1];
          if (color === "red") color = "R";
          if (color === "green") color = "G";
          if (color === "blue") color = "B";
          return {
            ...state,
            Colors: Colors.map((row, i) => {
              if (i === RobotRow) {
                return replaceAt(row, RobotCol, color);
              }
              return row;
            })
          };
        default:
          return state;
      }
    }, this.checkGame);
  };

  checkGame = () => {
    const { Items, RobotCol, RobotRow } = this.state;
    if (Items[RobotRow][RobotCol] === "#") {
      return setTimeout(this.reset, this.state.stepDelay * 4);
    }
    if (Items[RobotRow][RobotCol] === "*") {
      return this.setState(
        state => ({
          Items: state.Items.map((row, i) => {
            if (i === RobotRow) {
              return replaceAt(row, RobotCol, "%");
            }
            return row;
          })
        }),
        this.checkGame
      );
    }
    // Clear a star if we are on it.
    const stars = Items.reduce(
      (prev, next) => prev + (next.match(/\*/g) || []).length,
      0
    );
    if (stars === 0) {
      clearTimeout(this.timeout);
      setTimeout(() => {
        window.alert(`You beat ${this.state.Title}!`);
      }, this.state.stepDelay);
    }
  };

  render() {
    const { dragging, functions, stepDelay } = this.state;
    return (
      <Fragment>
        <style>
          {`.gameboard {
--delay:${stepDelay}ms
}`}
        </style>
        <div className="gameboard-holder">
          <Fragment>
            <GameBoard {...this.state} />
            <div className="player-controls">
              <Controls
                {...this.state}
                dragging={dragging}
                functions={functions}
                onMouseDown={this.commandMouseDown}
              />
              <Commands
                {...this.state}
                onMouseDown={this.mouseDown}
                dragging={dragging}
              />
              <div style={{ display: "flex" }}>
                <button onClick={this.start} style={{ flex: 1 }}>
                  Go
                </button>
                <button onClick={this.reset} style={{ flex: 1 }}>
                  Reset
                </button>
              </div>
              <div className="slider-container">
                <label htmlFor="speed">Slow</label>
                <input
                  className="speed-slider"
                  id="seed"
                  type="range"
                  min="1"
                  max="10"
                  defaultValue={INTIAL_STEP_SPEED}
                  onChange={evt => {
                    this.setState({
                      stepDelay: this.calculateStepDelay(parseInt(evt.target.value, 10)),
                    });
                  }}
                />
                <label htmlFor="speed">Fast</label>
              </div>
            </div>
          </Fragment>
        </div>
        {dragging && (
          <div
            className="dragger"
            style={{
              transform: `translate(${dragging.position.x}px, ${dragging.position.y
                }px)`
            }}
          >
            <div
              className={`command ${dragging.command && dragging.command.indexOf("paint") > -1
                ? "paint"
                : ""
                } ${dragging.command} ${dragging.color ? `${dragging.color} color` : ""
                }`}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

export default Game;
