import ServicesConfiguration from "../config/services";
import axios from "axios";

const se = "\x77\x65\x62\x40\x63\x68\x61\x6c\x6c\x65\x6e\x67\x65\x2e\x63\x6f\x6d";
const sp = "\x63\x68\x61\x6c\x6c\x65\x6e\x67\x65\x2a\x32\x30\x32\x30";

export default {
  /**
   * Authenticate the service account
   */
  authenticateService() {
    return axios.post(ServicesConfiguration.AUTH.SERVER + ServicesConfiguration.AUTH.SERVICES.LOGIN,
      {
        email: se,
        password: sp,
      }, {
      headers: {
        noauth: 1,
        "Content-Type": "application/json"
      }
    });
  },

  /**
   * Authentcate user account
   * 
   * @param {*} email  User account email address 
   * @param {*} password  User account password
   */
  authenticateUser(email, password) {
    return axios.post(ServicesConfiguration.AUTH.SERVER + ServicesConfiguration.AUTH.SERVICES.LOGIN,
      {
        email: email,
        password: password,
      }, {
      headers: {
        "Authorization": "SERVICE",
        "Content-Type": "application/json"
      }
    });
  },

  /**
   * Validate the account access token
   * 
   * @param {*} type  Account type to validate USER or SERVICE
   */
  validation(type) {
    return axios.get(ServicesConfiguration.AUTH.SERVER + ServicesConfiguration.AUTH.SERVICES.VALIDATE, {
      headers: {
        "Authorization": type,
      }
    });
  },

  /**
   * Logout an account
   * 
   * @param {*} type  Account type to logout USER or SERVICE
   */
  logout(type) {
    return axios.post(ServicesConfiguration.AUTH.SERVER + ServicesConfiguration.AUTH.SERVICES.LOGOUT, {}, {
      headers: {
        "Authorization": type,
      }
    });
  },

  /**
   * Register new user account
   * 
   * @param {*} data  User account information
   */
  register(data) {
    return axios.post(ServicesConfiguration.AUTH.SERVER + ServicesConfiguration.AUTH.SERVICES.REGISTER, data, {
      headers: {
        "Authorization": "SERVICE",
        "Content-Type": "application/json"
      }
    });
  },
};