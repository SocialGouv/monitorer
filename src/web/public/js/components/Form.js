import cookies from "../libs/cookies.js";

export default class Form {
  /**
   * Configuration editor component.
   *
   * @param {Element} $node
   */
  constructor($node) {
    try {
      /** @type {HTMLFormElement} */
      this.$node = $node;

      const { elements } = this.$node;
      this.$username = elements[0];
      this.$usernameError = this.$node.querySelectorAll(".invalid-feedback")[0];
      this.$password = elements[1];
      this.$passwordError = this.$node.querySelectorAll(".invalid-feedback")[1];

      this.bindEvents();
      this.checkAuthorization();
    } catch (err) {
      console.error(`[web] [public/js/components/Form()] Error: ${err.message}`);
    }
  }

  /**
   * Bind events.
   *
   * @returns {void}
   */
  bindEvents() {
    try {
      this.$node.addEventListener("submit", this.submit.bind(this));
    } catch (err) {
      console.error(`[web] [public/js/components/Form#bindEvents()] Error: ${err.message}`);
    }
  }

  /**
   * Check for an existing token stored in cookies.
   *
   * @returns {void}
   */
  checkAuthorization() {
    try {
      const authorization = cookies.get("Authorization");
      if (authorization === undefined) return;

      const [username, password] = this.decodeAuthorization(authorization);
      this.$username.value = username;
      this.$password.value = password;

      this.$username.classList.add("is-invalid");
      this.$password.classList.add("is-invalid");
      this.$usernameError.innerText = "Wrong username and/or password.";
    } catch (err) {
      console.error(`[web] [public/js/components/Form#checkAuthorization()] Error: ${err.message}`);
    }
  }

  /**
   * Clear form errors.
   *
   * @returns {void}
   */
  clearErrors() {
    try {
      if (this.$username.classList.contains("is-invalid")) {
        this.$username.classList.add("is-invalid");
        this.$usernameError.innerText = "";
      }

      if (this.$password.classList.contains("is-invalid")) {
        this.$password.classList.add("is-invalid");
        this.$passwordError.innerText = "";
      }
    } catch (err) {
      console.error(`[web] [public/js/components/Form#clearErrors()] Error: ${err.message}`);
    }
  }

  /**
   * Submit the login form.
   *
   * @param {Event} event
   *
   * @returns {void}
   */
  submit(event) {
    try {
      event.preventDefault();
      this.clearErrors();

      const username = this.$username.value.trim();
      const password = this.$password.value.trim();

      if (username.length === 0) {
        this.$usernameError.innerText = "The username is mandatory.";
        this.$username.classList.add("is-invalid");

        return;
      }

      if (password.length === 0) {
        this.$passwordError.innerText = "The password is mandatory.";
        this.$password.classList.add("is-invalid");

        return;
      }

      const authorization = this.encodeAuthorization(username, password);
      cookies.set("Authorization", authorization);

      location.reload();
    } catch (err) {
      console.error(`[web] [public/js/components/Form#submit()] Error: ${err.message}`);
    }
  }

  /**
   * Encode a username and password into an authorization.
   *
   * @param {string} username
   * @param {string} password
   *
   * @returns {string}
   */
  encodeAuthorization(username, password) {
    try {
      return `Basic ${btoa(`${username}:${password}`)}`;
    } catch (err) {
      console.error(
        `[web] [public/js/components/Form#encodeAuthorization()] Error: ${err.message}`,
      );
    }
  }

  /**
   * Decode an authorization into a username and password.
   *
   * @param {string} authorization
   *
   * @returns {[string, string]}
   */
  decodeAuthorization(authorization) {
    try {
      return atob(authorization.substr("Basic ".length)).split(":");
    } catch (err) {
      console.error(
        `[web] [public/js/components/Form#decodeAuthorization()] Error: ${err.message}`,
      );

      return ["", ""];
    }
  }
}
