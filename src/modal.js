import React, { useCallback } from "react";
import usePortal from "./usePortal";
import CSSKeyframer from "./keyframer";

const keyframer = new CSSKeyframer({
  /* options */
});

function createAnimation(portalEl, e) {
  const start = e.target.getBoundingClientRect();
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

  return ["portalFadeIn 1s ease-out", "portalFadeOut 1s ease-out"];
}

export default () => {
  const { Portal, open, close, isOpen } = usePortal();
  let styleModal = {
    position: "fixed",
    top: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
  };

  const Modal = useCallback((props) => {
    return (
      <Portal createAnimation={createAnimation} {...props}>
        <div style={styleModal} tabIndex={-1}>
          {props.children}
        </div>
      </Portal>
    );
  });

  return Object.assign(
    {},
    {
      Modal,
      isOpen,
      open: open,
      close: close,
    }
  );
};
