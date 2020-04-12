import React from 'react'
import {  createPortal } from 'react-dom'
import PropTypes from 'prop-types';

const KEYCODES = {
    ESCAPE: 27
  };
  
class Portal extends React.Component {
    constructor(props) {
      super(props);
      this.state = { active: !!props.defaultOpen };
      this.open = this.open.bind(this);
      this.close = this.close.bind(this);
      this.handleOutsideMouseClick = this.handleOutsideMouseClick.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);
      this.handleAnimationEnd = this.handleAnimationEnd.bind(this)
    }
  
    componentDidMount() {
      if (this.props.closeOnEsc) {
        document.addEventListener('keydown', this.handleKeydown);
      }
      if (this.props.closeOnOutsideClick) {
        document.addEventListener('click', this.handleOutsideMouseClick);
      }
      if(this.props.bindTo) {
        this.portalNode = document.getElementById(this.props.bindTo)
      }
      if ( !this.defaultNode) {
        this.defaultNode = document.createElement('div');
        (this.portalNode || document.body).appendChild(this.defaultNode);
      }
    }
  
    componentWillUnmount() {
      if (this.props.closeOnEsc) {
        document.removeEventListener('keydown', this.handleKeydown);
      }
      if (this.props.closeOnOutsideClick) {
        document.removeEventListener('click', this.handleOutsideMouseClick);
      }
      
      if(this.defaultNode){
        (this.portalNode || document.body).removeChild(this.defaultNode);
        this.defaultNode = null;
      }
    }
  
    render() {
        if (!this.state.active) {
          return null;
        }
        if ( !this.defaultNode) {
          this.defaultNode = document.createElement('div');
          (this.portalNode || document.body).appendChild(this.defaultNode);
        }

        return createPortal( this.props.children, this.defaultNode)
    }

    open(e) {
        if (this.state.active) {
          return;
        }
        if (e && e.nativeEvent) {
          e.nativeEvent.stopImmediatePropagation();
        }

        if(e && e.persist && typeof e.persist === 'function') {
          e.persist()
        }

        let newState = { ...this.state, active: true}

        let createAnimation = this.props.createAnimation
        if(createAnimation && typeof createAnimation ==='function'){
          const [startAnimation, endAnimation] = createAnimation(this.defaultNode, e)
          this.defaultNode.style['animation'] = startAnimation
          newState = {...newState, endAnimation: endAnimation } 
        }
        
        this.setState(newState, this.props.onOpen)
    }

    handleAnimationEnd(e) {
      this.defaultNode.removeEventListener('animationend', this.handleAnimationEnd);
      this.setState({ active: false }, this.props.onClose);
    }

    close(e) {

        if (!this.state.active) {
          return;
        }
        if (e && e.nativeEvent) {
          e.nativeEvent.stopImmediatePropagation();
        }

        if(this.state.endAnimation){
          this.defaultNode.style['animation'] = this.state.endAnimation
          this.defaultNode.addEventListener('animationend', this.handleAnimationEnd);
          //delay 
        }else{
          this.setState({ active: false }, this.props.onClose);
        }
    }
    
    isOpen() {
        return this.state.active
    }
    
    getElement() {
      return this.defaultNode
    }

    handleOutsideMouseClick(e) {
        if (!this.state.active) {
          return;
        }

        const root = this.portalNode || this.defaultNode;

        if (!root || root.contains(e.target) || (e.button && e.button !== 0)) {
          return;
        }
        this.close(e);
    }
    
    handleKeydown(e) {
      if (e.keyCode === KEYCODES.ESCAPE && this.state.active) {
        this.close(e);
      }
    }
  }
  
  Portal.propTypes = {
    // children: PropTypes.object.isRequired,
    defaultOpen: PropTypes.bool,
    bindTo: PropTypes.string,
    closeOnEsc: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    createAnimation:  PropTypes.func,
  };
  
  Portal.defaultProps = {
    onOpen: (e) => {},
    onClose: (e) => {},
    defaultOpen: false,
    closeOnEsc: true,
    closeOnOutsideClick: true
  };
  
export default Portal;

