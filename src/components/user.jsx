import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBDataTable,
  MDBRow,
  MDBCol,
  MDBLink,
} from "mdbreact";

const columns = [
  {
    label: "Id",
    field: "userId",
    sort: "asc",
    width: 40,
  },
  {
    label: "Name",
    field: "userName",
    sort: "asc",
    width: 70,
  },
  {
    label: "Email",
    field: "userEmail",
    sort: "asc",
    width: 220,
  },
  {
    label: "Password",
    field: "userPassword",
    sort: "asc",
    width: 120,
  },
  {
    label: "Role",
    field: "roleName",
    sort: "asc",
    width: 100,
  },

  {
    label: "Created Date",
    field: "createdDate",
    sort: "asc",
    width: 70,
  },
  {
    label: "CreatedBy",
    field: "createdBy",
    sort: "asc",
    width: 100,
  },

  {
    label: "Status",
    field: "status",
    sort: "asc",
    width: 100,
  },
  {
    label: "Edit",
    field: "edit",
    sort: "asc",
    width: 100,
  },
];
const rows = [];

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagingAndSearching: false,
      username: "",
      userId: "",
      email: "",
      password: "",
      role: "",
      editUsername: "",
      editEmail: "",
      editPassword: "",
      editRole: "",
      editUserId: "",
      editStatus: "",
      editCreatedDate: "",
      editCreatedBy: "",
      editRole: "",
      modal: false,
      roleItems: [],
      usernameError: "",
      passwordError: "",
      emailError: "",
      roleError: "",
      data: { columns, rows },
    };
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  componentDidMount() {
    this.getRoles();
    this.getUsers();
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
  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  };
  handleRoleChange = (event) => {
    this.setState({
      role: event.target.value,
    });
  };

  handleEditUsernameChange = (event) => {
    this.setState({
      editUsername: event.target.value,
    });
  };

  handleEditPasswordChange = (event) => {
    this.setState({
      editPassword: event.target.value,
    });
  };
  handleEditEmailChange = (event) => {
    this.setState({
      editEmail: event.target.value,
    });
  };
  handleEditRoleChange = (event) => {
    this.setState({
      editRole: event.target.value,
    });
  };

  reset = (event) => {
    this.setState({
      username: "",
      userId: "",
      email: "",
      password: "",
      role: "",
      editUsername: "",
      editEmail: "",
      editPassword: "",
      editRole: "",
      editUserId: "",
      editStatus: "",
      editCreatedDate: "",
      editCreatedBy: "",
      editRole: "",
      usernameError: "",
      passwordError: "",
      emailError: "",
      roleError: "",
      editUsernameError: "",
      editPasswordError: "",
      editEmailError: "",
      editRoleError: "",
    });
  };

  resetError(event) {
    this.setState({
      usernameError: "",
      passwordError: "",
      emailError: "",
      roleError: "",
      editUsernameError: "",
      editPasswordError: "",
      editEmailError: "",
      editRoleError: "",
    });
  }

  validate = () => {
    this.resetError();
    if (!this.state.username) {
      this.setState({
        usernameError: "username is mandatory",
      });
      return false;
    }
    if (!this.state.email.includes("@")) {
      this.setState({ emailError: "invalid email" });
      return false;
    }

    if (!this.state.password) {
      this.setState({ passwordError: "weak password" });
      return false;
    }

    if (!this.state.role) {
      this.setState({ roleError: "weak password" });
      return false;
    }

    return true;
  };

  validateEdit = () => {
    this.resetError();
    if (!this.state.editUsername) {
      this.setState({
        editUsernameError: "username is mandatory",
      });
      return false;
    }
    if (!this.state.editEmail.includes("@")) {
      this.setState({ editEmailError: "invalid email" });
      return false;
    }

    if (!this.state.editPassword) {
      this.setState({ editPasswordError: "weak password" });
      return false;
    }

    if (!this.state.editRole) {
      this.setState({ editRoleError: "weak password" });
      return false;
    }

    return true;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      event.preventDefault();
      this.createUser();
      // clear form
      this.reset();
    }
  };

  handleEditSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validateEdit();
    if (isValid) {
      event.preventDefault();
      this.editUser();
      // clear form
      this.setState({
        username: "",
        email: "",
        password: "",
        role: "",
        usernameError: "",
        passwordError: "",
        roleError: "",
      });
      this.toggle();
    }
  };

  async editUser() {
    const url = "dalrada/user/userResource/users/edit";
    const request = {
      userId: this.state.editUserId,
      userName: this.state.editUsername,
      userEmail: this.state.editEmail,
      userPassword: this.state.editPassword,
      status: this.state.editStatus,
      createdDate: this.state.editCreatedDate,
      createdBy: this.state.editCreatedBy,
      roleName: this.state.editRole,
    };
    console.log(request);
    axios
      .post(url, request)
      .then((response) => {
        const user = response.data.respBody;
        user.edit = (
          <MDBBtn
            color="primary"
            size="sm"
            className="text-center rounded-pill"
            onClick={() => {
              this.editForm(response.data.respBody);
            }}
          >
            Edit
          </MDBBtn>
        );
        if (response.data.respBody.status === 1)
          user.status = (
            <MDBBtn
              color="success"
              size="sm"
              clssName="text-center rounded-pill"
            >
              Active
            </MDBBtn>
          );
        if (response.data.respBody.status === 0)
          user.status = (
            <MDBBtn
              color="danger"
              size="sm"
              clssName="text-center rounded-pill"
            >
              Inactive
            </MDBBtn>
          );
        this.state.data.rows.push(user);
        this.getUsers();
      })
      .catch((error) => console.log(error));
  }

  async createUser() {
    const url = "dalrada/user/userResource/users/create";
    let token = JSON.parse(localStorage.getItem("token"));
    const request = {
      userName: this.state.username,
      userEmail: this.state.email,
      userPassword: this.state.password,
      status: 1,
      createdDate: new Date(),
      createdBy: token.username,
      roleName: this.state.role.value,
    };
    console.log(request);
    axios
      .post(url, request)
      .then((response) => {
        const role = response.data.respBody;
        role.edit = (
          <MDBBtn
            color="primary"
            size="sm"
            className="text-center rounded-pill"
            onClick={() => {
              this.editForm(response.data.respBody);
            }}
          >
            Edit
          </MDBBtn>
        );
        if (response.data.respBody.status === 1)
          role.status = (
            <MDBBtn
              color="success"
              size="sm"
              className="text-center rounded-pill"
              onClick={() => {
                this.editStatus(response.data.respBody);
              }}
            >
              Active
            </MDBBtn>
          );
        if (response.data.respBody.status === 0)
          role.status = (
            <MDBBtn
              color="danger"
              size="sm"
              className="text-center rounded-pill"
              onClick={() => {
                this.editStatus(response.data.respBody);
              }}
            >
              Inactive
            </MDBBtn>
          );
        this.state.data.rows.push(role);
        alert(`User record is created successfully.`);
        this.getUsers();
      })
      .catch((error) => {
        alert(`Something is wrong , Try it again.`);
        console.log(error);
      });
  }

  async editStatus(user) {
    console.log(user);
    const userId = user.userId;
    const status = user.status.props.children === "Active" ? 0 : 1;

    const url = "dalrada/user/userResource/users/" + userId + "/" + status;
    axios
      .post(url)
      .then((response) => {
        const role = response.data.respBody;
        role.edit = (
          <MDBBtn
            color="primary"
            size="sm"
            className="text-center rounded-pill"
            onClick={() => {
              this.editForm(response.data.respBody);
            }}
          >
            Edit
          </MDBBtn>
        );
        if (response.data.respBody.status === 1)
          role.status = (
            <MDBBtn
              color="success"
              size="sm"
              className="text-center rounded-pill"
              onClick={() => {
                this.editStatus(response.data.respBody);
              }}
            >
              Active
            </MDBBtn>
          );
        if (response.data.respBody.status === 0)
          role.status = (
            <MDBBtn
              color="danger"
              size="sm"
              className="text-center rounded-pill"
              onClick={() => {
                this.editStatus(response.data.respBody);
              }}
            >
              Inactive
            </MDBBtn>
          );
        this.state.data.rows.push(role);
        alert(`Status is updated successfully.`);
        this.getUsers();
      })
      .catch((error) => {
        alert(`Something is wrong , Try it again.`);
        console.log(error);
      });
  }

  handleChange = (selectedOption) => {
    this.setState({ role: selectedOption });
  };

  async getUsers() {
    const url = "dalrada/user/userResource/users";
    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        let rows = response.data.map((item) => {
          const user = item.respBody;
          user.edit = (
            <MDBBtn
              color="primary"
              size="sm"
              className="text-center rounded-pill"
              onClick={() => {
                this.editForm(item.respBody);
              }}
            >
              Edit
            </MDBBtn>
          );
          if (item.respBody.status === 1)
            user.status = (
              <MDBBtn
                color="success"
                size="sm"
                className="text-center rounded-pill"
                onClick={() => {
                  this.editStatus(item.respBody);
                }}
              >
                Active
              </MDBBtn>
            );
          if (item.respBody.status === 0)
            user.status = (
              <MDBBtn
                color="danger"
                size="sm"
                className="text-center rounded-pill"
                onClick={() => {
                  this.editStatus(item.respBody);
                }}
              >
                Inactive
              </MDBBtn>
            );
          return user;
        });
        if (rows.lenth > 10) {
          this.setState({
            pagingAndSearching: true,
          });
        }
        this.setState({
          data: { columns, rows },
        });
      })
      .catch((error) => console.log(error));
  }

  async editForm(user) {
    this.setState({
      editUsername: user.userName,
      editEmail: user.userEmail,
      editPassword: user.userPassword,
      editRole: user.roleName,
      editUserId: user.userId,
      editStatus: user.status.props.children === "Active" ? 1 : 0,
      editCreatedDate: user.createdDate,
      editCreatedBy: user.createdBy,
      editRole: user.roleName,
    });
    this.toggle();
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
      <MDBContainer>
        <div>
          <div>
            <MDBCard>
              <MDBCardHeader
                titleClass="d-inline title"
                color="brown lighten-5"
                type="text"
                className="text-center  darken-3 white-text"
              >
                Create User
              </MDBCardHeader>
              <MDBCardBody>
                <form onSubmit={this.handleSubmit}>
                  <MDBContainer>
                    <MDBRow>
                      <MDBCol md="6">
                        <MDBInput
                          label="Full Name:"
                          className="text-center"
                          type="text"
                          value={this.state.username}
                          onChange={this.handleUsernameChange}
                        />
                        <div className="text-center red-text">
                          {this.state.usernameError}
                        </div>
                      </MDBCol>
                      <MDBCol md="6">
                        <MDBInput
                          label="Email:"
                          type="text"
                          value={this.state.email}
                          onChange={this.handleEmailChange}
                          className="text-center"
                          iconClass="dark-grey"
                        />
                        <div className="text-center red-text">
                          {this.state.emailError}
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol md="6">
                        <Select
                          placeholder="Select Role"
                          value={this.state.role}
                          onChange={this.handleChange}
                          options={this.state.roleItems}
                        />
                      </MDBCol>
                      <MDBCol md="6">
                        <MDBInput
                          label="Password:"
                          type="password"
                          className="text-center"
                          value={this.state.password}
                          onChange={this.handlePasswordChange}
                          iconClass="dark-grey"
                        />
                        <div className="text-center red-text">
                          {this.state.passwordError}
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
                      Create
                      <MDBIcon icon="paper-plane" className="ml-1" />
                    </MDBBtn>
                    <MDBBtn
                      color="danger"
                      className="mb-2 mt-3 rounded-pill"
                      size="sm"
                      onClick={this.reset}
                    >
                      Reset
                    </MDBBtn>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </div>
          <div className="mt-5">
            <MDBCard>
              <MDBCardHeader
                titleClass="d-inline title"
                color="brown lighten-5"
                className="text-center darken-3 white-text"
              >
                Manage User
              </MDBCardHeader>
              <MDBCardBody>
                <MDBDataTable
                  striped
                  bordered
                  responsive
                  fixed={true}
                  maxHeight="700px"
                  searchLabel=""
                  small
                  entriesLabel=""
                  noBottomColumns={true}
                  scrollY={true}
                  btn={true}
                  autoWidth={true}
                  paging={this.state.pagingAndSearching}
                  searching={this.state.pagingAndSearching}
                  data={this.state.data}
                />
              </MDBCardBody>
            </MDBCard>
          </div>
          <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
            <MDBModalBody>
              <MDBCard>
                <MDBCardHeader
                  titleClass="d-inline title"
                  color="brown lighten-5"
                  type="text"
                  className="text-center  darken-3 white-text"
                >
                  Edit User
                </MDBCardHeader>
                <MDBCardBody>
                  <form onSubmit={this.handleEditSubmit}>
                    <MDBContainer>
                      <MDBRow>
                        <MDBCol md="6">
                          <MDBInput
                            label="Full Name:"
                            className="text-center"
                            type="text"
                            value={this.state.editUsername}
                            onChange={this.handleEditUsernameChange}
                          />
                          <div className="text-center red-text">
                            {this.state.editUsernameError}
                          </div>
                        </MDBCol>
                        <MDBCol md="6">
                          <MDBInput
                            label="Email:"
                            type="text"
                            value={this.state.editEmail}
                            onChange={this.handleEditEmailChange}
                            className="text-center"
                            iconClass="dark-grey"
                          />
                          <div className="text-center red-text">
                            {this.state.editEmailError}
                          </div>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol md="6">
                          <Select
                            value={this.state.role}
                            onChange={this.handleChange}
                            options={this.state.roleItems}
                          />
                        </MDBCol>
                        <MDBCol md="6">
                          <MDBInput
                            label="Password:"
                            type="text"
                            className="text-center"
                            value={this.state.editPassword}
                            onChange={this.handleEditPasswordChange}
                            iconClass="dark-grey"
                          />
                          <div className="text-center red-text">
                            {this.state.editPasswordError}
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
                        onClick={this.reset}
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
        </div>
      </MDBContainer>
    );
  }
}

export default User;
