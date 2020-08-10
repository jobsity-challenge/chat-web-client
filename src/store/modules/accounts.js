import AuthenticationService from "../../services/authentication"
import { connectSocket, closeSocket } from "../../services/ioclient"

const state = {
  userId: null,
  serviceId: null,
  name: null,
  about: null,
  roles: null,
  userToken: null,
  serviceToken: null,
};

const getters = {
  isLogged: state => { /* Indicate if an user is authenticated or not */
    return state.userId !== null || localStorage.getItem("ut") !== null;
  },
  userId: state => { /* Retrieve the user id */
    return state.userId;
  },
  serviceId: state => { /* Retrieve the service id */
    return state.clientCredential;
  },
  name: state => { /* Retrieve the current user name */
    return state.name;
  },
  about: state => { /* Retrieve the current user about */
    return state.about;
  },
  roles: state => { /* Retrieve the current user roles */
    return state.roles;
  },
  userToken: state => { /* Retrieve the curren user access token */
    /* If the token is not set retrieve from local storage */
    if (!state.userToken) {
      state.userToken = localStorage.getItem("ut");
    }
    return state.userToken;
  },
  serviceToken: state => { /* Retrieve the service access token */
    return state.serviceToken;
  },
};

const actions = {
	/**
	 * Authenticate the service account
	 */
  callAuthenticateService(context) {
    return new Promise((resolve, reject) => {
      AuthenticationService.authenticateService()
        .then(response => {
          context.commit("doAuthenticateService", response.data);
          resolve();
        }).catch(reject);
    });
  },

	/**
	 * Authenticate an user account
	 */
  callAuthenticateUser(context, payload) {
    return new Promise((resolve, reject) => {
      AuthenticationService.authenticateUser(payload.email, payload.password)
        .then(response => {
          context.commit("doAuthenticateUser", response.data);

          /* Open the chat socket connection */
          connectSocket(response.data.token);
          resolve();
        }).catch(reject);
    });
  },

	/**
	 * Check if the user access token is valid
	 */
  callUserValidation(context) {
    return new Promise((resolve, reject) => {
      /* Ensure that user token is set */
      if (!localStorage.getItem("ut")) {
        return resolve();
      }

      AuthenticationService.validation('USER')
        .then(response => {
          context.commit("doUserValidation", response.data);

          /* Open the chat socket connection */
          connectSocket(localStorage.getItem("ut"));
          resolve();
        }).catch(reject);
    });
  },

	/**
	 * Logout the user account
	 */
  callLogoutUser(context) {
    return new Promise((resolve) => {
      AuthenticationService.logout('USER')
        .finally(() => {
          context.commit("doLogoutUser");

          /* Close the socket connection */
          closeSocket();
          resolve();
        });
    });
  },

  /**
	 * Logout the service account
	 */
  callLogoutService(context) {
    return new Promise((resolve) => {
      AuthenticationService.logout('SERVICE')
        .finally(() => {
          context.commit("doLogoutService");
          resolve();
        });
    });
  },

  /**
   * Register new user account
   */
  callRegister(_context, payload) {
    return new Promise((resolve, reject) => {
      AuthenticationService.register({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        about: payload.about,
        type: 1
      }).then(() => {
        resolve();
      }).catch(reject);
    });
  },

};

const mutations = {
	/**
	 * Store the service account credentials
	 */
  doAuthenticateService(state, payload) {
    /* Store service information */
    state.serviceId = payload.user;
    state.serviceToken = payload.token;
  },

  /**
	 * Store the user account credentials
	 */
  doAuthenticateUser(state, payload) {
    /* Store user information */
    state.userId = payload.user;
    state.userToken = payload.token;
    state.name = payload.name;
    state.about = payload.about;
    state.roles = payload.roles;

    /* Store the token in browser local storage */
    localStorage.setItem("ut", payload.token);
  },

	/**
	 * Reload user information
	 */
  doUserValidation(state, payload) {
    /* Store user information */
    state.userId = payload.user;
    state.name = payload.name;
    state.about = payload.about;
    state.roles = payload.roles;
  },

	/**
	 * Logout the current user account
	 */
  doLogoutUser(state) {
    /* Clear user information */
    state.userId = null;
    state.userToken = null;
    state.name = null;
    state.about = null;
    state.roles = null;

    /* Remove the token from browser local storage */
    localStorage.removeItem("ut");
  },

	/**
	 * logout the current service account
	 */
  doLogoutService(state) {
    /* Clear service information */
    state.serviceId = null;
    state.serviceToken = null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
