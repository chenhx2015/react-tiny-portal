# Introduction

![images](./portal.gif)

[demo address](https://chenhx2015.github.io/react-transform-modal/)

# usage

```
import React from "react";
import { render } from "react-dom";
import usePortal from 'react-tiny-portal'

const Exmaple1 = () => {
  const { Portal, open, close, isOpen } = usePortal();

  return (
    <div>
      <h3>Example Portal</h3>
      <p>
        <button onClick={open}>Open</button>
      </p>
      <div id="test"></div>
      <Portal bindTo="test" closeOnOutsideClick={true}>
        <div style={{ textAlign: "center" }}>
          Example Portal
          <button onClick={close}>Close</button>
        </div>
      </Portal>

    </div>
  );
};


function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <Exmaple1 />
    </div>
  );
}

render(<App />, document.getElementById("root"));

```
