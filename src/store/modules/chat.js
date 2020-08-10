const state = {
  myChatrooms: [],
  otherChatrooms: [],
  currentChatroom: null,
  currentMessages:[],
};

const getters = {
  myChatrooms: state => { /* Get current user chatrooms */
    return state.myChatrooms;
  },
  otherChatrooms: state => { /* Get other chatrooms */
    return state.otherChatrooms;
  },
};

const actions = {
	/**
	 * Authenticate the service account
	 */
  /*  callAuthenticateService(context) {
      return new Promise((resolve, reject) => {
        AuthenticationService.authenticateService()
          .then(response => {
            context.commit("doAuthenticateService", response.data);
            resolve();
          }).catch(reject);
      });
    },*/
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
          state.myChatrooms.push(removed[0])
        }
      }
    }

    // TODO XXX HANDLE FOR USER LIST
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
    }

    // TODO XXX HANDLE FOR USER LIST
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
