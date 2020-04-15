// 支持 css 动画
import Prefixer from "inline-style-prefixer";

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
      namePrefix: "",
      styleDataName: "data-keyframes",
      userAgent: null,
    };
    this.keyframes = {};
    this.options = { ...defaults, ...options };
    this.prefixer = new Prefixer({ userAgent: options.userAgent });
  }

  get animationProp() {
    const { jsPrefix, cssPrefix } = this.prefixer;

    return {
      js: jsPrefix ? `${jsPrefix}Animation` : "animation",
      css: `${cssPrefix}animation`,
    };
  }

  getPrefixedName(name) {
    return this.options.namePrefix + name;
  }

  createKeyframesString(name, keyframes) {
    if (!name || typeof name !== "string" || !isArrayLike(keyframes)) {
      return "";
    }

    const prefixedKeyframes = isArray(keyframes) ? [] : {};

    Object.keys(keyframes).forEach((selector) => {
      prefixedKeyframes[selector] = this.prefixer.prefix(keyframes[selector]);
    });

    return makeKeyframes(
      this.getPrefixedName(name),
      this.prefixer.prefixedKeyframes || "keyframes",
      prefixedKeyframes
    );
  }

  register(name, keyframes) {
    this.unregister(name);

    const { styleDataName } = this.options;
    const keyframesString = this.createKeyframesString(name, keyframes);
    if (keyframesString === "") return;

    const el = replaceOrInsertStyle(styleDataName, this.getPrefixedName(name));
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
