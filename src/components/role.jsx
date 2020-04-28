import React, { Component } from "react";
import axios from "axios";
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
  MDBModalFooter,
  MDBDataTable,
  MDBLink,
} from "mdbreact";

const columns = [
  {
    label: "Id",
    field: "roleId",
    sort: "asc",
    width: 100,
  },
  {
    label: "Role",
    field: "roleName",
    sort: "asc",
    width: 150,
  },
  {
    label: "Created Date",
    field: "createdDate",
    sort: "asc",
    width: 150,
  },
  {
    label: "Created By",
    field: "createdBy",
    sort: "asc",
    width: 150,
  },
  {
    label: "Status",
    field: "status",
    sort: "asc",
    width: 150,
  },
  {
    label: "Edit",
    field: "edit",
    sort: "asc",
    width: 100,
  },
];
const rows = [];

class Role extends Component {
  state = {
    data: {
      columns,
      rows,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      pagingAndSearching: false,
      roleName: "",
      roleError: "",
      roleId: "",
      editRoleId: "",
      editRoleName: "",
      editStatus: "",
      editCreatedDate: "",
      editCreatedBy: "",
      roleNameError: "",
      editRoleNameError: "",
      modal: false,
    };
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  componentDidMount() {
    this.getRoles();
  }

  handleRoleChange = (event) => {
    this.setState({
      roleName: event.target.value,
    });
  };

  handleEditRoleChange = (event) => {
    this.setState({
      editRoleName: event.target.value,
    });
  };

  reset = (event) => {
    this.setState({
      roleId: "",
      roleName: "",
      status: "",
      createdDate: "",
      createdBy: "",
      editRoleId: "",
      editRoleName: "",
      editStatus: "",
      editCreatedDate: "",
      editCreatedBy: "",
      roleNameError: "",
      editRoleNameError: "",
    });
  };
  resetError = (event) => {
    this.setState({
      roleNameError: "",
      editRoleNameError: "",
    });
  };

  validate = () => {
    if (!this.state.roleName) {
      this.setState({
        roleNameError: "Role is mandatory",
      });
      return false;
    }
    return true;
  };
  validateEdit = () => {
    if (!this.state.editRoleName) {
      this.setState({
        editRoleNameError: "Role is mandatory",
      });
      return false;
    }
    return true;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.resetError();
    const isValid = this.validate();
    console.log(isValid);
    if (isValid) {
      this.createRole();
      // clear form
      this.reset();
    }
  };
  handleEditSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validateEdit();
    if (isValid) {
      this.editRole();
      // clear form
      this.reset();
      this.toggle();
    }
  };

  async createRole() {
    const url = "dalrada/user/roleResource/roles/create";
    let token = JSON.parse(localStorage.getItem("token"));
    const request = {
      roleName: this.state.roleName,
      status: 1,
      createdDate: new Date(),
      createdBy: token.username,
    };
    console.log(request.createdBy);
    console.log(request);
    axios
      .post(url, request)
      .then((response) => {
        console.log(response);
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
        alert(`Role record is created successfully.`);
        this.getRoles();
      })
      .catch((error) => {
        alert(`Something is wrong , Try it again.`);
        console.log(error);
      });
  }

  async editStatus(role) {
    const roleId = role.roleId;
    const status = role.status.props.children === "Active" ? 0 : 1;
    const url = "dalrada/user/roleResource/roles/" + roleId + "/" + status;
    console.log(roleId);
    axios
      .post(url)
      .then((response) => {
        console.log(response);
        const role = response.data.respBody;
        role.edit = (
          <MDBBtn
            color="primary"
            size="sm"
            className="text-center"
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
        alert(`Status updated successfully.`);
        this.getRoles();
      })
      .catch((error) => {
        alert(`Something is wrong , Try it again.`);
        console.log(error);
      });
  }

  async editRole() {
    const url = "dalrada/user/roleResource/roles/edit";

    const request = {
      roleId: this.state.editRoleId,
      roleName: this.state.editRoleName,
      status: this.state.editStatus,
      createdDate: this.state.editCreatedDate,
      createdBy: this.state.editCreatedBy,
    };
    console.log(request);
    axios
      .post(url, request)
      .then((response) => {
        console.log(response);
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
                this.editSatus(response.data.respBody);
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
                this.editSatus(response.data.respBody);
              }}
            >
              Inactive
            </MDBBtn>
          );
        this.state.data.rows.push(role);
        alert(`Role is updated successfully.`);
        this.getRoles();
      })
      .catch((error) => {
        alert(`Something is wrong , Try it again.`);
        console.log(error);
      });
  }

  async getRoles() {
    axios
      .get("/dalrada/user/roleResource/roles")
      .then((response) => {
        let rows = response.data.map((item) => {
          const role = item.respBody;
          role.edit = (
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
            role.status = (
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
            role.status = (
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
          return role;
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

  async editForm(role) {
    console.log(role);
    this.setState({
      editRoleName: role.roleName,
      editRoleId: role.roleId,
      editStatus: role.status.props.children === "Active" ? 1 : 0,
      editCreatedDate: role.createdDate,
      editCreatedBy: role.createdBy,
    });
    this.toggle();
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
                Create Role
              </MDBCardHeader>
              <MDBCardBody>
                <form onSubmit={this.handleSubmit}>
                  <MDBInput
                    label="Role Name:"
                    className="text-center"
                    type="text"
                    value={this.state.roleName}
                    onChange={this.handleRoleChange}
                  />
                  <div className="text-center red-text">
                    {this.state.roleNameError}
                  </div>
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
                Manage Role
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
                  color="cyan darken-3"
                  type="text"
                  className="text-center  darken-3 white-text"
                >
                  Edit Role
                </MDBCardHeader>
                <MDBCardBody>
                  <form onSubmit={this.handleEditSubmit}>
                    <MDBInput
                      label="Role Name:"
                      className="text-center"
                      type="text"
                      value={this.state.editRoleName}
                      onChange={this.handleEditRoleChange}
                    />
                    <div className="text-center red-text">
                      {this.state.editRoleNameError}
                    </div>

                    <div className="text-center mt-1-half">
                      <MDBBtn
                        color="primary"
                        className="mb-2 mt-3 rounded-pill"
                        type="submit"
                        size="sm"
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

export default Role;
