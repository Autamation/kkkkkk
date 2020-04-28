import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import Home from "./home";
import auth from "./auth";
import "./signIn.css";
import {
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBModal,
  MDBContainer,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBRow,
  MDBCol,
  MDBLink,
  MDBTypography,
} from "mdbreact";

class SignIn extends Component {
  state = {
    modal: false,
    registerModal: false,
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  toggleRegister = () => {
    this.setState({
      registerModal: !this.state.registerModal,
    });
  };
  constructor(props) {
    super(props);
    let loggedIn = false;
    this.state = {
      emailId: "",
      password: "",
      emailIdError: "",
      usernameError: "",
      passwordError: "",
      registerUsername: "",
      registerEmail: "",
      registerPassword: "",
      registerRole: "",
      registerUserId: "",
      registerUsernameError: "",
      registerPasswordError: "",
      registerEmailError: "",
      registerRoleError: "",
      loggedIn,
    };
  }

  componentDidMount() {
    this.getRoles();
  }

  reset() {
    this.setState({
      username: "",
      password: "",
      emailId: "",
      usernameError: "",
      emailIdError: "",
      passwordError: "",
      registerUsername: "",
      registerEmail: "",
      registerPassword: "",
      registerRole: "",
      registerUserId: "",
      registerUsernameError: "",
      registerPasswordError: "",
      registerEmailError: "",
      registerRoleError: "",
      forgotEmailId: "",
    });
  }

  resetError() {
    this.setState({
      usernameError: "",
      emailIdError: "",
      passwordError: "",
      forgotEmailIdError: "",
    });
  }
  resetRegisterError() {
    this.setState({
      registerUsernameError: "",
      registerPasswordError: "",
      registerEmailError: "",
      registerRoleError: "",
    });
  }

  handleEmailIdChange = (event) => {
    this.setState({
      emailId: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };
  handleForgotEmailIdChange = (event) => {
    this.setState({
      forgotEmailId: event.target.value,
    });
  };
  validate = () => {
    this.resetError();
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/;
    const usernameRegex = /^[a-zA-Z ]*$/;
    if (!this.state.username) {
      this.setState({
        usernameError: "username is mandatory",
      });
      return false;
    } else if (!usernameRegex.test(this.state.username)) {
      this.setState({
        usernameError: "username should contain oly alphabets",
      });
      return false;
    } else if (this.state.username.length < 3) {
      this.setState({
        usernameError: "username should contain morethan 3 letters",
      });
      return false;
    }

    if (!this.state.password) {
      this.setState({ passwordError: "Required" });
      return false;
    } else if (this.state.password.length < 8) {
      this.setState({ passwordError: "Password must be 8 characters long." });
      return false;
    } else if (!passwordRegex.test(this.state.password)) {
      this.setState({
        passwordError:
          "Password must contain at least one lowercase letter, at least one lowercase letter, at least one special character, at least one number, and 8 to 16 charaters",
      });
      return false;
    }

    return true;
  };

  validateRegister = () => {
    this.resetRegisterError();
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,16})/;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const usernameRegex = /^[a-zA-Z ]*$/;
    if (!this.state.registerUsername) {
      this.setState({
        registerUsernameError: "username is mandatory",
      });
      return false;
    } else if (!usernameRegex.test(this.state.registerUsername)) {
      this.setState({
        registerUsernameError: "username should contain oly alphabets",
      });
      return false;
    } else if (this.state.registerUsername.length < 3) {
      this.setState({
        registerUsernameError: "username should contain morethan 3 letters",
      });
      return false;
    }

    if (!this.state.registerEmail) {
      this.setState({ registerEmailError: "Required" });
      return false;
    } else if (!emailRegex.test(this.state.registerEmail)) {
      this.setState({
        registerEmailError: "Invalid email: pattern should match abcd@abcd.com",
      });
      return false;
    }

    if (!this.state.registerPassword) {
      this.setState({ registerPasswordError: "Required" });
      return false;
    } else if (this.state.registerPassword.length < 4) {
      this.setState({
        registerPasswordError: "Password must be 4 characters long.",
      });
      return false;
    } else if (!passwordRegex.test(this.state.registerPassword)) {
      this.setState({
        registerPasswordError:
          "Password must contain at least one lowercase letter, at least one lowercase letter, at least one special character, at least one number, and 8 to 16 charaters",
      });
      return false;
    }

    if (!this.state.registerRole) {
      this.setState({ registerRoleError: "Please select role" });
      return false;
    }

    return true;
  };

  handleSubmit = (event) => {
    this.resetRegisterError();
    event.preventDefault();
    //const isValid = this.validate();
    const isValid = true;
    if (isValid) {
      this.login();
      // clear form
      this.reset();
    }
  };
  handleRegisterSubmit = (event) => {
    event.preventDefault();
    // const isValid = this.validateRegister();
    const isValid = true;
    if (isValid) {
      this.registerUser();
      // clear form
      this.reset();
      this.toggleRegister();
    }
  };

  async login() {
    const userEmail = this.state.emailId;
    const password = this.state.password;
    const url = "/public/users/login/" + userEmail + "/" + password;
    console.log(url);
    axios
      .get(url)
      .then((response) => {
        console.log("response", response);
        const user = response.data.respBody;
        const token = {
          uuid: response.data.uuid,
          userId: response.data.user.id,
          username: response.data.user.account.username,
          active: response.data.user.account.active,
          role: response.data.user.authorities[0].authority,
          password: password,
        };
        alert(`Welcome ${token.username}`);
        localStorage.setItem("token", JSON.stringify(token));
        this.setState({ loggedIn: true });
        auth.login(() => {
          this.props.history.push("/app");
        });
      })
      .catch((error) => {
        alert(`Username or Password is wrong`);
        console.log(error);
      });
  }

  handleChange = (selectedOption) => {
    this.setState({ registerRole: selectedOption });
  };

  handleRegisterUsernameChange = (event) => {
    this.setState({
      registerUsername: event.target.value,
    });
  };

  handleRegisterPasswordChange = (event) => {
    this.setState({
      registerPassword: event.target.value,
    });
  };
  handleRegisterEmailChange = (event) => {
    this.setState({
      registerEmail: event.target.value,
    });
  };
  handleRegisterRoleChange = (event) => {
    this.setState({
      registerRole: event.target.value,
    });
  };

  async registerUser() {
    const url = "dalrada/user/userResource/users/create";
    const request = {
      userName: this.state.registerUsername,
      userEmail: this.state.registerEmail,
      userPassword: this.state.registerPassword,
      roleName: this.state.registerRole.value,
      status: 1,
      createdDate: new Date(),
      createdBy: "ADMIN",
    };
    console.log(request);
    axios
      .post(url, request)
      .then((response) => {
        alert(`new user created , please login now`);
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  handleForgetPassword = (event) => {
    event.preventDefault();
    const emailId = this.state.forgotEmailId;
    const url = "/forgetPassword/" + emailId;
    this.forgetPassword(url);
    this.reset();
  };

  async forgetPassword(url) {
    console.log(url);
    axios
      .get(url)
      .then((response) => {
        console.log("success");
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.log("error");
      });
  }

  async getRoles() {
    axios
      .get("/dalrada/user/roleResource/roles")
      .then((response) => {
        const roles = response.data
          .filter((item) => item.respBody.status === 1)
          .map((resp) => {
            return {
              value: resp.respBody.roleName,
              label: resp.respBody.roleName,
            };
          });

        this.setState({
          roleItems: roles,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <Router>
        <div className="bg sticky">
          <MDBRow className="mt-5 ">
            <MDBCol middle={true}>
              <MDBTypography
                tag="h1"
                className="text-center text-uppercase font-weight-bold cyan-text"
                variant="display-4"
              >
                Dalrada
              </MDBTypography>
            </MDBCol>
          </MDBRow>
          <div className="row">
            <div className="col-xl-6 col-sm-8 offset-xl-3 offset-sm-1 mt-5 pt-4">
              <MDBCard>
                <MDBCardHeader
                  titleClass="d-inline title"
                  color="brown lighten-5"
                  className="text-center darken-3 white-text"
                >
                  Sign In
                </MDBCardHeader>
                <MDBCardBody>
                  <form onSubmit={this.handleSubmit}>
                    <MDBInput
                      value={this.state.emailId}
                      onChange={this.handleEmailIdChange}
                      label="Email ID"
                      type="text"
                      iconClass="dark-grey"
                      className="text-center"
                    />{" "}
                    <div className="text-center red-text">
                      {this.state.emailIdError}
                    </div>
                    <MDBInput
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                      label="Password"
                      type="password"
                      iconClass="dark-grey"
                      className="text-center"
                    />
                    <div className="text-center red-text">
                      {this.state.passwordError}
                    </div>
                    <div className="text-center mt-1-half">
                      <MDBBtn
                        color="primary"
                        type="submit"
                        className="mb-2 rounded-pill"
                        size="sm"
                      >
                        Sign In
                        <MDBIcon icon="paper-plane" className="ml-1" />
                      </MDBBtn>
                      <MDBBtn
                        color="primary"
                        className="mb-2 rounded-pill"
                        onClick={this.toggleRegister}
                        size="sm"
                      >
                        SignUp
                      </MDBBtn>
                    </div>
                    <div className="row">
                      <div className="col-6 offset-4">
                        <MDBLink color="success" onClick={this.toggle}>
                          Forgot Password?
                        </MDBLink>
                      </div>
                    </div>
                  </form>
                </MDBCardBody>
              </MDBCard>
            </div>

            <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
              <MDBModalBody>
                <MDBCard>
                  <MDBCardHeader
                    titleClass="d-inline title"
                    color="cyan darken-3"
                    type="text"
                    className="text-center  darken-3 white-text"
                  >
                    Forgot Password
                  </MDBCardHeader>
                  <MDBCardBody>
                    <form onSubmit={this.handleForgetPassword.bind(this)}>
                      <MDBContainer>
                        <MDBInput
                          label="Email Id :"
                          value={this.state.forgotEmailId}
                          onChange={this.handleForgotEmailIdChange}
                          type="text"
                          iconClass="dark-grey"
                          className="text-center"
                        />
                      </MDBContainer>
                      <div className="text-center mt-1-half">
                        <MDBBtn
                          color="primary"
                          type="submit"
                          className="mb-2 mt-3 rounded-pill"
                          size="sm"
                        >
                          Send Mail
                          <MDBIcon icon="paper-plane" className="ml-1" />
                        </MDBBtn>
                        <MDBBtn
                          color="danger"
                          className="mb-2 mt-3 rounded-pill"
                          size="sm"
                          onClick={this.reset.bind(this)}
                        >
                          RESET
                        </MDBBtn>
                      </div>
                    </form>
                  </MDBCardBody>
                </MDBCard>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBLink color="secondary" onClick={this.toggle}>
                  <MDBIcon far icon="times-circle" size="lg" />
                </MDBLink>
              </MDBModalFooter>
            </MDBModal>

            <MDBModal
              isOpen={this.state.registerModal}
              toggle={this.toggleRegister}
            >
              <MDBModalBody>
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
                    <form onSubmit={this.handleRegisterSubmit}>
                      <MDBContainer>
                        <MDBRow>
                          <MDBCol md="6">
                            <MDBInput
                              label="Full Name:"
                              className="text-center"
                              type="text"
                              value={this.state.registerUsername}
                              onChange={this.handleRegisterUsernameChange}
                            />
                            <div className="text-center red-text">
                              {this.state.registerUsernameError}
                            </div>
                          </MDBCol>
                          <MDBCol md="6">
                            <MDBInput
                              label="Email:"
                              type="text"
                              value={this.state.registerEmail}
                              onChange={this.handleRegisterEmailChange}
                              className="text-center"
                              iconClass="dark-grey"
                            />
                            <div className="text-center red-text">
                              {this.state.registerEmailError}
                            </div>
                          </MDBCol>
                        </MDBRow>
                        <MDBRow>
                          <MDBCol md="6">
                            <Select
                              value={this.state.registerRole}
                              onChange={this.handleChange}
                              options={this.state.roleItems}
                            />
                          </MDBCol>
                          <MDBCol md="6">
                            <MDBInput
                              label="Password:"
                              type="text"
                              className="text-center"
                              value={this.state.registerPassword}
                              onChange={this.handleRegisterPasswordChange}
                              iconClass="dark-grey"
                            />
                            <div className="text-center red-text">
                              {this.state.registerPasswordError}
                            </div>
                          </MDBCol>
                        </MDBRow>
                      </MDBContainer>
                      <div className="text-center mt-1-half">
                        <MDBBtn
                          color="primary"
                          className="mb-2 mt-3 rounded-pill"
                          size="sm"
                          type="submit"
                        >
                          SUBMIT
                          <MDBIcon icon="paper-plane" className="ml-1" />
                        </MDBBtn>
                        <MDBBtn
                          color="danger"
                          className="mb-2 mt-3 rounded-pill"
                          size="sm"
                          onClick={this.reset.bind(this)}
                        >
                          RESET
                        </MDBBtn>
                      </div>
                    </form>
                  </MDBCardBody>
                </MDBCard>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBLink color="secondary" onClick={this.toggleRegister}>
                  <MDBIcon far icon="times-circle" size="lg" />
                </MDBLink>
              </MDBModalFooter>
            </MDBModal>
          </div>
        </div>
      </Router>
    );
  }
}

export default SignIn;
