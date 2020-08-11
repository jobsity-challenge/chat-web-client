import io from 'socket.io-client';
import ServicesConfiguration from "../config/services";
import { store } from '../store';

/* Websocket connector */
let _socket = null;

/* Timer to handle writing events */
let _lastKeyTime = 0;
let _interval = -1;

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
    },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5
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


  /* Handle chatroom leave notification */
  _socket.on('writing', (data) => {
    /* Update writing status */
    store.commit("doWriting", data);
  });

  /* Handle user status change notification */
  _socket.on('status', (data) => {
    /* Call to store the new user status */
    store.commit("doStatus", data);
  });

  /* Handle user status change notification */
  _socket.on('message', (data) => {
    /* Check if user owner information is preloaded */
    let users = [];
    if (!store.getters.users[data.owner] || !store.getters.users[data.owner].user) {
      users.push(data.owner);
    }

    /* Call to load user information */
    store.dispatch("callAccountsInfo", users)
      .finally(() => {
        /* Call to store the new message */
        store.commit("doMessage", data);
      });
  });
}

/**
 * Function to handle keyboard event to detect writing event
 * 
 * @param {*} event 
 * @param {*} chatroom 
 * @param {*} cb 
 */
export function keyboardHandler(event, chatroom, cb) {
  /* Prevent action on enter key */
  if (event.key == "Enter") {
    cb();
    return;
  }

  /* If the interval is not running then create it */
  if (_interval === -1) {
    _interval = setInterval(() => {
      /* Check if there is a difference of one second */
      if (new Date().getTime() - _lastKeyTime > 1000) {
        /* Clear the inteval */
        clearInterval(_interval);
        _interval = -1;

        /* Send notification for stop writing */
        if (_socket) {
          _socket.emit('writing', { chatroom: chatroom, status: 0 }, () => {
          });
        }
      }
    }, 300);

    /* Send notification to start writing */
    if (_socket) {
      _socket.emit('writing', { chatroom: chatroom, status: 1 }, () => {
      });
    }
  }
  else {
    /* Update to current time */
    _lastKeyTime = new Date().getTime();
  }
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
  return new Promise((resolve, reject) => {
    /* Ensure socket is valid */
    if (_socket !== null) {
      /* Request chatroom switch */
      _socket.emit('switch', { chatroom: chatroom }, (response) => {
        if (response.error !== 0) {
          return reject({ error: 'Error switching' });
        }

        /* Get for required users information */
        let users = response.data.users.filter(value => {
          return !store.getters.users[value] || !store.getters.users[value].user;
        });

        /* Get users from message owners */
        response.data.messages.forEach(value => {
          /* Check if the data is preloaded */
          if (!store.getters.users[value.owner] || !store.getters.users[value.owner].user) {
            /* Check if the user ir in the previous list */
            if (users.indexOf(value.owner) < 0) {
              users.push(value.owner);
            }
          }
          return;
        });

        store.dispatch("callAccountsInfo", users)
          .then(() => {

            /* Load chat history */
            store.commit("doSwitch", response.data);
          }).catch(reject);
      });
    } else {
      reject({ error: 'Invalid socket' });
    }
  })
}
