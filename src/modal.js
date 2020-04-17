import React, { useCallback, useRef } from "react";
import usePortal from "./usePortal";
import CSSKeyframer from "./keyframer";
import {replaceOrInsertStyle} from './utils'

const keyframer = new CSSKeyframer();

function createAnimation(portalEl, startEl) {
  const start = startEl.getBoundingClientRect();
  const end = portalEl.getBoundingClientRect();

  const x = (start.left + start.right) / 2 - (end.left + end.right) / 2;
  const y = (start.top + start.bottom) / 2 - (end.top + end.bottom) / 2;

  // CSS property will be added vendor-prefix is automatically!

  keyframer.register("portalFadeIn", {
    "0%": {
      transform: `translate(${x}px, ${y}px) scale(0.1, 0.1) `,
      opacity: 0,
    },
    "50%": {
      transform: `translate(${x * 0.25}px, ${y * 0.25}px) scale(0.75, 0.75)`,
      opacity: 0.75,
    },
    "100%": {
      opacity: 1,
    },
  });

  keyframer.register("portalFadeOut", {
    "0%": {
      opacity: 1,
    },
    "50%": {
      transform: "scale3d(0.5, 0.5, 0.5)",
      opacity: 0.5,
    },
    "100%": {
      transform: `translate(${x}px, ${y}px) scale3d(0.01, 0.01, 0.01)`,
      opacity: 0,
    },
  });

  const el = replaceOrInsertStyle('data-portal-animation', 'portal-animation');
  if (el){
    el.innerHTML = `.portalFade {
        animation: portalFadeIn 1s ease-out;
    }`;
  }

  return ()=>{
    const el = replaceOrInsertStyle('data-portal-animation', 'portal-animation');
    if (el){
      el.innerHTML = `.portalFade {
          animation: portalFadeOut 1s ease-out;
      }`;
    }
  }
}


export default () => {
  
  const { Portal, open, close, isOpen } = usePortal();

  const refBond = useRef(null)
  const refAnimation = useRef(null)
  const openModal = useCallback((e) => {
    if(refBond.current){
      let portalEl = refBond.current
      refAnimation.current = createAnimation(portalEl, e.target)

      return open(e)
    }else{
      return null
    }
  }, [open])

  const closeModal = useCallback((e) => {
      if(refAnimation.current){
        refAnimation.current()
        if(e && e.persist && typeof e.persist === 'function') {
            e.persist()
        }
        if(refBond.current) {
            let portalEl = refBond.current
            const handleAnimationEnd = () => {
                portalEl.removeEventListener('animationend', handleAnimationEnd);
                close(e)
            }
            portalEl.addEventListener('animationend', handleAnimationEnd)
        }
      }else{
          close(e)
      }

  }, [close])


  const Modal = useCallback((props) =>{
    let styleModal = {
      position: "fixed",
      top: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
    };

    if(props.bindTo) {
      refBond.current = document.getElementById(props.bindTo)
    }else{
      refBond.current = document.body
    }
 
    return (
      <Portal {...props}  >
          <div tabIndex={-1}  style={styleModal} className='portalFade'>
              {props.children}
          </div>
      </Portal>
    );
  })

  return Object.assign(
    {},
    {
      Modal,
      isOpen,
      open:openModal,
      close:closeModal,
    }
  );
};
