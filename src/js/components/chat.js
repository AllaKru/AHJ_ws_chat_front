/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import api from './api/api';

export default class Chat {
  constructor(element) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    this.element = element;

    this.add = this.add.bind(this);
    this.subScribe = this.subScribe.bind(this);
    this.wss = this.wss.bind(this);
    this.wssMessage = this.wssMessage.bind(this);
    this.addWssChat = this.addWssChat.bind(this);
    this.ws = new WebSocket('wss://ahj-ws-chat-back.onrender.com/ws');
    // this.ws = new WebSocket('ws://localhost:7070/ws');
  }

  add() {
    const div = document.createElement('div');
    div.className = 'window';
    this.element.append(div);
    this.subScribe(div);
    api.api('/ping');
    this.closeSocket();
  }

  subScribe(el) {
    const form = document.createElement('form');
    form.className = 'subscribe input';
    form.innerHTML = `<form> 
    Выберите псевдоним <input class="input subscribe__name" type="text" name="name" >
    <button class="btn subscribe__send submit">Продолжить</button>
    </form>`;

    el.append(form);
    const subScribes = () => {
      // console.log(e.target);
      const chatMessage = this.element.querySelector('.subscribe__name');
      const chatContent = this.element.querySelector('.chat__content');
      const message = chatMessage.value;
      const type = 'user';
      const arr = [message, type];
      chatMessage.value = '';

      this.ws.addEventListener('message', this.wss);

      this.ws.send(arr);
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      subScribes();
    });
    // form.addEventListener('touchstart', (e) => {
    //   e.preventDefault();
    //   subScribes();
    // });
  }

  wss(e) {
    const { data } = e;

    const message = JSON.parse(data);
    console.log('От сервера получено ');
    console.log(message);

    if (typeof message === 'string') {
      const span = document.createElement('span');
      span.className = 'span';
      span.textContent = message;
      this.element.querySelector('.subscribe').insertBefore(span,
        this.element.querySelector('.btn'));
      setInterval(() => {
        span.remove();
      }, 2000);
    } else if (message.type === 'user') {
      if (message.message) {
        if (this.element.querySelector('.input22') === null) {
          this.addChat(message.id);
          // проверить

          const div = document.createElement('div');

          div.className = 'subscribe input22';
          this.element.querySelector('.window').append(div);
          this.element.querySelector('.input').remove();
        }

        if (this.element.querySelector('.active') === null) {
          const div2 = document.createElement('div');
          div2.className = 'names active';
          this.element.querySelector('.input22').append(div2);
          div2.textContent = `${message.message}`;
        }
      }
    }

    if (message.chat) {
      for (let i = 0; i < message.chat.length; i++) {
        if (this.element.querySelector('.names') !== null) {
          const arr = Array.from(this.element.querySelectorAll('.names'));
          const index = arr.findIndex((el1) => message.chat[i].name === el1.textContent);
          // console.log(el, index);
          if (index === -1) {
            const div2 = document.createElement('div');
            div2.className = 'names';
            this.element.querySelector('.input22').append(div2);
            div2.textContent = message.chat[i].name;
            console.log(message.chat[i].name, arr[i].textContent, 123456789);
          }
        }
      }
      // message.chat.forEach((el) => {
      //   if (this.element.querySelector('.names') !== null) {
      //     const arr = Array.from(this.element.querySelectorAll('.names'));
      //     const index = arr.findIndex((el1) => el.name === el1.textContent);
      //     console.log(el, index);
      //     if (index === -1) {
      //       const div2 = document.createElement('div');
      //       div2.className = 'names';
      //       this.element.querySelector('.input22').append(div2);
      //       div2.textContent = el.name;
      //       console.log(el.name, arr[i].textContent, 123456789);

      //     }
    }
    // бред конечно
    if (this.element.querySelector('.chat2') === null && this.element.querySelector('.active').textContent !== message.name && message.type === 'chat') {
      this.wssMessage(e);
    }
  }

  wssMessage(e) {
    const { data } = e;
    console.log('wss');
    const message12 = JSON.parse(data);

    if (message12.type === 'chat') {
      if (message12.message) {
        const div = document.createElement('div');
        div.className = 'chat2';
        this.element.querySelector('.chat').insertBefore(div, this.element.querySelector('.form'));
        // const arr = Array.from(this.element.querySelectorAll('.chat2'));
        Array.from(this.element.querySelectorAll('.chat2')).forEach((el) => {
          if (el.textContent === '') {
            el.textContent = `${message12.message}`;
            console.log('Пришли данные');
          }
        });
      }
    }
    if (message12.chat) {
      for (let i = 0; i < message12.chat.length; i++) {
        const activeEl = this.element.querySelector('.active');
        if (activeEl !== null) {
          // console.log(el1.textContent, el.name);
          if (message12.chat[i].name === activeEl.textContent) {
            message12.chat[i].chat.forEach((el2) => {
              Array.from(this.element.querySelectorAll('.chat2')).forEach((el3) => {
                if (el3.textContent === el2) {
                  el3.classList.add('chatActiveforMe');
                  console.log(el2);
                }
              });
            });
          }
        }
      }
    }
  }

  addChat(id) {
    // const type1 = 'chat';
    // const form = document.createElement('form');
    // form.className = 'subscribe input';
    // form.innerHTML = `<form>
    // Выберите псевдоним <input class="input subscribe__name" type="text" name="name" >
    // <button class="btn subscribe__send submit">Продолжить</button>
    // </form>`;

    const div = document.createElement('div');
    div.className = 'chat';
    div.innerHTML = `
    <form class ='form'>
    <input class="input subscribe__name1" type="text" name="name" value ="Напиши что-нибудь...">
    <button class ='buttonSend' >+</button>  
    </form>`;

    this.element.querySelector('.window').append(div);
    this.addWssChat(div, id);
  }

  addWssChat(el, id) {
    el.querySelector('.subscribe__name1').addEventListener('click', () => {
      el.querySelector('.subscribe__name1').value = '';
    });
    // el.addEventListener('touchstart', () => {
    //   el.querySelector('.subscribe__name1').value = '';
    // });

    const addchat = () => {
      this.ws.addEventListener('message', this.wssMessage);
      const type = 'chat';
      const message = el.querySelector('.subscribe__name1').value;
      const arr = [message, type, id];
      this.ws.send(arr);
      el.querySelector('.subscribe__name1').value = '...';
    };
    el.addEventListener('submit', (e) => {
      e.preventDefault();
      addchat();
    });
    // variant 2
    // type = button vmesto submit i
    // el.querySelector('.buttonSend').addEventListener('click', (e) => {
    //   e.preventDefault();
    //   addchat();
    // });
    // el.addEventListener('touchstart', (e) => {
    //   e.preventDefault();
    //   addchat();
    // });
  }

  closeSocket() {
    this.element.querySelector('.window').addEventListener('click', () => {
      // проверить без вс.он на сервере
      this.ws.addEventListener('close', () => console.log('close123'));
      console.log('close');
    });
  }
}

// почему отключилось при третьем клиенте
// мобильная адаптация
// тап для телефона
// может отключить close для веб-сокета
// еще поковырять и понять все
