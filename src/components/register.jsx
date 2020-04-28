import React, { Component } from "react";
import axios from "axios";

import {
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBModal,
  MDBModalHeader,
  MDBModalFooter
} from "mdbreact";

class Register extends Component {
  state = {
    modal: false
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      usernameError: "",
      emailError: "",
      passwordError: ""
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  handleUsernameChange = event => {
    this.setState({
      username: event.target.value
    });
  };

  handleEmailChange = event => {
    this.setState({
      email: event.target.value
    });
  };

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value
    });
  };

  validate = () => {
    if (!this.state.username.length > 0) {
      this.setState({
        usernameError: "username should be more than 3 characters"
      });
      return false;
    }
    if (!this.state.email.includes("@")) {
      this.setState({ emailError: "email should contain @" });
      return false;
    }

    if (!this.state.password.length > 0) {
      this.setState({ passwordError: "weak password" });
      return false;
    }

    return true;
  };

  handleSubmit = event => {
    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      // clear form
      this.setState({
        username: "",
        email: "",
        password: "",
        usernameError: "",
        emailError: "",
        passwordError: "",
        modal: !this.state.modal
      });
    }
  };
  async getUsers() {
    const request = {
      userId: 0,
      username: this.state.username,
      userEmail: this.state.userEmail,
      password: this.state.password,
      status: 1,
      createdDate: new Date(),
      createdBy: "Admin",
      role: "USER"
    };
    axios
      .post("http://localhost:8111/dalrada/user/userResource/users/create", {
        request
      })
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }
  render() {
    return (
      <div className="row">
        <div className="col-xl-8 offset-1 col-sm-12">
          <MDBCard>
            <MDBCardHeader
              titleClass="d-inline title"
              color="cyan darken-3"
              type="text"
              className="text-center  darken-3 white-text"
            >
              Register
            </MDBCardHeader>
            <MDBCardBody>
              <form onSubmit={this.handleSubmit}>
                <MDBInput
                  label="Your name"
                  className="text-center"
                  type="text"
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                />
                <div className="text-center red-text">
                  {this.state.usernameError}
                </div>
                <MDBInput
                  label="Your email"
                  type="text"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  className="text-center"
                  iconClass="dark-grey"
                />
                <div className="text-center red-text">
                  {this.state.emailError}
                </div>
                <MDBInput
                  label="Your password"
                  type="password"
                  className="text-center"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  iconClass="dark-grey"
                />
                <div className="text-center red-text">
                  {this.state.passwordError}
                </div>
                <div className="text-center mt-1-half">
                  <MDBBtn
                    color="danger"
                    className="mb-2 rounded-pill"
                    outline
                    type="submit"
                  >
                    Register
                    <MDBIcon icon="paper-plane" className="ml-1" />
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </div>
        <MDBModal isOpen={this.state.modal} toggle={this.toggle} size="fluid">
          <MDBModalHeader toggle={this.toggle}>
            <span>Successfully Registered</span>
          </MDBModalHeader>
          <MDBModalFooter>
            <MDBBtn
              color="secondary"
              className="mb-2 mt-3 rounded-pill"
              onClick={this.toggle}
              outline
            >
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </div>
    );
  }
}

export default Register;
