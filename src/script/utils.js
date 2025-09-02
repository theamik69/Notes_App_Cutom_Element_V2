class Utils {
  static emptyElement(element) {
    element.innerHTML = '';
  }

  static isValidInteger(value) {
    return Number.isInteger(value) && Number.isFinite(value);
  }
}

export default Utils;
