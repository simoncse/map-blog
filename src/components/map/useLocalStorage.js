//handle settings saved in local storage

class LS {
  static getCenter() {
    let center;
    if (localStorage.getItem("center") === null) {
      center = [17, 46];
    } else {
      center = JSON.parse(localStorage.getItem("center"))
    }

    return center;
  }

  static setCenter(center) {
    localStorage.setItem("center", JSON.stringify(center))
  }
}


export default LS