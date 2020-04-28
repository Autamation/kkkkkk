import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import Loader from "react-loader-spinner";
import {
  MDBContainer,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
} from "mdbreact";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialState = {
  warehouseCode: "",
  warehouseFile: "",
  orderFile: "",
  startDate: "",
  endDate: "",
  warehouseCodeError: "",
  warehouseFileError: "",
  orderFileError: "",
  dateError: "",
  warehouseLoader: false,
  orderLoader: false,
};
class Upload extends Component {
  getPickerValue = (value) => {
    console.log(value);
  };

  state = initialState;

  componentDidMount() {
    this.getWarehouseCode();
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  handleCodeChange = (event) => {
    this.setState({
      warehouseCode: event.target.value,
    });
  };

  handleWarehouseFileChange = (event) => {
    this.setState({
      warehouseFile: event.target.files[0],
    });
  };
  validateWarehouse = () => {
    if (!this.state.warehouseCode) {
      this.setState({
        warehouseCodeError: "warehouse Code is mandatory",
      });
      return false;
    }
    if (!this.state.warehouseFile) {
      this.setState({
        warehouseFileError: "file is not selected",
      });
      return false;
    }

    return true;
  };
  resetWarehouse = (event) => {
    this.setState({
      warehouseCode: "",
      warehouseFile: "",
      warehouseCodeError: "",
      warehouseFileError: "",
    });
    document.getElementById("warehouseForm").reset();
  };

  handleWarehouseSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validateWarehouse();
    if (isValid) {
      // clear form
      this.uploadWarehouseFile();
      this.resetWarehouse();
      this.toggle();
    }
  };
  async uploadWarehouseFile() {
    this.setState({
      warehouseLoader: true,
    });
    let url = "dalrada/upload/warehouse";

    const formData = new FormData();
    formData.set("id", this.state.warehouseCode.value);
    formData.append("file", this.state.warehouseFile);

    let token = JSON.parse(localStorage.getItem("token"));
    if (token != null) {
      const headers = { Authorization: "Bearer " + token.uuid };
      console.log(this.state.warehouseFile);
      axios
        .post(url, formData, { headers })
        .then((response) => {
          this.setState({
            warehouseLoader: false,
          });
          alert(`${response.data.respMsg}`);
          console.log(response);
        })
        .catch((error) => {
          alert(`${error.data.respMsg}`);
          console.log(error);
        });
    }
  }

  handleChange = (selectedOption) => {
    this.setState({ warehouseCode: selectedOption });
  };

  async getWarehouseCode() {
    console.log("getWarehouseId called");
    const url = "dalrada/warehouse/warehouses";
    let token = JSON.parse(localStorage.getItem("token"));
    if (token != null) {
      const headers = { Authorization: "Bearer " + token.uuid };
      axios
        .get(url, { headers })
        .then((response) => {
          console.log(response);
          const warehouseCodes = response.data
            .filter((item) => item.respBody.status === 1)
            .map((resp) => {
              return {
                value: resp.respBody.warehouseCode,
                label: resp.respBody.warehouseCode,
              };
            });

          this.setState({
            warehouseIdItems: warehouseCodes,
          });
        })
        .catch((error) => console.log(error));
    }
  }

  handleStartDate = (date) => {
    this.setState({
      startDate: date,
    });
  };

  handleEndDate = (date) => {
    this.setState({
      endDate: date,
    });
  };

  handleOrderFileChange = (event) => {
    this.setState({
      orderFile: event.target.files[0],
    });
  };

  validateOrders = () => {
    const from = this.state.startDate;
    const to = this.state.endDate;

    if (!from) {
      this.setState({
        startDateError: "Enter the Start DATE",
      });
      return false;
    }
    if (!to) {
      this.setState({
        endDateError: "Enter the END DATE",
      });
      return false;
    }
    if (!this.state.orderFile) {
      this.setState({
        orderFileError: "file is not selected",
      });
      return false;
    }
    return true;
  };
  resetOrder = (event) => {
    this.setState({
      orderFile: "",
      startDate: "",
      endDate: "",
      orderFileError: "",
      dateError: "",
    });
    document.getElementById("orderForm").reset();
  };

  handleOrderSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validateOrders();
    if (isValid) {
      // clear form
      this.uploadOrderFile();
      this.resetOrder();
    }
  };

  async uploadOrderFile() {
    this.setState({
      orderLoader: true,
    });
    let url = "dalrada/upload/orders";
    const formData = new FormData();
    formData.set("startDate", this.state.startDate.toISOString().split("T")[0]);
    formData.set("endDate", this.state.endDate.toISOString().split("T")[0]);

    formData.append("file", this.state.orderFile);

    let token = JSON.parse(localStorage.getItem("token"));
    if (token != null) {
      formData.set("userId", token.userId);
      const headers = { Authorization: "Bearer " + token.uuid };

      console.log(this.state.startDate.toISOString().split("T"));
      console.log(this.state.startDate.toISOString().split(" "));
      axios
        .post(url, formData, { headers })
        .then((response) => {
          this.setState({
            orderLoader: false,
          });
          alert(`${response.data.respMsg}`);
          console.log(response);
        })
        .catch((error) => {
          alert(`${error.data.respMsg}`);
          console.log(error);
        });
    }
  }

  render() {
    const today = new Date();
    return (
      <MDBContainer>
        <div className="row">
          <div className="col-xl-6 col-sm-12">
            <MDBCard>
              <MDBCardHeader
                titleClass="d-inline title"
                color="brown lighten-5"
                className="text-center darken-3 white-text"
              >
                Warehouse
              </MDBCardHeader>
              <MDBCardBody>
                <form id="warehouseForm" onSubmit={this.handleWarehouseSubmit}>
                  <Select
                  placeholder="Warehouse Code"
                    className="mt-5"
                    value={this.state.warehouseCode}
                    onChange={this.handleChange}
                    options={this.state.warehouseIdItems}
                  />
                  <div className="text-center red-text">
                    {this.state.warehouseCodeError}
                  </div>
                  <div className="row">
                    <div className="input-group mt-3 col-6">
                      <div className="custom-file">
                        <input
                          type="file"
                          accept=".csv , .CSV"
                          id="warehouseFile"
                          onChange={this.handleWarehouseFileChange}
                        />
                      </div>
                      <div className="text-center red-text">
                        {this.state.warehouseFileError}
                      </div>
                    </div>
                    <div className="col-6">
                      <span className="float-right mr-4 mt-3">
                        <Loader
                          visible={this.state.warehouseLoader}
                          type="ThreeDots"
                          color="#ff4444"
                          height={30}
                          width={80}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="text-center mt-3 ">
                    <MDBBtn
                      color="primary"
                      className="mb-2 mt-3 rounded-pill"
                      type="submit"
                      size="sm"
                      onClick={this.toggle}
                    >
                      Upload
                    </MDBBtn>
                    <MDBBtn
                      color="danger"
                      size="sm"
                      className="mb-2 mt-3 rounded-pill"
                      onClick={this.resetWarehouse}
                    >
                      Reset
                    </MDBBtn>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </div>
          <div className="col-xl-6 col-sm-12 mt-xs-5">
            <MDBCard>
              <MDBCardHeader
                titleClass="d-inline title"
                color="brown lighten-5"
                className="text-center darken-3 white-text"
              >
                Order
              </MDBCardHeader>
              <MDBCardBody>
                <form id="orderForm" onSubmit={this.handleOrderSubmit}>
                  <div className="row mt-3">
                    <span className="col-4">From Date:<span style={{color:'#FF0000'}}>*</span></span>
                    <DatePicker
                      className="mr-4 col-8"
                      selected={this.state.startDate}
                      value={this.state.startDate}
                      maxDate={today}
                      type="date"
                      onChange={this.handleStartDate}
                    />
                  </div>
                  <div className="text-center red-text">
                    {this.state.startDateError}
                  </div>

                  <div className="row mt-3">
                    <span className="col-4">To Date:<span style={{color:'#FF0000'}}>*</span></span>
                    <DatePicker
                      className="mr-4 col-8"
                      selected={this.state.endDate}
                      value={this.state.endDate}
                      maxDate={today}
                      minDate={this.state.startDate}
                      type="date"
                      onChange={this.handleEndDate}
                    />
                  </div>
                  <div className="text-center red-text">
                    {this.state.endDateError}
                  </div>

                  <div className="row">
                    <div className="input-group mt-3 col-6">
                      <div className="custom-file">
                        <input
                          type="file"
                          accept=".csv , .CSV"
                          id="orderFile"
                          onChange={this.handleOrderFileChange}
                        />
                      </div>
                    </div>
                    <div className="text-center red-text">
                      {this.state.orderFileError}
                    </div>
                    <div className="col-6">
                      <span className="float-right mr-4 mt-3">
                        <Loader
                          visible={this.state.orderLoader}
                          type="ThreeDots"
                          color="#ff4444"
                          height={30}
                          width={80}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="text-center mt-2">
                    <MDBBtn
                      color="primary"
                      size="sm"
                      className="mb-2 mt-3 rounded-pill"
                      type="submit"
                    >
                      Upload
                    </MDBBtn>
                    <MDBBtn
                      color="danger"
                      size="sm"
                      className="mb-2 mt-3 rounded-pill"
                      onClick={this.resetOrder}
                    >
                      Reset
                    </MDBBtn>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </div>
        </div>
      </MDBContainer>
    );
  }
}

export default Upload;
