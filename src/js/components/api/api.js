/* eslint-disable no-console */
class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async api(url, settings) {
    const response = await fetch(this.baseUrl + url, settings);
    if (!response.ok) {
      throw new Error(`Api Error: ${response.statusText}`);
    }
    const json = await response.json();
    console.log(json);
    return json;
  }

  async post(url, postData) {
    return this.api(url, {
      method: 'post',
      body: JSON.stringify(postData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
}
const api = new Api('https://ahj-ws-chat-back.onrender.com');
// const api = new Api('http://localhost:7070');
export default api;
