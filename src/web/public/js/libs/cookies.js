class Cookies {
  get(name) {
    try {
      const cookies = document.cookie
        .split(";")
        .map(row => row.trim())
        .reduce((prev, row) => {
          const equalIndex = row.indexOf("=");
          const name = row.substr(0, equalIndex);
          const value = row.substr(equalIndex + 1);

          return { ...prev, [name]: value };
        }, {});

      return cookies[name];
    } catch (err) {
      console.error(`[web] [public/js/libs/Cookies#get()] Error: ${err.message}`);
    }
  }

  set(name, value) {
    try {
      document.cookie = `${name}=${value}`;
    } catch (err) {
      console.error(`[web] [public/js/libs/Cookies#set()] Error: ${err.message}`);
    }
  }
}

export default new Cookies();
