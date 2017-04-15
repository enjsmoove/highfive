
import React from 'react';
import { Grid, Row, Col, Image } from 'react-bootstrap';
import CompanyAuth from './CompanyAuth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCompany, getIndustries, getLocations } from '../../actions/company';

class CompanyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this.props.getCompany(this.props.companyAuth.companyAuth.company_backend_profile.id);
    this.props.getIndustries();
    this.props.getLocations();
  }

  renderProfile() {
    console.log(this.props, 'PROPS IN COMPANY DETAILS')
    if (this.props.companyAuth.companyProfile.profileEdited) {
      return (
        <div>
          {this.props.companyAuth.companyProfile.industries.filter((item) => item.id === this.props.industry_id).map(item =>
            <div>{this.props.companyAuth.companyProfile.picture ?
            <Image className="company-img text-center" src={this.props.companyAuth.companyProfile.picture} circle />:
            <Image className="company-img text-center" src={this.props.profile_img} circle />}
              <h1>{this.props.name}</h1>
              <h2>{item.name}</h2></div>)}
          {this.props.companyAuth.companyProfile.locations.filter((item) => item.id === this.props.location_id).map(item =>
            <h2>{item.city}</h2>)}
        </div>)
    }
    else if (this.props.companyAuth.companyProfile.companyReload && this.props.companyAuth.companyProfile.industries && this.props.companyAuth.companyAuth.company_backend_profile.name !== this.props.companyAuth.companyProfile.companyReload[0].name) {
      return (
        <div>
          {this.props.companyAuth.companyProfile.industries.filter((item) => item.id === this.props.companyAuth.companyProfile.companyReload[0].industry_id).map(item =>
            <div>{this.props.companyAuth.companyProfile.picture ?
            <Image className="company-img text-center" src={this.props.companyAuth.companyProfile.picture} circle />:
            <Image className="company-img text-center" src={this.props.companyAuth.companyProfile.companyReload[0].profile_img} circle />}
              <h1>{this.props.companyAuth.companyProfile.companyReload[0].name}</h1>
              <h2>{item.name}</h2></div>)}
          {this.props.companyAuth.companyProfile.locations.filter((item) => item.id === this.props.companyAuth.companyProfile.companyReload[0].location_id).map(item =>
            <h2>{item.city}</h2>)}
        </div>)
    }
    else {
      return (
        <div>{this.props.companyAuth.companyProfile.picture ?
            <Image className="company-img text-center" src={this.props.companyAuth.companyProfile.picture} circle />:
          <Image className="company-img text-center" src={this.props.companyAuth.companyAuth.company_backend_profile.profile_img} circle />}
          <h1>{this.props.companyAuth.companyAuth.company_backend_profile.name}</h1>
          <h2>{this.props.companyAuth.companyAuth.company_backend_profile.industry_id}</h2>
          <h2>{this.props.companyAuth.companyAuth.company_backend_profile.location_id}</h2>
        </div>)
    }
  }
  render() {
    return (
      <div>
        <Grid fluid>
          <Row>
            <Col xs={6} md={4}>
              <div>
                {this.renderProfile()}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    companyAuth: state,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getCompany, getIndustries, getLocations }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetails);


/*}else if (this.props.companyAuth.companyProfile.profileReload) {
      return (
        <div>
          <Image className="company-img text-center" src={this.props.companyAuth.companyProfile.companyReload[0].profile_img} circle />
          <h1>{this.props.companyAuth.companyProfile.companyReload[0].name}</h1>
          <h2>{this.props.companyAuth.companyProfile.companyReload[0].industry_id}</h2>
          <h2>{this.props.companyAuth.companyProfile.companyReload[0].location_id}</h2>
        </div>

      )
    } else if (!this.props.companyAuth.companyProfile.profileReload) {
      return (
        <div>
          <Image className="company-img text-center" src={this.props.companyAuth.companyAuth.company_backend_profile.profile_img} circle />
          <h1>{this.props.companyAuth.companyAuth.company_backend_profile.name}</h1>
          <h2>{this.props.companyAuth.companyAuth.company_backend_profile.industry_id}</h2>
          <h2>{this.props.companyAuth.companyAuth.company_backend_profile.location_id}</h2>
        </div>
      )*/
