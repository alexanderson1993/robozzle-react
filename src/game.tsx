import React, { Component, Fragment } from "react";
import GameBoard from "./gameboard";
import Controls from "./controls";
import Commands from "./commands";
import { CurrentInstruction, DragInfo, DragPosition, FunctionCommands, Level, StackElement } from "./baseTypes";

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
  functions: FunctionCommands,
  currentInstruction: CurrentInstruction | null,
}

interface GameProps {
  board: Level,
  setDragging: (isDragging: boolean) => void;
  onLevelComplete: () => void;
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
      currentInstruction: null,
    };
  }

  calculateStepDelay = (stepSpeed: number) => {
    return 1000 - (((stepSpeed) * 100) - 20);
  }

  reset = () => {
    clearTimeout(this.timeout);
    this.setState(state => ({
      ...this.props.board,
      clean: true,
      functions: state.functions,
      stack: [],
      currentInstruction: null,
    }));
  };

  commandMouseDown = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = evt.target as HTMLElement;
    const funcnum: string = target.dataset.funcnum;
    const index: number = parseInt(target.dataset.position, 10);

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
              if (i === index) return null;
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

  mouseMove = (evt: MouseEvent) => {
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

  mouseUp = (evt: MouseEvent) => {
    document.removeEventListener("mousemove", this.mouseMove);
    this.props.setDragging(false);
    document.removeEventListener("mouseup", this.mouseUp);

    const target = evt.target as HTMLElement;
    const funcKey: string = target.dataset.funcnum;
    const position = parseInt(target.dataset.position, 10);

    if (!funcKey) return this.setState({ dragging: null });
    let newAction = { function: funcKey, index: position }
    this.setState(state => {
      if (state.dragging.command) newAction["command"] = state.dragging.command;
      if (state.dragging.color) newAction["color"] = state.dragging.color;
      if (state.dragging.color === "clear") newAction["color"] = null;
      const func = state.functions[funcKey] || [];
      func[position] = { ...func[position], ...newAction };
      return {
        dragging: null,
        functions: { ...state.functions, [funcKey]: func }
      };
    });
  };

  start = () => {
    this.reset();
    clearTimeout(this.timeout);
    // Start with F0 (aka "Main")
    const { functions } = this.state;
    const starting = functions.f0;
    const stack: StackElement[] = [].concat(starting);
    this.setState({ stack, clean: false, currentInstruction: { function: "f0", index: 0 } });
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
        return { stack, currentInstruction: null };
      }
      const { command, color, index } = action;
      let boardColor = "#";
      if (RobotRow in Colors && 0 <= RobotCol && RobotCol < Colors[RobotRow].length) {
        boardColor = Colors[RobotRow][RobotCol];
      }

      if (
        !color ||
        (color === "red" && boardColor === "R") ||
        (color === "green" && boardColor === "G") ||
        (color === "blue" && boardColor === "B")
      ) {
        this.performAction(command);
        this.timeout = setTimeout(this.runStack, this.state.stepDelay);
        return { stack, currentInstruction: { function: action.function, index: index } };
      } else {
        this.runNow();
        return { stack, currentInstruction: null };
      }

    });
  };

  runNow = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.runStack, 0);
  };

  performAction = (action: string) => {
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
                RobotCol: RobotCol + 1,
              };
            case 1:
              return {
                ...state,
                RobotRow: RobotRow + 1,
              };
            case 2:
              return {
                ...state,
                RobotCol: RobotCol - 1,
              };
            case 3:
              return {
                ...state,
                RobotRow: RobotRow - 1,
              };
            default:
              return state;
          }
        case "f0":
        case "f1":
        case "f2":
        case "f3":
        case "f4":
        case "f5":
          this.runNow();
          return {
            ...state,
            stack: functions[action].concat(stack),
            currentInstruction: null,
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
    if (!(RobotRow in Items) || RobotCol < 0 || Items[RobotRow].length <= RobotCol) {
      // Robot fell off board
      return setTimeout(this.reset, this.state.stepDelay);
    }

    if (Items[RobotRow][RobotCol] === "#") {
      // Robot went off path
      return setTimeout(this.reset, this.state.stepDelay);
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
        this.props.onLevelComplete();
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
