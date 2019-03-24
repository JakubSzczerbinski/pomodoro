
import React from 'react';
import styled from 'styled-components';

import {div, mod} from './helpers.js';
import {Button} from './common_components.js';

const TimerDisplay = styled.span``;

const fillDigits = (number, digits) => {
  let text = number.toString();
  while (text.length < digits) {
    text = "0" + text;
  }
  return text;
}

const clockDisplayFromSeconds = (seconds) => {
  const secondsText = fillDigits(mod(seconds, 60), 2);
  const minutesText = fillDigits(div(seconds, 60), 2);
  return minutesText + ":" + secondsText;
}

class Timer extends React.Component {
  static Completed = () => "TimerCompleted";
  static Updated = () => "TimerUpdated";
  static Stopped = () => "TimerStopped";
  static Started = () => "TimerStarted";

  constructor(props) {
    super(props)
    this.state = { timer: 0, running: false };
    this.handler = this.props.handler;
  }

  onPauseResume = (ev) => {
    if (this.state.running)
      this.stop();
    else
      this.start();
  }

  emitEvent = (type) => {
    this.handler({
      type,
      ...this.state,
    });
  }

  updateTimer = () => {
    if (this.state.timer >= this.props.end) {
      stop();
      this.emitEvent(Timer.Completed());
      return;
    }

    this.setState({ 
      timer: this.state.timer + 1,
      running: true,
    });
    this.emitEvent(Timer.Updated());
  }

  stop = () => {
    if (!this.state.running)
      return;

    clearInterval(this.timerId);
    this.setState({ 
      timer: this.state.timer,
      running: false,
    });
    this.emitEvent(Timer.Stopped());
  }

  start = () => {
    if (this.state.running)
      return;

    this.timerId = setInterval(this.updateTimer, 1000);
    this.setState({ 
      timer: this.state.timer,
      running: true,
    });
    this.emitEvent(Timer.Started());
  }

  componentDidMount = () => {
    this.start();
  }

  componentWillUnmount = () => {
    this.stop();
  }

  render = () => {
    return (
      <TimerDisplay> 
        {clockDisplayFromSeconds(this.state.timer)}{"/"}
        {clockDisplayFromSeconds(this.props.end)}
        <Button onClick={this.onPauseResume}>
          {this.state.running ? "/Pause" : "/Resume"}
        </Button>
      </TimerDisplay>
    );
  }
}

export default Timer;

