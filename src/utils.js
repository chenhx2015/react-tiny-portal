import isPlainObject from "is-plain-object";
import hyphenateStyleName from "hyphenate-style-name";

export const isArray = (obj) => obj && Array.isArray(obj);

export const isArrayLike = (obj) => isPlainObject(obj) || isArray(obj);


export const makeStyle = (selector, props) => {
  if (!selector || (selector && selector.trim() === "") || !isPlainObject(props)) {
    return null;
  }

  const styles = Object.keys(props).map(key =>
    `${hyphenateStyleName(key)}: ${props[key]};`
  );

  return `${selector}{${styles.join("")}}`;
};


export const replaceOrInsertStyle = (dataName, name) => {
  const el = document.querySelector(`style[${dataName}="${name}"]`);
  if(el){
    return el
  }else{
    const el = document.createElement("style");
    el.type = "text/css";
    el.setAttribute(dataName, name);
    document.head.appendChild(el);
    return el;
  }
};