import React, { Component } from "react";
import ReactDOM from "react-dom";
import GitHubForkRibbon from "react-github-fork-ribbon";
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
        <GitHubForkRibbon
          href="//github.com/alexanderson1993/robozzle-react"
          target="_blank"
          position="left-bottom"
          color="black"
        >
          Fork me on GitHub
        </GitHubForkRibbon>
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
