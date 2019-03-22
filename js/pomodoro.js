
import ReactDOM from "react-dom";
import React from "react";
import styled from "styled-components";

const Content = styled.div`
  margin: 2em auto auto auto;
  font-family: Roboto;
  color: #f8f8f8;
`;

const TimerDisplay = styled.span`
`;

const fillDigits = (number, digits) => {
  let text = number.toString();
  while (text.length < digits) {
    text = "0" + text;
  }
  return text;
}

const mod = (lhs, rhs) => {
  return lhs % rhs;
};

const div = (lhs, rhs) => {
  return Math.floor(lhs / rhs);
};

const clockDisplayFromSeconds = (seconds) => {
  const secondsText = fillDigits(mod(seconds, 60), 2);
  const minutesText = fillDigits(div(seconds, 60), 2);
  return minutesText + ":" + secondsText;
}

const ShortBreak = "ShortBreak";
const LongBreak = "LongBreak";
const Pomodoro = "Pomodoro";
const Empty = "Empty";

const timeOfAction = (Action) => {
  const map = {
    ShortBreak: 5 * 60,
    LongBreak: 10 * 60,
    Pomodoro: 25 * 60,
  }
  return map[Action];
}

const handler = () => {
  let subscribers = []
  return {
    publish: (action) => {
      subscribers.map((subsrciber) => {
        console.log(action, subsrciber);
        if (subsrciber.types.indexOf(action.type) !== -1)
        {
          console.log("XD");
          subsrciber.callback(action);
        }
      });
    },

    subscribe: (actions, callback) => {
      subscribers.push({ types : actions, callback });
    },
  }
}

const Log = styled.div`
`;
const Action = styled.div`
  color: #f8f8f8;
	background-color: #38252c;
  padding: 0.5em;
  margin: 0.5em;
`;
const Button = styled.button`
  margin: 0.5em;
  border: 0;
	padding: 0.5em;
	font-size: 1.2em;
	background-color: #76b639;
  padding: 0.5em;
`;

class ActionLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key : 1,
      current_action: {
        type : Empty,
        key: 0,
      },
      log : [],
    };
    this.handler = handler();
    console.log(this.handler);
    this.handler.subscribe([TimerCompleted], this.onTimerCompleted);
  }

  onTimerCompleted = (action) => {
    this.setState({
      key: this.state.key + 1,
      current_action: { type: Empty, key: this.state.key },
      log: [
        this.state.current_action,
        ...this.state.log,
      ],
    });
  }

  onNewAction = action => ev => {
    this.setState({
      key: this.state.key + 1,
      current_action: { type: action, key : this.state.key},
      log: this.state.log,
    });
  }

  render () {
    const onNewAction = this.onNewAction;
    return (
      <Log>
        <Button onClick={onNewAction(Pomodoro)}> {Pomodoro} </Button>
        <Button onClick={onNewAction(LongBreak)}> {LongBreak} </Button>
        <Button onClick={onNewAction(ShortBreak)}> {ShortBreak} </Button>
        {(() => {
          const action_type = this.state.current_action.type;
          if (this.state.current_action.type != Empty)
            return (
              <Action>
                {this.state.current_action.type} {" | "}
                <Timer 
                  key={this.state.key}
                  handler={this.handler}
                  end={timeOfAction(action_type)}
                />
              </Action>
            );
          else
            return "";
        })()}
        {this.state.log.map((el) => (
          <Action> {el.type} </Action> 
        ))}
      </Log>
    );
  }
  
};

const TimerCompleted = "TimerCompleted";
const TimerUpdated = "TimerUpdated";
const TimerStopped = "TimerStopped";
const TimerStarted = "TimerStarted";

class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = { timer: 0 };
    this.handler = this.props.handler;
  }

  updateTimer() {
    if (this.state.timer >= this.props.end)
    {
      stop();
      this.handler.publish({
        type: TimerCompleted,
        time : this.state.timer,
      });
      return;
    }
    this.setState({ timer : this.state.timer + 1 });
  }

  stop() {
    if (this.timerId)
    {
      this.handler.publish({
        type: TimerStopped,
        time: this.state.timer,
      });
      clearInterval(this.timerId);
    }
  }

  start () {
    if (!this.timerId)
    {
      this.handler.publish({
        type: TimerStarted,
        time: this.state.type,
      });
      this.timerId = setInterval(
        () => this.updateTimer(),
        1000
      );
    }
  }

  componentDidMount () {
    this.start();
  }

  componentWillUnmount () {
    this.stop();
  }

  state = { timer: 0 }; 
  render = () => {
    return (
      <TimerDisplay> 
        {clockDisplayFromSeconds(this.state.timer)} {" / "}
        {clockDisplayFromSeconds(this.props.end)}
      </TimerDisplay>
    );
  }
}

const Title = styled.div`
  margin: 1em;
`;

const App = (props) => {
  return (
    <Content>
      <Title> <h1> Pomodoro </h1> </Title>
      <ActionLog> </ActionLog>
    </Content>
  );
}

ReactDOM.render(
  <App> </App>,
  document.getElementById('root')
);

