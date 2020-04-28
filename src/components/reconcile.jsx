import React, { Component } from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBDataTable,
  MDBRow,
  MDBCol,
} from "mdbreact";
import DatePicker from "react-datepicker";
import Loader from "react-loader-spinner";
import "react-datepicker/dist/react-datepicker.css";

const columns = [
  {
    label: "Order Date",
    field: "orderDate",
    sort: "asc",
    width: 250,
  },
  {
    label: "Product Name",
    field: "productName",
    sort: "asc",
    width: 400,
  },
  {
    label: "Quantity",
    field: "quantity",
    sort: "asc",
    width: 250,
  },
  {
    label: "Order Status",
    field: "orderStatus",
    sort: "asc",
    width: 250,
  },

  {
    label: "Store OrderId",
    field: "storeOrderId",
    sort: "asc",
    width: 250,
  },
  {
    label: "Order Number",
    field: "orderNumber",
    sort: "asc",
    width: 250,
  },
  {
    label: "Po Number",
    field: "poNumber",
    sort: "asc",
    width: 250,
  },
  {
    label: "Reference Number",
    field: "referenceNumber",
    sort: "asc",
    width: 250,
  },
  {
    label: "Channel Name",
    field: "channelName",
    sort: "asc",
    width: 250,
  },

  {
    label: "SKU",
    field: "sku",
    sort: "asc",
    width: 250,
  },

  {
    label: "Supplier Cost Per SKU",
    field: "supplierCostPerSKU",
    sort: "asc",
    width: 250,
  },
  {
    label: "Ext NetUnit",
    field: "extNetUnit",
    sort: "asc",
    width: 250,
  },
  {
    label: "Sale Price",
    field: "salePrice",
    sort: "asc",
    width: 250,
  },
  {
    label: "Amazon Amount",
    field: "amazonAmount",
    sort: "asc",
    width: 250,
  },
  {
    label: "Profit",
    field: "profit",
    sort: "asc",
    width: 250,
  },
  {
    label: "Average Profit",
    field: "avgProfit",
    sort: "asc",
    width: 250,
  },
  {
    label: "ROI",
    field: "roi",
    sort: "asc",
    width: 250,
  },
  {
    label: "Supplier Cost Total",
    field: "supplierCostTotal",
    sort: "asc",
    width: 250,
  },
  {
    label: "Order Total",
    field: "orderTotal",
    sort: "asc",
    width: 250,
  },
  {
    label: "Supplier Name",
    field: "supplierName",
    sort: "asc",
    width: 250,
  },
  {
    label: "Store Shipping Method",
    field: "storeShippingMethod",
    sort: "asc",
    width: 250,
  },
  {
    label: "Shipping Carrier",
    field: "shippingCarrier",
    sort: "asc",
    width: 250,
  },
  {
    label: "Shipping Method",
    field: "shippingMethod",
    sort: "asc",
    width: 250,
  },
  {
    label: "Tracking Numbers",
    field: "trackingNumbers",
    sort: "asc",
    width: 250,
  },
  {
    label: "Customer Name",
    field: "customerName",
    sort: "asc",
    width: 250,
  },
  {
    label: "Customer Email",
    field: "customerEmail",
    sort: "asc",
    width: 250,
  },
  {
    label: "Customer Phone",
    field: "customerPhone",
    sort: "asc",
    width: 250,
  },
  {
    label: "Address Line 1",
    field: "addressLine1",
    sort: "asc",
    width: 250,
  },
  {
    label: "Address Line 2",
    field: "addressLine2",
    sort: "asc",
    width: 250,
  },
  {
    label: "City",
    field: "city",
    sort: "asc",
    width: 250,
  },
  {
    label: "State",
    field: "state",
    sort: "asc",
    width: 250,
  },
  {
    label: "Zip",
    field: "zip",
    sort: "asc",
    width: 250,
  },
  {
    label: "Country",
    field: "company",
    sort: "asc",
    width: 250,
  },
  {
    label: "Start Date",
    field: "fromDate",
    sort: "asc",
    width: 250,
  },
  {
    label: "End Date",
    field: "toDate",
    sort: "asc",
    width: 250,
  },
  {
    label: "Creation Date",
    field: "creationDate",
    sort: "asc",
    width: 250,
  },
  {
    label: "User Id",
    field: "userId",
    sort: "asc",
    width: 250,
  },
];
const rows = [];

class Reconcile extends Component {
  state = {
    startDate: "",
    endDate: "",
    dateError: "",
    modal: false,
    reconcileLoader: false,
    userData: { columns, rows },
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };
  handleStartDateChange = (date) => {
    this.setState({
      startDate: date,
    });
  };
  handleEndDateChange = (date) => {
    this.setState({
      endDate: date,
    });
  };

  validateOrders = () => {
    const from = this.state.startDate;
    const to = this.state.endDate;

    if (!from) {
      this.setState({
        dateError: "Enter the Start DATE",
      });
      return false;
    }
    if (!to) {
      this.setState({
        dateError: "Enter the END DATE",
      });
      return false;
    }
    return true;
  };

