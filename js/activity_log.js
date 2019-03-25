
import React from "react";
import styled from "styled-components";

import {Button} from './common_components.js';
import Timer from './timer.js';

const ShortBreak = "ShortBreak";
const LongBreak = "LongBreak";
const Pomodoro = "Pomodoro";
const Empty = "Empty";

const timeOfActivity = (Activity) => {
  const map = {
    ShortBreak: 5 * 60,
    LongBreak: 10 * 60,
    Pomodoro: 25 * 60,
    Empty: 0,
  }
  return map[Activity];
}

const endOfActivitySound = new Audio('end_of_activity.wav');

const Log = styled.div`
  border-top: 0.06em #f8f8f8 solid;
  margin-top: 1.5em;
`;

const Activity = styled.div`
  color: #f8f8f8;
	background-color: inherit;
  padding: 0.4em 0;
  border-bottom: #f8f8f8 .06em solid;
  &:before {
    color: #ffa800;
    content: "${props => props.activityNumber + "  "}";
  }
`;

class ActivityLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key : 1,
      current_activity: {
        type : Empty,
        key: 0,
      },
      log : [],
    };
  }

  onTimerEvent = (ev) => {
    switch (ev.type) {
      case Timer.Completed():
        endOfActivitySound.play();
        this.setState({
          key: this.state.key + 1,
          current_activity: { type: Empty, key: this.state.key },
          log: [
            this.state.current_activity,
            ...this.state.log,
          ],
        });
    }
  }

  onNewActivity = activity => ev => {
    this.setState({
      key: this.state.key + 1,
      current_activity: { type: activity, key : this.state.key},
      log: this.state.log,
    });
  }

  render () {
    const onNewActivity = this.onNewActivity;
    return (
      <div>
        ➜
        <Button onClick={onNewActivity(Pomodoro)}>/{Pomodoro}</Button>
        <Button onClick={onNewActivity(LongBreak)}>/{LongBreak}</Button>
        <Button onClick={onNewActivity(ShortBreak)}>/{ShortBreak}</Button>
      <Log>
        {(() => {
          const current_activity_t = this.state.current_activity.type;
          if (current_activity_t != Empty)
            return (
              <Activity activityNumber={1}>
                {current_activity_t} {" | "}
                <Timer 
                  key={this.state.key}
                  handler={this.onTimerEvent}
                  end={timeOfActivity(current_activity_t)}
                />
              </Activity>
            );
          else
            return "";
        })()}
        {this.state.log.map((el, i) => (
          <Activity 
            key={el.key} 
            activityNumber={i + 1 + (this.state.current_activity.type != Empty)}
          >
            {el.type}
          </Activity> 
        ))}
      </Log>
      </div>
    );
  }
  
};

export default ActivityLog;

