// eslint-disable-next-line no-unused-vars
import api from './components/api/api';

import Chat from './components/chat';

const body = document.getElementsByTagName('body')[0];
const gameDev = new Chat(body);

gameDev.add();
