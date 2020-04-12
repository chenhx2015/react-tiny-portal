import React, {useRef} from 'react'
import { render } from 'react-dom'
import usePortal from '../usePortal'
import useModal from '../modal'


const Exmaple1 = () => {

  const { Portal, open, close, isOpen} = usePortal()
  const ref = useRef()
  return (
    <div>
      <h3>Example Portal</h3>
      <p><button onClick={open} >Open</button></p>
      <div id='test' ></div>
      <Portal bindTo='test' closeOnOutsideClick={false}>
        <div style={{textAlign:'center'}}>
          Example  Portal
          <button onClick={close}>Close</button>
        </div>
      </Portal>
    </div>
  )
}

const ExampleModal = () => {
  const styleModalContent = {
    margin: '1.75rem auto',
    width: '90%',
    maxWidth: '500px',
    background: '#fff',
    backgroundClip: 'padding-box',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: '0.3rem'
  };
  
  const styleModalHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #dee2e6'
  };
  
  const styleModalClose = {
    margin: '-1rem -1rem -1rem',
    padding: '1rem',
    border: 'none',
    fontSize: '1.5rem',
    fontWeight: '700',
    lineHeight: 1,
    color: '#000',
    background: 'inherit',
    textShadow: '0 1px 0 #fff',
    opacity: '0.5',
    cursor: 'pointer'
  };
  const { Modal, open, close, isOpen} = useModal()

  return (
      <div>
         <h3>Example Modal</h3>
         <p><button onClick={open} >Open</button></p>
          <Modal>
              <div style={styleModalContent}>
                <div style={styleModalHeader}>
                  <h5>Title</h5>
                  <button style={styleModalClose} onClick={close} type='button'>
                    <span aria-hidden='true'>&times;</span>
                  </button>
                </div>
                <div>
                  <p>You can also close me by pressing the &quot;ESC&quot; key.</p>
                </div>
              </div>
          </Modal>
    </div>
  )
}

function App() {
  return (
    <div style={{display:"flex", flexDirection: "row", justifyContent:'space-around'}}>
      <Exmaple1 />
      <ExampleModal />
    </div>
  )
}

render(<App />, document.getElementById('root'))