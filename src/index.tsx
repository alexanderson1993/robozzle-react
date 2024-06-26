import React, { Component } from "react";
import ReactDOM from "react-dom";
import GitHubForkRibbon from "react-github-fork-ribbon";

import "./styles.css";
import Boards from "./data";
import Game from "./game";


interface AppState {
  selectedBoard: number,
  dragging: boolean,
  completedLevels: Set<number>,
}


class App extends Component<{}, AppState> {
  state: AppState;

  constructor(props) {
    super(props);
    // Initial state
    const completedLevels = new Set<number>(JSON.parse(localStorage.getItem('completedLevels') || '[]'));
    this.state = {
      selectedBoard: this.getSelectedBoardFromUrl() || 285,
      dragging: null,
      completedLevels: completedLevels,
    };
  }

  getSelectedBoardFromUrl(): number {
    const searchParams = new URLSearchParams(window.location.search);
    const level = parseInt(searchParams.get('level'), 10);
    if (isNaN(level)) {
      return -1;
    }
    if (!Boards.find(b => b.Id === level)) {
      return -1;
    }
    return level;
  }

  handleLevelComplete = (levelId: number): void => {
    this.setState((prevState) => {
      const updatedCompletedLevels = new Set(prevState.completedLevels).add(levelId);
      localStorage.setItem('completedLevels', JSON.stringify(Array.from(updatedCompletedLevels)));
      return {
        completedLevels: updatedCompletedLevels
      };
    });
  };

  printProgress = (): void => {
    setTimeout(() => {
      const sortedLevels = Array.from(this.state.completedLevels).sort((a, b) => a - b);
      window.alert(`You've completed ${sortedLevels.length} levels: \n${sortedLevels}`)
    });
  }

  render() {
    const { dragging, selectedBoard, completedLevels } = this.state;
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
          <h1 onClick={this.printProgress} >Robozzle-React</h1>
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
              {completedLevels.has(d.Id) ? `✅ ${d.Title}` : `⬜ ${d.Title}`}
            </p>
          ))}
        </div>
        {selectedBoard && (
          <Game
            key={selectedBoard}
            setDragging={which => this.setState({ dragging: which })}
            board={Boards.find(b => b.Id === selectedBoard)}
            onLevelComplete={() => this.handleLevelComplete(selectedBoard)}
          />
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
