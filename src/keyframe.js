// 支持 css 动画
import Prefixer from "inline-style-prefixer";
import makeKeyframes from "./make-keyframes";
import getStyleElement from "./get-style-element";
import { keys, isArray, isArrayLike } from "./utils";

class CSSKeyframer {
  constructor(options = {}) {
    this.keyframes = {};
    this.options = { ...CSSKeyframer.defaults, ...options };
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

  getKeyframesString(name, keyframes) {
    if (!name || typeof name !== "string" || !isArrayLike(keyframes)) {
      return "";
    }

    const prefixedKeyframes = isArray(keyframes) ? [] : {};

    keys(keyframes).forEach((selector) => {
      prefixedKeyframes[selector] = this.prefixer.prefix(keyframes[selector]);
    });

    return makeKeyframes(
      this.getPrefixedName(name),
      this.prefixer.prefixedKeyframes || "keyframes",
      prefixedKeyframes,
      this.options.pretty
    );
  }

  register(name, keyframes) {
    this.unregister(name);

    const { styleDataName } = this.options;
    const keyframesString = this.getKeyframesString(name, keyframes);
    if (keyframesString === "") return;

    const el = getStyleElement(styleDataName, this.getPrefixedName(name));
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

  contains(name) {
    return this.keyframes.hasOwnProperty(name);
  }
}

CSSKeyframer.defaults = {
  namePrefix: "",
  styleDataName: "data-keyframes",
  pretty: false,
  userAgent: null,
};
export default CSSKeyframer;
