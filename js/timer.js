
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

const Completed = "TimerCompleted";
const Updated = "TimerUpdated";
const Stopped = "TimerStopped";
const Started = "TimerStarted";

const useTimer = (begin, end, eventHandler) => {
  const [time, setTime] = React.useState(begin);
  const [isRunning, setIsRunning] = React.useState(true);

  React.useEffect(() => {
    if (isRunning) {
      let currentTime = time;
      let timeout = setInterval(() => {
        currentTime = currentTime + 1;
        setTime(currentTime);
        if (currentTime >= end) {
          setIsRunning(false);
          eventHandler(Completed);
        };
      }, 1000);
      return () => { 
        clearTimeout(timeout);
      }
    }
  }, [isRunning]);

  return {
    begin,
    end,
    time,
    isRunning,
    resume: () => setIsRunning(true),
    pause: () => setIsRunning(false),
  };
}

const Timer = (props) => {
  const onEvent = ev => {
    switch (ev) {
      case Completed:
        props.onCompleted();
    }
  }
  const timer = useTimer(0, props.end, onEvent);
  
  return (
    <TimerDisplay> 
      {clockDisplayFromSeconds(timer.time)}{"/"}
      {clockDisplayFromSeconds(timer.end)}
      {timer.isRunning ? 
        (
          <Button onClick={e => timer.pause()}>
            /Pause      
          </Button>
        ) :
        (
          <Button onClick={e => timer.resume()}>
            /Resume
          </Button>
        )
      }
    </TimerDisplay>
  )
}

export default Timer;

