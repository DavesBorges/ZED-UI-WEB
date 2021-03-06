import React from "react";
import { Offline, Online } from "react-detect-offline";
import onClickOutside from 'react-onclickoutside';
import NetworkManager from './NetworkManager/NetworkManager';
import "./networkStatus.css";
import C0 from "./CONNECTED_0.png";
import C1 from "./CONNECTED_1.png";

class NetworkStatus extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      NetworkManagerVisible: false
    }

    this.toggleNetworkManager = this.toggleNetworkManager.bind(this);
  }

  iHaveInternet(){
    localStorage.hasInternet=true;
  }

  iDontHaveInternet(){
    localStorage.hasInternet=false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps !== this.props || nextState !== this.state ){
        return true;
    }
  } 

  handleClickOutside(){
    this.setState({ NetworkManagerVisible: false});
  }

  toggleNetworkManager(){
    this.setState({ NetworkManagerVisible: !this.state.NetworkManagerVisible});
  }

  render() {
    return (
      <div className="NetworkStatus">
        <Online>
          <img onClick={this.toggleNetworkManager} onLoad={this.iHaveInternet} draggable="false" alt="" src={C1}/>
        </Online>
        <Offline>
          <img onClick={this.toggleNetworkManager} onLoad={this.iDontHaveInternet} draggable="false" alt="" src={C0}/>
        </Offline>
        <NetworkManager visible={this.state.NetworkManagerVisible} />
      </div>
    );
  }
}

export default onClickOutside(NetworkStatus);
