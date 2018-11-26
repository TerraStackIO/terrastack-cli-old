import { Component } from "react";
import spinners from "cli-spinners";

class Spinner extends Component {
  constructor(props) {
    super(props);

    this.state = { frame: 0 };
    this.switchFrame = this.switchFrame.bind(this);
  }

  getSpinner() {
    return spinners.dots;
  }

  render() {
    const spinner = this.getSpinner();
    return spinner.frames[this.state.frame];
  }

  componentDidMount() {
    const spinner = this.getSpinner();

    this.timer = setInterval(this.switchFrame, spinner.interval);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  switchFrame() {
    const { frame } = this.state;

    const spinner = this.getSpinner();
    const isLastFrame = frame === spinner.frames.length - 1;
    const nextFrame = isLastFrame ? 0 : frame + 1;

    this.setState({
      frame: nextFrame
    });
  }
}

module.exports = { Spinner };
