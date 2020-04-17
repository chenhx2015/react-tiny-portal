import React, { useRef, useCallback } from 'react'
import Portal from './portal'

export default function usePortal() {
  // You can now get a ref directly to the DOM button:
  const ref = useRef(null);

  const open = useCallback((e) => {
    return ref.current && ref.current.open(e)
  }, [ref])

  const close = useCallback((e) => {
    return ref.current && ref.current.close(e)
  }, [ ref])

  const isOpen = useCallback(()=>{
    return ref.current && ref.current.isOpen()
  }, [ref])

  const PortalWithRef = useCallback((props) =>{
    return ( <Portal ref={ref} {...props} />)
  },[ref])

  return Object.assign({},{
      Portal: PortalWithRef,
      isOpen,
      open,
      close,
    }
  )
}