import React, { Component } from "react";
import ReactDOM from "react-dom";
import GitHubForkRibbon from "react-github-fork-ribbon";

import "./styles.css";
import Boards from "./data";
import Game from "./game";


interface AppState {
  selectedBoard: number,
  dragging: boolean,
}


class App extends Component {
  state: AppState;

  constructor(props) {
    super(props);
    // Initial state
    this.state = {
      selectedBoard: this.getSelectedBoardFromUrl() || 285,
      dragging: null
    };
  }

  getSelectedBoardFromUrl(): number | null {
    const searchParams = new URLSearchParams(window.location.search);
    const level = parseInt(searchParams.get('level'), 10);
    return isNaN(level) ? null : level;  // Ensure that the level is a number
  }

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
          {Boards.map(d => (
            <p
              key={`board-${d.Id}`}
              className={`${selectedBoard === d.Id ? "selected" : ""}`}
              onClick={() => {
                this.setState({ selectedBoard: d.Id })
                const url = new URL(window.location.href);
                url.searchParams.set("level", `${d.Id}`);
                window.history.pushState({ path: url.toString() }, '', url.toString());
              }}
            >
              {d.Title}
            </p>
          ))}
        </div>
        {selectedBoard && (
          <Game
            key={selectedBoard}
            setDragging={which => this.setState({ dragging: which })}
            board={Boards.find(b => b.Id === selectedBoard)}
          />
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
