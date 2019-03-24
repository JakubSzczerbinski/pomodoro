
import ReactDOM from "react-dom";
import React from "react";
import styled from "styled-components";

import ActivityLog from './activity_log.js';

const Content = styled.div`
  margin: auto;
  width: 30em;
`;

const Title = styled.div`
  margin: 0.5em;
`;

const App = (props) => {
  return (
    <Content>
      <Title> <h1> Pomodoro </h1> </Title>
      <ActivityLog> </ActivityLog>
    </Content>
  );
}

ReactDOM.render(
  <App> </App>,
  document.getElementById('root')
);

