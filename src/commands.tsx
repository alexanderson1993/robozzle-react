import { Fragment } from "react";
import type { DragInfo } from "./baseTypes";

type MouseDown = (pos: { x: number, y: number }, command: string | null, command2?: string) => void
const Red = ({ onMouseDown }: { onMouseDown: MouseDown }) => {
  return (
    <div
      className="command paint paint-red"
      onPointerDown={evt =>
        onMouseDown({ x: evt.clientX, y: evt.clientY }, "paint-red")
      }
    />
  );
};
const Green = ({ onMouseDown }: { onMouseDown: MouseDown }) => {
  return (
    <div
      className="command paint paint-green"
      onPointerDown={evt =>
        onMouseDown({ x: evt.clientX, y: evt.clientY }, "paint-green")
      }
    />
  );
};
const Blue = ({ onMouseDown }: { onMouseDown: MouseDown }) => {
  return (
    <div
      className="command paint paint-blue"
      onPointerDown={evt =>
        onMouseDown({ x: evt.clientX, y: evt.clientY }, "paint-blue")
      }
    />
  );
};


interface ColorCommandsProps {
  colors: number,
  onMouseDown: MouseDown,
}


const ColorCommands = ({ colors, onMouseDown }: ColorCommandsProps) => {
  if (colors === 1) {
    return (
      <Fragment>
        <Red onMouseDown={onMouseDown} />
        <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 2) {
    return (
      <Fragment>
        <Green onMouseDown={onMouseDown} />
        <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 3) {
    return (
      <Fragment>
        <Red onMouseDown={onMouseDown} />
        <Green onMouseDown={onMouseDown} />
        <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 4) {
    return (
      <Fragment>
        <Blue onMouseDown={onMouseDown} /> <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 5) {
    return (
      <Fragment>
        <Red onMouseDown={onMouseDown} />
        <Blue onMouseDown={onMouseDown} /> <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 6) {
    return (
      <Fragment>
        <Green onMouseDown={onMouseDown} />
        <Blue onMouseDown={onMouseDown} /> <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 7) {
    return (
      <Fragment>
        <Red onMouseDown={onMouseDown} />
        <Green onMouseDown={onMouseDown} />
        <Blue onMouseDown={onMouseDown} /> <div className="divider" />
      </Fragment>
    );
  }
  return null;
};


interface CommandsProps {
  SubLengths: number[],
  AllowedCommands: number,
  dragging: DragInfo | null,
  onMouseDown: MouseDown,
}


const Commands = ({ SubLengths, AllowedCommands, dragging, onMouseDown }: CommandsProps) => {
  return (
    <div className={`commands-area ${dragging ? "dragging" : ""}`}>
      <div
        className="command forward"
        onPointerDown={evt =>
          onMouseDown({ x: evt.clientX, y: evt.clientY }, "forward", "")
        }
      />
      <div
        className="command left"
        onPointerDown={evt =>
          onMouseDown({ x: evt.clientX, y: evt.clientY }, "left", "")
        }
      />
      <div
        className="command right"
        onPointerDown={evt =>
          onMouseDown({ x: evt.clientX, y: evt.clientY }, "right", "")
        }
      />
      <div className="divider" />
      {SubLengths.map(
        (s, i) =>
          s > 0 && (
            <div
              key={`sublength-${i}`}
              className={`command f${i}`}
              onPointerDown={evt =>
                onMouseDown({ x: evt.clientX, y: evt.clientY }, `f${i}`)
              }
            />
          )
      )}
      <div className="divider" />
      <ColorCommands
        colors={AllowedCommands}
        onMouseDown={onMouseDown}
      />
      <div
        className="command color clear"
        onPointerDown={evt =>
          onMouseDown({ x: evt.clientX, y: evt.clientY }, null, "clear")
        }
      />
      <div
        className="command color red"
        onPointerDown={evt =>
          onMouseDown({ x: evt.clientX, y: evt.clientY }, null, "red")
        }
      />
      <div
        className="command color green"
        onPointerDown={evt =>
          onMouseDown({ x: evt.clientX, y: evt.clientY }, null, "green")
        }
      />
      <div
        className="command color blue"
        onPointerDown={evt =>
          onMouseDown({ x: evt.clientX, y: evt.clientY }, null, "blue")
        }
      />
    </div>
  );
};

export default Commands;
