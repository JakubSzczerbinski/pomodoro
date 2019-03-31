
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
    ShortBreak: 5,
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

const useKeyGenerator = () => {
  const [currentKey, setKey] = React.useState(0);
  const generateKey = () => {
    setKey(currentKey + 1);
    return currentKey;
  }
  return generateKey; 
}

const ActivityLog = props => {
  const generateKey = useKeyGenerator();
  const [log, setLog] = React.useState([]);

  const addActivity = activityType => {
    const key = generateKey();
    const logEntry = {
      key,
      type: activityType,
      completed: false,
    };
    
    if (log.length == 0 || log[0].completed)
    {
      setLog([logEntry, ...log]);
      return;
    }

    setLog([logEntry, ...log.slice(1)]);
  };

  const onActivityCompleted = () => {
    const key = generateKey();
    const logEntry = {
      key,
      type: log[0].type,
      completed: true,
    };
    
    endOfActivitySound.play();
    setLog([logEntry, ...log.slice(1)]);
  }

  return (   
      <div>
        ➜ {[Pomodoro, LongBreak, ShortBreak].map(
          type => 
            <Button key={type} onClick={e => addActivity(type)}>
              /{type}
            </Button>
        )}
      <Log>
        {log.map((el, i) =>
          <Activity key={el.key} activityNumber={i + 1}>
            {el.type} 
            {el.completed ?
              " " :
              (<span>{" | "}
                <Timer
                  end={timeOfActivity(el.type)}
                  onCompleted={onActivityCompleted}
                /> 
              </span>)
            }
          </Activity> 
        )}
      </Log>
      </div>
  )
}

export default ActivityLog;

