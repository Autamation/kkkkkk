import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBIcon,
  MDBLink,
  MDBBtn,
  MDBBtnGroup,
} from "mdbreact";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import Register from "./register";
import auth from "./auth";
import SignIn from "./signIn";
import User from "./user";
import Upload from "./upload";
import Reconcile from "./reconcile";
import Warehouse from "./warehouse";
import Role from "./role";
class Home extends Component {
  state = {
    loggedIn: true,
    isOpen: false,
    modal: false,
    collapseID: "",
    userName: "",
  };

  componentDidMount() {
    let token = JSON.parse(localStorage.getItem("token"));
    this.setState({
      userName: token.username,
    });
  }
  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  toggleLinks = (collapseID) => () => {
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : "",
    }));
  };

  async signOut() {
    let token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      const id = token.uuid;
      const url = "/logout/" + id;
      const headers = { Authorization: "Bearer " + token.uuid };
      this.setState({ loggedIn: false });
      axios
        .get(url, { headers })
        .then((response) => {
          console.log(response);
          alert(`${response.data}`);
          auth.logout(() => {
            this.props.history.push("/");
          });

          // this.setState({loggedIn:false});
        })
        .catch((error) => console.log(error));
    }
    localStorage.removeItem("token");
    //this.setState({loggedIn:false});
  }

  render() {
    return (
      <Router>
        <MDBNavbar color="stylish-color-dark" dark expand="md">
          <MDBNavbarBrand>
            <MDBIcon icon="dolly" className="mr-2" />
            <strong className="white-text">Dalrada</strong>
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
            <MDBNavbarNav right>
              <MDBNavItem>
                <MDBNavLink className="white-text m-2" to="/">
                  <MDBIcon icon="home" className="mr-2" />
                  Home
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBBtn className="white-text m-2">
                  <MDBIcon icon="smile" className="mr-2" />
                  Hi {this.state.userName}
                </MDBBtn>
              </MDBNavItem>
              <MDBNavItem>
                <MDBBtn
                  className="white-text m-2"
                  onClick={() => this.signOut()}
                >
                  <MDBIcon icon="sign-in-alt" className="mr-2" />
                  Sign Out
                </MDBBtn>
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
        <div className="row w-100  h-100 position-sticky pt-xs-5">
          <div className="col-xs-12 pt-xl-4 mt-xs-5 pt-xs-5 mb-5 pb-5 w-70 h-100 ">
            <MDBBtn
              color="orange darken-2"
              onClick={this.toggleLinks("basicCollapse")}
              style={{ marginBottom: "1rem" }}
            >
              Utilities
            </MDBBtn>
            <MDBCollapse id="basicCollapse" isOpen={this.state.collapseID}>
              <MDBLink to="/upload" className="black-text ">
                <MDBIcon icon="paper-plane" className="mr-2" />
                Upload
              </MDBLink>
              <MDBLink to="/reconcile" className="black-text">
                <MDBIcon icon="cloud-download-alt" className="mr-2" />
                Reconcile
              </MDBLink>
              <MDBLink to="/warehouse" className="black-text">
                <MDBIcon icon="building" className="mr-2" />
                Warehouse
              </MDBLink>
              <MDBLink to="/user" className="black-text">
                <MDBIcon icon="user-tie" className="mr-2" />
                User
              </MDBLink>
              <MDBLink to="/role" className="black-text">
                <MDBIcon icon="hands-helping" className="mr-2" />
                Role
              </MDBLink>
            </MDBCollapse>
          </div>
          <div className="mt-xl-3 mt-sm-1 pt-xl-3 pt-sm-1 col-xl-10 col-sm-12 mb-5 pb-5">
            <Switch>
              <Route exact path="/upload" component={Upload} />
              <Route exact path="/reconcile" component={Reconcile} />
              <Route exact path="/warehouse" component={Warehouse} />
              <Route exact path="/user" component={User} />
              <Route exact path="/role" component={Role} />
              {/* <Route exact path="/signin" component={SignIn} /> */}
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default Home;
