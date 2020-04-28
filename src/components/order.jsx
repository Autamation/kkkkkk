import React, { Component, Fragment } from "react";
import axios from "axios";
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8083/orders")
      .then(response => {
        this.setState({
          orders: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    const { orders } = this.state;
    return (
      <Fragment>
        <div className="text-center">
          Order List
          {orders.length
            ? orders.map(order => (
                <div key={order.respBody.srNo}>
                  {order.respBody.productName}
                </div>
              ))
            : null}
        </div>
      </Fragment>
    );
  }
}

export default Order;
