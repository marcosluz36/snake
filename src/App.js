import React, { Component } from 'react'

import Menu from './components/Menu';
import Food from './components/Food';
import Part from './components/Part';
import Score from './components/Score';

const start = {
  active: true,
  speed: 120, // ms
  direction: "right",
  snake: [[50, 70], [60, 70], [70, 70], [80, 70]], // Start with 4 block snake
  food: [200, 70],
  score: 0,
  high_score: localStorage.getItem("high_score")
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = start;
  }

  componentDidMount() {
    this.swapClass();
    document.addEventListener("keydown", this.handleKeys, false);
    if (this.state.active) {
      this.startStop(false);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // When the state changes, check if we've reached a % 5 milestone
    // Run speedUp once, but not again until next time (state updates each time snake moves)
    let score = this.state.score;
    if (score % 3 === 0 && score > 0 && score !== prevState.score) {
      this.speedUp();
    }

    document.addEventListener("keydown", this.handleKeys, false);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  startStop = manual => {
    let active = this.state.active;
    // console.log(localStorage.getItem('high_score'));
    if (manual) {
      this.setState({ active: !active });
    }
    // This is reading the previous state, before manual switched it
    if (!active) {
      this.interval = setInterval(() => this.updateSnake(), this.state.speed);
    } 
    else {
      clearInterval(this.interval);
      let high_score = this.state.high_score;
      if (this.state.score > high_score || high_score === null) {
        high_score = this.state.score;
      }
      localStorage.setItem("high_score", high_score);
      this.setState({
        active: false,
        speed: 120, // ms
        direction: "right",
        snake: [[50, 70], [60, 70], [70, 70], [80, 70]], // Start with 4 block snake
        food: [200, 70],
        score: 0,
        high_score: high_score
      });
    }
  };

  updateSnake() {
    var direction = this.state.direction;
    var currentSnake = this.state.snake;
    var snakeHead = currentSnake[currentSnake.length - 1];
    var newHead = [];
    var target = this.state.food;
    switch (direction) {
      case "up":
        newHead = [snakeHead[0], snakeHead[1] - 10];
        break;
      case "right":
        newHead = [snakeHead[0] + 10, snakeHead[1]];
        break;
      case "down":
        newHead = [snakeHead[0], snakeHead[1] + 10];
        break;
      case "left":
        newHead = [snakeHead[0] - 10, snakeHead[1]];
        break;
      default:
        newHead = [snakeHead[0], snakeHead[1]];
    }
    currentSnake.push(newHead);

    currentSnake.forEach((val, i, array) => {
      // As long as its not checking against itself...
      if (i !== array.length - 1) {
        // Check if its colluding with its body
        if (val.toString() === newHead.toString()) {
          // Head has collided with body
          //   console.log('collide');
          this.startStop(true);
        }
      }
    });

    // collusion detection
    if (
      newHead[0] > 390 ||
      newHead[0] < 0 ||
      newHead[1] > 320 ||
      newHead[1] < 30
    ) {
      // Enable this is you want the wall collusion rule
      // this.startStop(true);

      // This is teleporting the snake through the walls
      let teleHead = currentSnake[currentSnake.length - 1];
      if (newHead[0] > 390) {
        teleHead[0] = teleHead[0] - 400;
        currentSnake.shift();
      }
      if (newHead[0] < 0) {
        teleHead[0] = teleHead[0] + 400;
        currentSnake.shift();
      }
      if (newHead[1] > 320) {
        teleHead[1] = teleHead[1] - 300;
        currentSnake.shift();
      }
      if (newHead[1] < 30) {
        teleHead[1] = teleHead[1] + 300;
        currentSnake.shift();
      }
    } else {
      // If food is eaten
      if (newHead[0] === target[0] && newHead[1] === target[1]) {
        let posX = Math.floor(Math.random() * (380 - 10 + 1)) + 10;
        let posY = Math.floor(Math.random() * (280 - 40 + 1)) + 40;
        posX = Math.ceil(posX / 10) * 10;
        posY = Math.ceil(posY / 10) * 10;
        this.setState(prevState => ({
          snake: currentSnake,
          food: [posX, posY],
          score: prevState.score + 1
        }));
      } else {
        currentSnake.shift();
        if (this.state.active) {
          this.setState({ snake: currentSnake });
        }
      }
    }
  }

  handleKeys = event => {
    let currentD = this.state.direction;
    let active = this.state.active;
    //  console.log(event.keyCode);
    if (event.keyCode === 13) {
      this.startStop(true);
    }
    if (event.keyCode === 65 && currentD !== "right") {
      this.setState({ direction: "left" });
      this.swapClass();
    }
    if (event.keyCode === 68 && currentD !== "left") {
      this.setState({ direction: "right" });
      this.swapClass();
    }
    if (event.keyCode === 87 && currentD !== "down") {
      this.setState({ direction: "up" });
      this.swapClass();
    }
    if (event.keyCode === 83 && currentD !== "up") {
      this.setState({ direction: "down" });
      this.swapClass();
    }
  };

  speedUp = () => {
    let speed = this.state.speed;
    if (speed > 50) {
      speed = speed - 2;
    }
    clearInterval(this.interval);
    this.interval = setInterval(() => this.updateSnake(), speed);
    this.setState({ speed: speed });
  };

  // #root takes on the class of the direction, good for styling opportunities?
  swapClass = () => {
    var root = document.getElementById("root");
    root.className = "";
    root.className = this.state.direction;
  };

  render() {
    var theSnake = this.state.snake;
    var food = this.state.food;
    return (
      <React.Fragment>
        <Menu active={this.state.active} />
        <Score score={this.state.score} highScore={this.state.high_score} />
        {theSnake.map((val, i) => (
          <Part
            key={i}
            transition={this.state.speed}
            direction={this.state.direction}
            top={val[1]}
            left={val[0]}
          />
        ))}
        <Food top={food[1]} left={food[0]} />
      </React.Fragment>
    );
  }
}

export default App;