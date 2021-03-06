import React from 'react';
import { Grid, Row, Col, Image, Button, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NotificationSystem from 'react-notification-system';
import { Card } from 'semantic-ui-react';
import { removeQuestion, saveInterview, hidePostModal } from '../../actions/company';


const defaultColors = {
  success: {
    rgb: '33, 133, 208',
    hex: '#2185D0'
  },
  error: {
    rgb: '236, 61, 61',
    hex: '#ec3d3d'
  },
  warning: {
    rgb: '235, 173, 23',
    hex: '#ebad1a'
  },
  info: {
    rgb: '54, 156, 199',
    hex: '#369cc7'
  }
};
const defaultShadowOpacity = '0.9';

const style = {
  NotificationItem: {
    DefaultStyle: {
      backgroundColor: 'grey',
      fontSize: '20px'
    },
    success: {
      borderTop: '2px solid grey',
      rgb: '33, 133, 208',
      backgroundColor: 'black',
      color: 'white',
      marginTop: '75px',
      WebkitBoxShadow: `0 0 1px rgba(${defaultColors.success.rgb},${defaultShadowOpacity})`,
      MozBoxShadow: `0 0 1px rgba(${defaultColors.success.rgb},${defaultShadowOpacity})`,
      boxShadow: `0 0 1px rgba(${defaultColors.success.rgb},${defaultShadowOpacity})`
    },
    Dismiss: {
      DefaultStyle: {
        backgroundColor: '#2185D0',
        color: '#2185D0'
      },
      success: {
        color: 'grey',
        backgroundColor: '#2185D0'
      }
    }
  }
};

class InterviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.notificationSystem = null;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addNotification = this.addNotification.bind(this);
  }
  addNotification() {
    if (this.notificationSystem) {
      this.notificationSystem.addNotification({
        message: 'Interview for open position has been saved',
        level: 'success',
        position: 'tr',
        autoDismiss: 5
      });
    }
  }

  handleSubmit() {
    const { addNotification } = this.props;
    this.addNotification();
  }

  render() {
    return (
      <div>
        <Card color="teal">
          <Card.Content>
            <Card.Header>Saved Questions</Card.Header>
            <Card.Description>
              <h5 >Selected Algorithm Question</h5>
              <div>{this.props.companyProfile.selectedQuestion.filter(question => question.type === 'Algorithm').map((item) => {
                return (
                  <div className="selected-question" onClick={() => this.props.removeQuestion(item)}>{item.question}</div>
                );
              })}
              </div>
              <h5 >Selected System Design Question</h5>
              <div>{this.props.companyProfile.selectedQuestion.filter(question => question.type === 'System Design').map((item) => {
                return (
                  <div className="selected-question" onClick={() => this.props.removeQuestion(item)}>{item.question}</div>
                );
              })}
              </div>
              <h5 >Selected Behavioral Question</h5>
              <div>{this.props.companyProfile.selectedQuestion.filter(question => question.type === 'Behavioral').map((item) => {
                return (
                  <div className="selected-question" onClick={() => this.props.removeQuestion(item)}>{item.question}</div>
                );
              })}
                <Button
                  className="saveButtonForm" onClick={() => {
                    this.props.saveInterview({ postId: this.props.companyProfile.createdJob.data.jobposts.id, questions: this.props.companyProfile.selectedQuestion }); this.handleSubmit(); setTimeout(() => {
                      this.props.hidePostModal();
                    }, 3000);
                  }}
                >Save Interview</Button>
              </div>
              <div><NotificationSystem ref={n => this.notificationSystem = n} style={style} /></div>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    companyProfile: state.companyProfile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ removeQuestion, saveInterview, hidePostModal }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);