  resetDates = (event) => {
    this.setState({
      orderFile: "",
      startDate: "",
      endDate: "",
      dateError: "",
    });
  };

  handleOrderSubmit = (event) => {
    event.preventDefault();
    const isValid = this.validateOrders();
    const from = this.state.startDate;
    const to = this.state.endDate;
    if (isValid) {
      const startDate = from.toISOString().split("T")[0];
      const endDate = to.toISOString().split("T")[0];
      const url = "/dalrada/reconcile/orders/" + startDate + "/" + endDate;
      this.getData(url);
      this.resetDates();
      this.toggle();
    }
  };

  async getData(url) {
    this.setState({
      reconcileLoader: true,
    });
    let token = JSON.parse(localStorage.getItem("token"));
    const headers = { Authorization: "Bearer " + token.uuid };
    console.log(`${headers.Authorization}`);
    axios
      .get(url, { headers })
      .then((response) => {
        let rows = response.data.map((order) => order.respBody);
        this.setState({
          userData: {
            columns,
            rows,
          },
        });
        this.setState({
          reconcileLoader: false,
        });
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  downloadFile() {
    const url = "/dalrada/reconcile/orders/download";
    const data = this.state.userData.rows;
    if (data) {
      let token = JSON.parse(localStorage.getItem("token"));
      const headers = { Authorization: "Bearer " + token.uuid };
      console.log(`${headers.Authorization}`);
      axios
        .get(url, { headers })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    }
    alert(`No Data Available`);
  }

  render() {
    const today = new Date();
    return (
      <MDBContainer>
        <div className="row">
          <div className="col-xl-12 col-sm-12">
            <MDBCard>
              <MDBCardHeader
                titleClass="d-inline title"
                color="brown lighten-5"
                className="text-center darken-3 white-text"
              >
                Order Details
              </MDBCardHeader>
              <MDBCardBody>
                <form onSubmit={this.handleOrderSubmit}>
                  <MDBRow>
                    <MDBCol md="6">
                      <div className="row mt-3">
                        <span className="col-4">From Date:<span style={{color:'#FF0000'}}>*</span></span>
                        <DatePicker
                          className="mr-5 col-8"
                          selected={this.state.startDate}
                          value={this.state.startDate}
                          type="date"
                          maxDate={today}
                          dateFormat="MM-dd-yyyy"
                          onChange={this.handleStartDateChange}
                        />
                      </div>
                    </MDBCol>
                    <MDBCol md="6">
                      <div className="row mt-3">
                        <span className="col-3">To Date:<span style={{color:'#FF0000'}}>*</span></span>
                        <DatePicker
                          className="mr-5 col-8"
                          selected={this.state.endDate}
                          value={this.state.endDate}
                          type="date"
                          maxDate={today}
                          minDate={this.state.startDate}
                          dateFormat="MM-dd-yyyy"
                          onChange={this.handleEndDateChange}
                        />
                      </div>
                    </MDBCol>
                  </MDBRow>

                  <div className="text-center red-text">
                    {this.state.dateError}
                  </div>
                  <div className="text-center mt-1-half">
                    <MDBBtn
                      color="primary"
                      className="mb-2 mt-3 rounded-pill"
                      size="sm"
                      type="submit"
                    >
                      Order Details
                      <MDBIcon icon="paper-plane" className="ml-1" />
                    </MDBBtn>
                    <MDBBtn
                      color="danger"
                      className="mb-2 mt-3 rounded-pill"
                      size="sm"
                      onClick={this.resetDates}
                    >
                      Reset
                    </MDBBtn>
                  </div>
                </form>
                <div className="text-center">
                  <span className="mt-5">
                    <Loader
                      visible={this.state.reconcileLoader}
                      type="ThreeDots"
                      color="#ff4444"
                      height={30}
                      width={80}
                    />
                  </span>
                </div>
              </MDBCardBody>
            </MDBCard>
          </div>
        </div>
        <div className="mt-5">
          <MDBCard>
            <MDBCardHeader
              titleClass="d-inline title"
              color="brown lighten-5"
              className="text-center darken-3 white-text"
            >
              Reconcile Report
            </MDBCardHeader>
            <MDBCardBody className="p-4 w-5">
              <div>
                <MDBBtn
                  color="danger"
                  className="mb-2 mt-3 large"
                  size="sm"
                  outline
                  type="submit"
                  onClick={this.downloadFile.bind(this)}
                >
                  Download
                  <MDBIcon icon="paper-plane" className="ml-1" />
                </MDBBtn>
              </div>
              <MDBDataTable
                striped
                bordered
                responsive
                fixed={true}
                maxHeight="400px"
                searchLabel=""
                small
                entriesLabel=""
                paging={true}
                searching={true}
                order={["srNo", "asc"]}
                data={this.state.userData}
                className="table"
                noBottomColumns={true}
                autoWidth={true}
                scrollX
              />
            </MDBCardBody>
          </MDBCard>
        </div>
      </MDBContainer>
    );
  }
}

export default Reconcile;
