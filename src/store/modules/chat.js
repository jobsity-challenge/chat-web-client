import AuthenticationService from "../../services/authentication"

const state = {
  myChatrooms: [],
  otherChatrooms: [],
  currentChatroom: null,
  currentUsers: [],
  currentMessages: [],
  users: {},
};

const getters = {
  myChatrooms: state => { /* Get current user chatrooms */
    return state.myChatrooms;
  },
  otherChatrooms: state => { /* Get other chatrooms */
    return state.otherChatrooms;
  },
  currentChatroom: state => { /* Get current chatroom */
    return state.currentChatroom;
  },
  currentUsers: state => { /* Get current chatroom users */
    return state.currentUsers;
  },
  currentMessages: state => { /* Get current chatroom messages */
    return state.currentMessages;
  },
  users: state => { /* Get all users information */
    return state.users;
  },
  isOnline: state => {
    return (user) => { /* Get if an user is online */
      return state.users[user] ? state.users[user].online : false;
    };
  },
};

const actions = {
	/**
	 * Retrieve accounts information
	 */
  callAccountsInfo(context, data) {
    return new Promise((resolve, reject) => {
      AuthenticationService.info(data)
        .then(response => {
          context.commit("doAccountsInfo", response.data);
          resolve();
        }).catch(reject);
    });
  },
};

const mutations = {
  /**
	 * Store the chatrooms information
	 */
  doAddChatroom(state, payload) {
    /* Store chatrooms information */
    if (payload.isUser || payload.me === payload.owner) {
      state.myChatrooms.push({
        id: payload.id,
        name: payload.name,
        topic: payload.topic,
        count: payload.count,
        msgs: 0
      });
    } else {
      state.otherChatrooms.push({
        id: payload.id,
        name: payload.name,
        topic: payload.topic,
        count: payload.count,
      });
    }
  },

  /**
	 * User join to chatroom
	 */
  doJoin(state, payload) {
    /* Store chatrooms information */
    if (payload.me === payload.user) {
      /* Look for the target room */
      let itr = 0;
      while (itr < state.otherChatrooms.length && state.otherChatrooms[itr].id !== payload.chatroom) {
        itr++;
      }

      /* Swith room states */
      if (itr < state.otherChatrooms.length) {
        /* Remove from others chatrooms */
        const removed = state.otherChatrooms.splice(itr, 1);

        /* Add to my chatrooms */
        if (removed.length === 1) {
          state.myChatrooms.push({
            id: removed[0].id,
            name: removed[0].name,
            topic: removed[0].topic,
            count: removed[0].count,
            msgs: 0
          })
        }
      }
      return;
    }

    /* Check if the user is joining the current chatroom */
    if (state.currentChatroom === payload.chatroom) {
      /* Add the user to the chatroom */
      state.currentUsers.push(payload.user);
    }
  },

  /**
 * User leave from chatroom
 */
  doLeave(state, payload) {
    /* Store chatrooms information */
    if (payload.me === payload.user) {
      /* Look for the target room */
      let itr = 0;
      while (itr < state.myChatrooms.length && state.myChatrooms[itr].id !== payload.chatroom) {
        itr++;
      }

      /* Swith room states */
      if (itr < state.myChatrooms.length) {
        /* Remove from my chatrooms */
        const removed = state.myChatrooms.splice(itr, 1);

        /* Add to others chatrooms */
        if (removed.length === 1) {
          state.otherChatrooms.push(removed[0])
        }
      }

      /* Check if the user is leaving the current chatroom */
      if (state.currentChatroom === payload.chatroom) {
        state.currentChatroom = null;
        state.currentUsers = [];
        state.currentMessages = [];
      }

      return;
    }

    /* Check if the user leave the current chatroom */
    if (state.currentChatroom === payload.chatroom) {
      /* Look for the target user */
      const idx = state.currentUsers.indexOf(payload.user);
      if (idx >= 0) {
        /* Remove the user */
        state.currentUsers.splice(idx, 1);
      }
    }
  },

  /**
	 * Store accounts info
	 */
  doAccountsInfo(state, payload) {
    /* Clear chatrooms information */
    payload.users.forEach(value => {
      if (state.users[value.user]) {
        state.users[value.user].user = value.user;
        state.users[value.user].name = value.name;
        state.users[value.user].type = value.type;
        state.users[value.user].about = value.about;
      } else {
        state.users[value.user] = {
          user: value.user,
          name: value.name,
          type: value.type,
          about: value.about,
          online: false,
        }
      }
    })
  },

  /**
	 * Update user online status
	 */
  doStatus(state, payload) {
    let tmp = state.users[payload.user];
    if (!tmp) {
      tmp = {};
    }
    tmp.online = payload.status === 1;
    state.users[payload.user] = tmp;
  },

  /**
	 * Store current chatroom info
	 */
  doSwitch(state, payload) {
    state.currentChatroom = payload.id;
    state.currentUsers = payload.users;
    state.currentMessages = (payload.messages || []).slice().reverse();

    /* Look for the current chatroom to clear messages */
    let itr = 0;
    while (itr < state.myChatrooms.length && state.myChatrooms[itr].id !== payload.id) {
      itr++;
    }

    if (itr < state.myChatrooms.length) {
      state.myChatrooms[itr].msgs = 0;
    }
  },

  /**
   * Store new message
   */
  doMessage(state, payload) {
    /* Ensure message its for the current chatroom */
    if (payload.chatroom === state.currentChatroom) {
      if (!state.currentMessages) {
        state.currentMessages = [];
      }

      /* Check if there are 50 messages */
      if (state.currentMessages.length === 50) {
        state.currentMessages.splice(0, 1);
      }

      /* Add the new message */
      state.currentMessages.push(payload);
      return;
    }

    /* Check for other of my rooms */
    let itr = 0;
    while (itr < state.myChatrooms.length && state.myChatrooms[itr].id !== payload.chatroom) {
      itr++;
    }

    if (itr < state.myChatrooms.length) {
      state.myChatrooms[itr].msgs++;
    }
  },

	/**
	 * Disconnect from chat server
	 */
  doDisconnect(state) {
    /* Clear chatrooms information */
    state.myChatrooms = [];
    state.otherChatrooms = [];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
