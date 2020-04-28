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
  MDBRow,
  MDBCol,
  MDBLink,
} from "mdbreact";

const columns = [
  {
    label: "Warehouse Id",
    field: "warehouseId",
    sort: "asc",
    width: 100,
  },
  {
    label: "Name",
    field: "warehouseName",
    sort: "asc",
    width: 150,
  },
  {
    label: "Address",
    field: "warehouseAddress",
    sort: "asc",
    width: 150,
  },
  {
    label: "Code",
    field: "warehouseCode",
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

class Warehouse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagingAndSearching: false,
      warehouseCode: "",
      warehouseId: "",
      warehouseName: "",
      warehouseAddress: "",
      warehouseCodeError: "",
      nameError: "",
      codeError: "",
      addressError: "",
      modal: false,
      data: { columns, rows },
    };
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  componentDidMount() {
    this.getWarehouses();
  }

  handleNameChange = (event) => {
    this.setState({
      warehouseName: event.target.value,
    });
  };
  handleAddressChange = (event) => {
    this.setState({
      warehouseAddress: event.target.value,
    });
  };
  handleWarehouseCodeChange = (event) => {
    this.setState({
      warehouseCode: event.target.value,
    });
  };
  handleEditNameChange = (event) => {
    this.setState({
      warehouseEditName: event.target.value,
    });
  };
  handleEditAddressChange = (event) => {
    this.setState({
      warehouseEditAddress: event.target.value,
    });
  };
  handleEditWarehouseCodeChange = (event) => {
    this.setState({
      warehouseEditCode: event.target.value,
    });
  };

  reset = (event) => {
    this.setState({
      warehouseCode: "",
      warehouseId: "",
      warehouseName: "",
      warehouseEditName: "",
      warehouseEditAddress: "",
      warehouseEditCode: "",
      warehouseEditId: "",
      editStatus: "",
      editCreatedDate: "",
      editCreatedBy: "",
      warehouseAddress: "",
      warehouseNameError: "",
      warehouseCodeError: "",
      warehouseEditAddressError: "",
      warehouseEditNameError: "",
      warehouseEditCodeError: "",
      warehouseEditAddressError: "",
    });
  };

  resetError = (event) => {
    this.setState({
      warehouseCodeError: "",
      warehouseNameError: "",
      warehouseAddressError: "",
      warehouseEditNameError: "",
      warehouseEditCodeError: "",
      warehouseEditAddressError: "",
    });
  };
  validate = () => {
    if (!this.state.warehouseName) {
      this.setState({
        warehouseNameError: "Warehouse Name is mandatory",
      });
      return false;
    }
    if (!this.state.warehouseCode) {
      this.setState({
        warehouseCodeError: "Warehouse Code is mandatory",
      });
      return false;
    }
    if (!this.state.warehouseAddress) {
      this.setState({
        warehouseCodeError: "Warehouse Address is mandatory",
      });
      return false;
    }
    return true;
  };
  validateEdit = () => {
    if (!this.state.warehouseEditName) {
      this.setState({
        warehouseEditNameError: "Warehouse Name is mandatory",
      });
      return false;
    }
    if (!this.state.warehouseEditCode) {
      this.setState({
        warehouseEditCodeError: "Warehouse Code is mandatory",
      });
      return false;
    }
    if (!this.state.warehouseEditAddress) {
      this.setState({
        warehouseEditCodeError: "Warehouse Address is mandatory",
      });
      return false;
    }
    return true;
  };

  handleWarehouseSubmit = (event) => {
    event.preventDefault();
    this.resetError();
    const isValid = this.validate();
    if (isValid) {
      event.preventDefault();
      this.createWarehouse();
      // clear form
      this.reset();
    }
  };

  handleWarehouseEditSubmit = (event) => {
    event.preventDefault();
    this.resetError();
    const isValid = this.validateEdit();
    if (isValid) {
      event.preventDefault();
      this.editWarehouse();
      // clear form
      this.reset();
      this.toggle();
    }
  };

  async createWarehouse() {
    const url = "dalrada/warehouse/warehouses/create";
    let token = JSON.parse(localStorage.getItem("token"));
    if (token != null) {
      const headers = { Authorization: "Bearer " + token.uuid };
      const request = {
        warehouseName: this.state.warehouseName,
        warehouseAddress: this.state.warehouseAddress,
        warehouseCode: this.state.warehouseCode,
        status: 1,
        createdDate: new Date(),
        createdBy: token.username,
      };

      console.log(request);
      axios
        .post(url, request, { headers })
        .then((response) => {
          console.log(response);
          const warehouse = response.data.respBody;
          warehouse.edit = (
            <MDBBtn
              color="danger"
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
            warehouse.status = (
              <MDBBtn
                color="warning"
                size="sm"
                className="text-center rounded-pill"
                onClick={() => {
                  this.editStaus(response.data.respBody);
                }}
              >
                Active
              </MDBBtn>
            );
          if (response.data.respBody.status === 0)
            warehouse.status = (
              <MDBBtn
                color="info"
                size="sm"
                className="text-center rounded-pill"
                onClick={() => {
                  this.editStaus(response.data.respBody);
                }}
              >
                Inactive
              </MDBBtn>
            );
          this.state.data.rows.push(warehouse);
          alert(`Warehouse record is created successfully.`);
          this.getWarehouses();
        })
        .catch((error) => {
          alert(`Something is wrong , Try it again.`);
          console.log(error);
        });
    }
  }
  async editWarehouse() {
    const url = "dalrada/warehouse/warehouses/edit";
    let token = JSON.parse(localStorage.getItem("token"));
    if (token != null) {
      const headers = { Authorization: "Bearer " + token.uuid };
      const request = {
        warehouseName: this.state.warehouseEditName,
        warehouseAddress: this.state.warehouseEditAddress,
        warehouseCode: this.state.warehouseEditCode,
        warehouseId: this.state.warehouseEditId,
        status: this.state.editStatus,
        createdDate: this.state.editCreatedDate,
        createdBy: token.username,
      };
      console.log(request);
      axios
        .post(url, request, { headers })
        .then((response) => {
          console.log(response);
          const warehouse = response.data.respBody;
          warehouse.edit = (
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
            warehouse.status = (
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
            warehouse.status = (
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
          this.state.data.rows.push(warehouse);
          alert(`Warehouse record is updated successfully.`);
          this.getWarehouses();
        })
        .catch((error) => {
          alert(`Something is wrong , Try it again.`);
          console.log(error);
        });
    }
  }

  async editStatus(warehouse) {
    console.log(warehouse);
    const warehouseId = warehouse.warehouseId;
    const status = warehouse.status.props.children === "Active" ? 0 : 1;
    const url = "dalrada/warehouse/warehouses/" + warehouseId + "/" + status;
    let token = JSON.parse(localStorage.getItem("token"));
    if (token != null) {
      const headers = { Authorization: "Bearer " + token.uuid };
      console.log(headers);
      axios
        .post(url, null, { headers })
        .then((response) => {
          const warehouse = response.data.respBody;
          warehouse.edit = (
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
            warehouse.status = (
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
            warehouse.status = (
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
          this.state.data.rows.push(warehouse);
          alert(`Warehouse status is updated successfully.`);
          this.getWarehouses();
        })
        .catch((error) => {
          alert(`Something is wrong , Try it again.`);
          console.log(error);
        });
    }
  }

  async getWarehouses() {
    const url = "dalrada/warehouse/warehouses";
    let token = JSON.parse(localStorage.getItem("token"));
    console.log();
    if (token != null) {
      const headers = { Authorization: "Bearer " + token.uuid };
      axios
        .get(url, { headers })
        .then((response) => {
          let rows = response.data.map((item) => {
            const warehouse = item.respBody;
            warehouse.edit = (
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
              warehouse.status = (
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
              warehouse.status = (
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
            return warehouse;
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
  }
  async editForm(warehouse) {
    this.setState({
      warehouseEditName: warehouse.warehouseName,
      warehouseEditAddress: warehouse.warehouseAddress,
      warehouseEditCode: warehouse.warehouseCode,
      warehouseEditId: warehouse.warehouseId,
      editStatus: warehouse.status.props.children === "Active" ? 1 : 0,
      editCreatedDate: warehouse.createdDate,
      editCreatedBy: warehouse.createdBy,
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
                Create Warehouse
              </MDBCardHeader>
              <MDBCardBody>
                <form onSubmit={this.handleWarehouseSubmit}>
                  <MDBContainer>
                    <MDBRow>
                      <MDBCol md="6">
                        <MDBInput
                          label="Warehouse Name:"
                          className="text-center"
                          type="text"
                          value={this.state.warehouseName}
                          onChange={this.handleNameChange}
                        />
                        <div className="text-center red-text">
                          {this.state.warehouseNameError}
                        </div>
                      </MDBCol>
                      <MDBCol md="6">
                        <MDBInput
                          label="Warehouse Code:"
                          value={this.state.warehouseCode}
                          onChange={this.handleWarehouseCodeChange}
                          className="text-center"
                        />
                        <div className="text-center red-text">
                          {this.state.warehouseCodeError}
                        </div>
                      </MDBCol>
                    </MDBRow>
                  </MDBContainer>

                  <MDBContainer>
                    <MDBRow>
                      <MDBCol md="12">
                        <MDBInput
                          label="Warehouse Address:"
                          type="text"
                          value={this.state.warehouseAddress}
                          onChange={this.handleAddressChange}
                          className="text-center "
                          iconClass="dark-grey"
                        />
                        <div className="text-center red-text">
                          {this.state.warehouseAddressError}
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
                Manage Warehouse
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
                  Create Warehouse
                </MDBCardHeader>
                <MDBCardBody>
                  <form onSubmit={this.handleWarehouseEditSubmit}>
                    <MDBContainer>
                      <MDBRow>
                        <MDBCol md="6">
                          <MDBInput
                            label="Warehouse Name:"
                            className="text-center"
                            type="text"
                            value={this.state.warehouseEditName}
                            onChange={this.handleEditNameChange}
                          />
                          <div className="text-center red-text">
                            {this.state.warehouseEditNameError}
                          </div>
                        </MDBCol>
                        <MDBCol md="6">
                          <MDBInput
                            label="Warehouse Code:"
                            value={this.state.warehouseEditCode}
                            onChange={this.handleEditWarehouseCodeChange}
                            className="text-center"
                          />
                          <div className="text-center red-text">
                            {this.state.warehouseEditCodeError}
                          </div>
                        </MDBCol>
                      </MDBRow>
                    </MDBContainer>

                    <MDBInput
                      label="Warehouse Address:"
                      type="text"
                      value={this.state.warehouseEditAddress}
                      onChange={this.handleEditAddressChange}
                      className="text-center"
                      iconClass="dark-grey"
                    />
                    <div className="text-center red-text">
                      {this.state.warehouseEditAddressError}
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

export default Warehouse;
