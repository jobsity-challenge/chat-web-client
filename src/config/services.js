export default {
  AUTH: {
    SERVER: "https://accounts.jobsity.ikoabo.com",
    SERVICES: {
      LOGIN: "/v1/accounts/login",
      REGISTER: "/v1/accounts/register",
      LOGOUT: "/v1/accounts/logout",
      VALIDATE: "/v1/accounts/validate"
    }
  },
  CHAT: {
    SERVER: "https://chat.jobsity.ikoabo.com",
    SERVICES: {
      CREATE_CHATROOM: "/v1/chat/rooms",
      JOIN_CHATROOM: "/v1/chat/rooms/join/",
      LEAVE_CHATROOM: "/v1/chat/rooms/leave/",
    }
  }
}