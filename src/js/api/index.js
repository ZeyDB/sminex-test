class Api {
  setFormData(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(data);
        resolve()
      }, 2000)
    })
  }
}

let instance = new Api();

export function getInstance() {
    return instance;
}