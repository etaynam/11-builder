import React from "react"
import SearchResult from "./SearchResult.jsx"

export default class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: "",
      isLoading: false,
      noMatches: false
    }
  }

  getPlayersData = searchValue => {
    // Find matching players from JSON players index
    const playerFilesPaths = []
    for (const player in this.props.playersIndex) {
      const playerName = player.toLocaleLowerCase()
      // Store the 5 best matches
      if (playerName.includes(searchValue) && playerFilesPaths.length < 5) {
        playerFilesPaths.push(this.props.playersIndex[player])
        this.setState({ isLoading: false })
      }
    }
    // Display loading message if no results are found
    if (playerFilesPaths.length === 0 && !this.state.isLoading) {
      this.setState({
        noMatches: true,
        isLoading: false
      })
    }
    // Get relevant data from JSON files
    let searchResults = []
    for (const playerFilePath of playerFilesPaths) {
      let playerFile = this.props.getPlayerFile(playerFilePath)
      playerFile.shortName = playerFile.name.split(' ').slice(-1).join(' ')
      searchResults.push(playerFile)
    }
    // Sort results by players ranking
    searchResults.sort((a, b) => { return b.rating - a.rating })
    //this.setState({ results: searchResults })
    this.props.setResults(searchResults)
  }

  updateSearch = e => {
    // Display loading message
    this.setState({
      value: e.target.value,
      noMatches: false,
      isLoading: true
    })
    // Prevent adding more than 11 players
    if (this.props.selectedPlayers.length < 11) {
      // Trigger search
      this.getPlayersData(e.target.value.toLocaleLowerCase().normalize().replace(/\s/g, ''))
    } else {
      this.setState({ isLoading: false })
    }
  }

  updateValue = newValue => {
    this.setState({ value: newValue })
  }

  render() {
    return (
      <div>
        <input
          className="Search-player"
          type="search"
          value={this.state.value}
          onFocus={() => { document.querySelector('.Results').style.display = 'block' }}
          onChange={this.updateSearch}
          placeholder="Search for a player..."
          autoFocus
        />
        <div className="Results">
          {this.state.noMatches &&
            <div className="Result-player">
              <p className="Status">No matching player</p>
            </div>
          }
          {this.props.selectedPlayers.length < 11 &&
          this.state.value !== "" &&
          this.props.results.map(player => (
            // Create result list from search results
            <SearchResult
              player={player}
              selectPlayer={this.props.selectPlayer}
              updateValue={this.updateValue}
              key={`Result${player.id}`}
              lastPlayerToAdd={this.props.selectedPlayers.length === 10}
            />
          ))}
          {this.state.isLoading &&
            // Display loading messages while waiting for results
            <div className="Result-player">
              <p className="Status">Loading players...</p>
            </div>
          }
          {this.props.selectedPlayers.length >= 11 && window.innerWidth > 910 &&
            <div className="Result-player">
              <p className="Status">Can't add more players</p>
            </div>
          }
        </div>
      </div>
    )
  }
}