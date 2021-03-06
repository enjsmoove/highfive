import React, { Component } from 'react';
import { Card, Icon, Image, Rating, Header, List, Statistic } from 'semantic-ui-react';
import { Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import BrowseCardList from './BrowseCardList';


class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
    this.props.fetchUsers();
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col md={12}>
            <Header as="h3" icon textAlign="center">
              Users
            <Icon link name="user" circular />
            </Header>
            <div className="text-center">
              { this.props.users ?
                <Statistic>
                  <Statistic.Value>{ this.props.users.length } </Statistic.Value>
                  <Statistic.Label>Total Users</Statistic.Label>
                </Statistic>
                : '' }
            </div>
            <hr />
          </Col>
        </Row>
        <Row>
          { this.props.users ?
            <BrowseCardList
              users={this.props.users}
            /> : '' }
        </Row>
      </Grid>
    );
  }
}

export default Browse;

