import React from 'react'
import {  createPortal } from 'react-dom'
import PropTypes from 'prop-types'

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
      this.refNode = React.createRef()
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
      if(!this.portalNode) {
        this.portalNode = document.body
      }

    }
  
    componentWillUnmount() {
      if (this.props.closeOnEsc) {
        document.removeEventListener('keydown', this.handleKeydown);
      }
      if (this.props.closeOnOutsideClick) {
        document.removeEventListener('click', this.handleOutsideMouseClick);
      }
    }
  
    render() {

        if (!this.state.active) {
          return null;
        }

        let node = <div ref={this.refNode} style={this.props.style} className={this.props.className}>
          {this.props.children}
        </div>

        return createPortal( node , this.portalNode)
    }

    open(e) {
        if (this.state.active) {
          return;
        }
        if (e && e.nativeEvent) {
          e.nativeEvent.stopImmediatePropagation();
        }

        // if(e && e.persist && typeof e.persist === 'function') {
        //   e.persist()
        // }

        let newState = { ...this.state, active: true}
        
        this.setState(newState, this.props.onOpen)
    }


    close(e) {

        if (!this.state.active) {
          return;
        }
        if (e && e.nativeEvent) {
          e.nativeEvent.stopImmediatePropagation();
        }

        this.setState({ active: false }, this.props.onClose);
        
    }
    
    isOpen() {
        return this.state.active
    }

    isOpening() {
      return this.state.active
    }

    handleOutsideMouseClick(e) {
        if (!this.state.active) {
          return;
        }

        const root = this.refNode.current || this.portalNode;

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
  
  Portal.defaultProps = {
    onOpen: (e) => {},
    onClose: (e) => {},
    defaultOpen: false,
    closeOnEsc: true,
    closeOnOutsideClick: true
  };

  Portal.propTypes = {
    // children: PropTypes.object.isRequired,
    defaultOpen: PropTypes.bool,
    bindTo: PropTypes.string,
    closeOnEsc: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  };

export default Portal;

