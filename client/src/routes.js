import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  App,
  Home,
  Repo,
  AssignmentPage,
  GraderPage,
  NotFound
} from 'containers';

export default function Routes() {
  return (
    <App>
      <Switch>
        {/* Home (main) route */}
        <Route exact path="/" component={Home} />
        <Route exact path="/repo/:repoId" component={Repo} />
        <Route
          exact
          path="/repo/:repoId/:assignmentId"
          component={AssignmentPage}
        />
        <Route
          path="/repo/:repoId/:assignmentId/:graderId"
          component={GraderPage}
        />

        {/* Catch all route */}
        <Route component={NotFound} status={404} />
      </Switch>
    </App>
  );
}
