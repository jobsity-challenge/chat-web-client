import ServicesConfiguration from "../config/services";
import axios from "axios";

export default {
  /**
   * Create new chatroom
   * 
   * @param {*} name  Chatroom name
   * @param {*} topic  Chatroom topic
   */
  createChatroom(name, topic) {
    return axios.post(ServicesConfiguration.CHAT.SERVER + ServicesConfiguration.CHAT.SERVICES.CREATE_CHATROOM,
      {
        name: name,
        topic: topic,
      }, {
      headers: {
        "Authorization": "USER",
        "Content-Type": "application/json"
      }
    });
  },

  /**
   * Join the current user to the chatroom
   * 
   * @param {*} chatroom  Target chatroom
   */
  joinChatroom(chatroom) {
    return axios.post(ServicesConfiguration.CHAT.SERVER + ServicesConfiguration.CHAT.SERVICES.JOIN_CHATROOM + chatroom,
      {}, {
      headers: {
        "Authorization": "USER",
        "Content-Type": "application/json"
      }
    });
  },

  /**
   * Leave the current user from the chatroom
   * 
   * @param {*} chatroom  Target chatroom
   */
  leaveChatroom(chatroom) {
    return axios.delete(ServicesConfiguration.CHAT.SERVER + ServicesConfiguration.CHAT.SERVICES.LEAVE_CHATROOM + chatroom,
      {}, {
      headers: {
        "Authorization": "USER",
        "Content-Type": "application/json"
      }
    });
  },
};
