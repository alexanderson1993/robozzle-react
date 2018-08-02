import React, { Component } from "react";
import ReactDOM from "react-dom";
import boards from "./data.json";
import "./styles.css";
import Game from "./game";

class App extends Component {
  state = {
    selectedBoard: "285",
    dragging: null
  };
  render() {
    const { dragging, selectedBoard } = this.state;
    return (
      <div className={`App ${dragging ? "dragging" : ""}`}>
        <div className="boards">
          {boards.map(d => (
            <p
              key={`board-${d.Id}`}
              className={`${selectedBoard === d.Id ? "selected" : ""}`}
              onClick={() => this.setState({ selectedBoard: d.Id })}
            >
              {d.Title}
            </p>
          ))}
        </div>
        {selectedBoard && (
          <Game
            key={selectedBoard}
            setDragging={which => this.setState({ dragging: which })}
            board={boards.find(b => b.Id === selectedBoard)}
          />
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
