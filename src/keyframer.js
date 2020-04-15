// 支持 css 动画
// import {prefix} from "inline-style-prefixer";

import { isArray, isArrayLike, makeStyle, replaceOrInsertStyle } from "./utils";


export const makeKeyframes = (name, prefixedKeyframes, props) => {
  if (!name || (name && name.trim() === "") || !isArrayLike(props)) {
    return null;
  }

  const styles = Object.keys(props).map(selector => {
    const values = props[selector];
    let selectorString = selector;

    if (typeof selector === "number" || /^\d+$/.test(selector)) {
      const maxIndex = props.length - 1;

      if (selector === 0) {
        selectorString = "0%";
      } else if (selector === maxIndex) {
        selectorString = "100%";
      } else {
        selectorString = `${parseInt(selector, 10) / maxIndex * 100}%`;
      }
    }

    return makeStyle(selectorString, values);
  });

  return `@${prefixedKeyframes} ${name}{${styles.join("")}}`;
};

class CSSKeyframer {
  constructor(options = {}) {
    const defaults = {
      styleDataName: "data-keyframes",
    };
    this.keyframes = {};
    this.options = { ...defaults, ...options };
  }

  createKeyframesString(name, keyframes) {
    if (!name || typeof name !== "string" || !isArrayLike(keyframes)) {
      return "";
    }

    const prefixedKeyframes = isArray(keyframes) ? [] : {};

    Object.keys(keyframes).forEach((selector) => {
      // prefixedKeyframes[selector] = prefix(keyframes[selector]);
      prefixedKeyframes[selector] = keyframes[selector];
    });

    return makeKeyframes(
      name,
       "keyframes",
      prefixedKeyframes
    );
  }

  register(name, keyframes) {
    this.unregister(name);

    const { styleDataName } = this.options;
    const keyframesString = this.createKeyframesString(name, keyframes);
    if (keyframesString === "") return;

    const el = replaceOrInsertStyle(styleDataName, name);
    if (el == null) return;

    el.innerHTML = keyframesString;

    this.keyframes[name] = el;
  }

  unregister(name) {
    if (this.contains(name)) {
      const el = this.keyframes[name];
      el.parentNode.removeChild(el);
      delete this.keyframes[name];
    }
  }

  unregisterAll() {
    Object.keys(this.keyframes).forEach(name => this.unregister(name));
  }

  contains(name) {
    return this.keyframes.hasOwnProperty(name);
  }
}


export default CSSKeyframer;
