import React from 'react';
import invert from 'invert-color';
import isElectron from 'is-electron';
import onClickOutside from 'react-onclickoutside';
import { Rnd } from "react-rnd";
import CCLOSE from './CLOSE.png';
import CMAXIMIZE from './MAXIMIZE.png';
import CRESTORE from './RESTORE.png';
import CMINIMIZE from './MINIMIZE.png';
import FileManager from '../FileManager/fileManager';
import { REST_URL } from '../../REST_URL';
import './window.css';

class Window extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            url: this.props.url,
            modalIsOpen: true,
            draggable: false,
            uuid: this.props.uuid,
            currentZIndex: window.maxZIndex,
            maximized: false,
            x: 15,
            y: 15,
            width: 640,
            height: 480,
            active: true,
            systemColor: window.systemColor
        };

        this.openModal = this.openModal.bind(this);
        this.onClose = this.onClose.bind(this);
        this.sendToFront = this.sendToFront.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onToggleWindow = this.onToggleWindow.bind(this);
        this.onToggleMinimize = this.onToggleMinimize.bind(this);
        this.onErrorFRAME = this.onErrorFRAME.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleClickInsideWindow = this.handleClickInsideWindow.bind(this);
        window.maxZIndex=window.maxZIndex+1;
        setInterval(() => {
            if(window.toFront){
                if(window.toFront == this.props.uuid){
                    let newIndex=this.state.currentZIndex;
                    while (newIndex<=window.maxZIndex) {
                        newIndex++;
                    }
                    window.maxZIndex=newIndex+1;
                    this.setState({ currentZIndex: newIndex+1 });
                    window.toFront=undefined;
                } 
            } 
            if(this.state.systemColor != window.systemColor){
                this.setState({ systemColor: window.systemColor });
            } 
        },10);
    }

    handleClickOutside() {
        this.setState({ active: false });
    }

    handleClickInsideWindow(){
        this.setState({ active: true });
    } 

    sendToFront() {
        setTimeout(() => {
            this.handleClickInsideWindow();
        }, 10);
        let newIndex=this.state.currentZIndex;
        while (newIndex<window.maxZIndex) {
            newIndex++;
        }
        window.maxZIndex=newIndex+1;
        this.setState({ currentZIndex: newIndex+1 });
    } 

    openModal() {
        this.setState({modalIsOpen: true});
    }
    onClose() {
        this.props.onClose(this.state.uuid);
    }

    onDragStart(){
        this.sendToFront();
    } 

    onResizeStart(){
        this.sendToFront();
    } 

    onToggleWindow(){
        this.setState({maximized: !this.state.maximized});
    } 

    onToggleMinimize(){
        this.props.onToggleMinimize(this.state.uuid);
    } 

    onErrorFRAME(){
        this.setState({url: REST_URL+'/API/APPS/onErrorLoad.html'});
    } 

    render(){

        let WindowContent;

        if(this.state.url!="MyComputer"){
            if(!isElectron()){  
                WindowContent=(<iframe className="frame" onError={this.onErrorFRAME} src={this.state.url}> </iframe>);
            } else {  
                WindowContent=(<webview useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36" className="frame" onError={this.onErrorFRAME} src={this.state.url} plugins allowpopups></webview>);
            }
        }else{
            WindowContent=<FileManager className="frame"/>
        } 

        return(
            <div>
                <Rnd
                    default={{
                        x: 15,
                        y: 15,
                        width: 640,
                        height: 480
                    }}
                    minWidth="200"
                    minHeight="200"
                    cancel=".frame"
                    disableDragging={this.state.maximized}  
                    style={{ zIndex: this.state.currentZIndex }} 
                    size={{ width: ( this.state.maximized ? '100%' : this.state.width ),  height: ( this.state.maximized ? '100%' : this.state.height ) }}
                    position={{ x: ( this.state.maximized ? '0' : this.state.x ), y: ( this.state.maximized ? '0' : this.state.y ) }}
                    onDragStart={this.onDragStart} 
                    onResizeStart={this.onResizeStart} 
                    onDragStop={(e, d) => { 
                        if(!this.state.maximized){
                            this.setState({
                                x: d.x, y: d.y 
                            }
                        ) 
                    }}}
                    onResize={(e, direction, ref, delta, position) => {
                        if(!this.state.maximized){
                            this.setState({
                                width: ref.offsetWidth,
                                height: ref.offsetHeight,
                                ...position,
                            });
                        } 
                    }}
                >
                <div className="window" initWidth={800} initHeight={400} onRequestClose={this.closeModal}>
                    <table onClick={this.sendToFront} onDoubleClick={this.onToggleWindow} class="titleBar" style={{ backgroundColor: this.state.systemColor }} >
                        <tr>
                            <td class="appIcon"><img class="appIcon" src={this.props.icon}></img></td>
                            <td class="appTitle" style={{ color: invert(window.systemColor, true)}}>{this.props.title}</td>
                            <td class="appControls">
                                <img class="btnXControl" onClick={this.onClose}  src={CCLOSE} ></img>
                                <img class="btnControl" onClick={this.onToggleWindow} src={( this.state.maximized ? CRESTORE : CMAXIMIZE )}></img>
                                <img class="btnControl" onClick={this.onToggleMinimize} src={CMINIMIZE}></img>
                            </td>
                        </tr>
                    </table>
                    <div className="body">
                        {WindowContent}  
                        {this.state.active ? 
                            null
                        :(
                            <div onClick={this.sendToFront}  className="overlay"></div>
                        )}
                    </div>
                </div>
            </Rnd>
            </div>            
        );
    } 
} 


export default onClickOutside(Window);
