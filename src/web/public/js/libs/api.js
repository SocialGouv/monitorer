class Api {
  constructor() {
    this.apiUri = "/api";
    this.init = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  }

  async delete(uri) {
    const response = await fetch(`${this.apiUri}${uri}`, {
      ...this.init,
      method: "DELETE",
    });

    return await response.json();
  }

  async get(uri) {
    const response = await fetch(`${this.apiUri}${uri}`, this.init);

    return await response.json();
  }

  async patch(uri, data) {
    const response = await fetch(`${this.apiUri}${uri}`, {
      ...this.init,
      body: JSON.stringify(data),
      method: "PATCH",
    });

    return await response.json();
  }
}

export default new Api();
