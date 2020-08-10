import io from 'socket.io-client';
import ServicesConfiguration from "../config/services";
import { store } from '../store';

/* Websocket connector */
let _socket = null;

/**
 * Clear IMS event listeners
 */
function clearEvents() {
  if (_socket) {
    _socket.removeListener('chatroom');
    _socket.removeListener('join');
    _socket.removeListener('leave');
    _socket.removeListener('writing');
  }
}

/**
 * Connect to chat server using socket.io
 * 
 * @param {*} token 
  */
export function connectSocket(token) {
  /* Check if socket.io is connected */
  if (_socket != null) {
    /* Close the active socket */
    closeSocket();
  }

  /* Connect to socket.io server */
  _socket = io.connect(`${ServicesConfiguration.CHAT.SERVER}/v1/channel`, {
    timeout: 5000,
    query: {
      token: token
    }
  });

  /* Handle connection event */
  _socket.on('connect', function () {

  });

  /* Handle disconnect event */
  _socket.on('disconnect', () => {
    /* Clear chat information */
    store.commit("doDisconnect");

    closeSocket();
  });

  /* Handle new chatroom notification */
  _socket.on('chatroom', (data) => {
    /* Get current user */
    data['me'] = store.getters.userId;

    /* Call to store the new chatroom */
    store.commit("doAddChatroom", data);
  });

  /* Handle chatroom join notification */
  _socket.on('join', (data) => {
    /* Get current user */
    data['me'] = store.getters.userId;

    /* Call to store the new chatroom */
    store.commit("doJoin", data);
  });

  /* Handle chatroom leave notification */
  _socket.on('leave', (data) => {
    /* Get current user */
    data['me'] = store.getters.userId;

    /* Call to store the new chatroom */
    store.commit("doLeave", data);
  });
}

/**
 * Close current chat connection
 */
export function closeSocket() {
  /* Ensure socket is valid */
  if (_socket !== null) {
    clearEvents();
    _socket.disconnect(true);
    _socket = null;
  }
}

/**
 * Send writing status notification
 * 
 * @param {*} chatroom 
 * @param {*} status 
 */
export function writingStatus(chatroom, status) {
  if (_socket) {
    _socket.emit('writing', { chatroom: chatroom, status: status });
  }
}

/**
 * Switch to new chatroom
 * 
 * @param {*} chatroom 
 */
export function switchChatroom(chatroom) {
  /* Ensure socket is valid */
  if (_socket !== null) {
    _socket.emit('switch', (err) => {
      console.error(err);
    });
  }
}