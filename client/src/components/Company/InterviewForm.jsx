import React from 'react';
import { Grid, Row, Col, Image, Button, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeQuestion, saveInterview } from '../../actions/company';

/*let algorithm = [];
let system = [];
let behavioral = [];*/

class InterviewForm extends React.Component {
  /*renderAll() {*/
    /*system = [];
    algorithm = [];
    behavioral = [];
    return this.props.companyProfile.selectedQuestion.map((item) => {
      //console.log('in render all map', algorithm, 'selected questions', this.props.companyProfile.selectedQuestion, 'item', item)
      if (item.type === 'algorithm') {
        algorithm.push(item)
      }
      if (item.type === 'data structure') {
        system.push(item)
      }
      if (item.type === 'behavioral') {
        behavioral.push(item)
      }
    })
  }*/

  /*  shouldComponentUpdate(nextProps, nextState) {
      console.log('nextPropsCompanyprofile', nextProps.companyProfile)
      console.log('thispropscompanyprofile', this.props.companyProfile)
      if (this.props.companyProfile.selectedQuestion) {
        console.log('in shold UPDATE after if statement')
        if (this.props.companyProfile.selectedQuestion.length < nextProps.companyProfile.selectedQuestion.length) {
          return true;
        }
      }
      return false;
    }*/
  render() {
   /* console.log('this.props.companyProfile in Interview Form', this.props.companyProfile, 'szstem questions', system);
    if (this.props.companyProfile.selectedQuestion) {
      this.renderAll()*/
      return (
        <div>
          <div><h3 className="selectedQ">Selected algorithm questions</h3>
            <div>{this.props.companyProfile.selectedQuestion.filter(question => question.type === 'algorithm').map((item) => {
              return (
                 <div onClick={()=> this.props.removeQuestion(item)}>
                <h4>{item.title}</h4>
                {item.question}</div>)
            })}
            </div>
            <h3 className="selectedQ">Selected system design questions</h3>
            <div>{this.props.companyProfile.selectedQuestion.filter((question) => question.type === 'data structure').map(( item )=> {
              return (
                <div onClick={()=> this.props.removeQuestion(item)}>
                <h4>{item.title}</h4>
                {item.question}</div>)
            })}
            </div>
            <h3 className="selectedQ">Selected behavioral questions</h3>
            <div>{this.props.companyProfile.selectedQuestion.filter(question => question.type === 'behavioral').map((item) => {
              return (
                <div onClick={()=> this.props.removeQuestion(item)}>
                <h4>{item.title}</h4>
                {item.question}</div>)
            })}
              <div className="space"></div>
              <Button onClick={()=> {this.props.saveInterview({postId: this.props.companyProfile.createdJob.data.jobposts.id, questions: this.props.companyProfile.selectedQuestion })}}>Save</Button>
              <div className="space"></div>
            </div>
          </div>
        </div>
      )
  }
}

function mapStateToProps(state) {
  return {
    companyProfile: state.companyProfile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ removeQuestion, saveInterview }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewForm);