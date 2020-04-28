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
  MDBModalBody,
  MDBModalFooter,
} from "mdbreact";

class Welcome extends Component {
  state = {
    modal: false,
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      usernameError: "",
      passwordError: "",
    };
  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };
  validate = () => {
    if (!this.state.username.length > 0) {
      this.setState({
        usernameError: "username is mandatory",
      });
      return false;
    }

    if (!this.state.password.length > 0) {
      this.setState({ passwordError: "password is mandotory" });
      return false;
    }

    return true;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      // clear form
      this.setState({
        username: "",
        email: "",
        password: "",
        usernameError: "",
        passwordError: "",
        modal: !this.state.modal,
      });
    }
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      this.login();
      // clear form
      this.setState({
        username: "",
        email: "",
        password: "",
        usernameError: "",
        emailError: "",
        passwordError: "",
      });
    }
  };

  async logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("user");
  }

  async login() {
    const username = this.state.username;
    const password = this.state.password;
    const url =
      "http://localhost:8111/public/users/login/" + username + "/" + password;
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        const token = {
          uuid: response.data,
        };
        localStorage.setItem("token", JSON.stringify(token));

        this.props.history.push("/home");
      })
      .catch((error) => console.log(error));
  }

  forgetPassword() {
    const username = this.state.username;
    const url = "http://localhost:8111/forgetPassword/" + username;
    axios
      .get(url)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div className="row">
        <div className="col-xl-8 offset-1 col-sm-12">
          <MDBCard>
            <MDBCardHeader
              titleClass="d-inline title"
              color="cyan darken-3"
              className="text-center darken-3 white-text"
            >
              Sign In
            </MDBCardHeader>
            <MDBCardBody>
              <form onSubmit={this.handleSubmit}>
                <MDBInput
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                  label="User Name"
                  type="text"
                  iconClass="dark-grey"
                  className="text-center"
                />{" "}
                <div className="text-center red-text">
                  {this.state.usernameError}
                </div>
                <MDBInput
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  label="Password"
                  type="password"
                  iconClass="dark-grey"
                  className="text-center"
                />
                <div className="text-center red-text" style={{}}>
                  {this.state.passwordError}
                </div>
                <div className="text-center mt-1-half">
                  <MDBBtn
                    color="danger"
                    type="submit"
                    className="mb-2 rounded-pill"
                    outline
                  >
                    Sign In
                    <MDBIcon icon="paper-plane" className="ml-1" />
                  </MDBBtn>

                  <MDBBtn
                    color="danger"
                    className="mb-2 rounded-pill"
                    outline
                    onClick={this.toggle}
                  >
                    forget password ?
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </div>
        <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>
            Password Recovery
          </MDBModalHeader>
          <MDBModalBody>
            <MDBInput
              label="Your name"
              value={this.state.username}
              onChange={this.handleUsernameChange}
              type="text"
              iconClass="dark-grey"
              className="text-center"
            />
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn
              color="secondary"
              className="mb-2 mt-3 rounded-pill"
              onClick={this.toggle}
              outline
            >
              Close
            </MDBBtn>
            <MDBBtn
              color="primary"
              className="mb-2 mt-3 rounded-pill"
              outline
              onClick={this.forgetPassword.bind(this)}
            >
              Send Mail
              <MDBIcon icon="paper-plane" className="ml-1" />
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </div>
    );
  }
}

export default Welcome;
