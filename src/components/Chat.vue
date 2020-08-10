<template>
  <v-container
    fluid
    style="max-height: 100%; min-height: 100%; overflow-y: hidden; position: relative;"
    relative
  >
    <v-layout
      row
      wrap
      align="top"
      height="100%"
      fill-height
      style="position: absolute;width: 100%"
      class="ma-0 pa-0 pb-6"
    >
      <v-col cols="3" style="height: 100%;" fill-height>
        <v-card style="height: 100%; max-height: 100%; min-height: 100%;">
          <v-card-text style="height: calc(100% - 52px);overflow-y: scroll;">
            <v-divider></v-divider>
            <v-card flat>
              <v-card-actions>
                <div>
                  <v-card-title>MY CHATROOMS</v-card-title>
                  <v-card-subtitle
                    >{{ myChatrooms.length }} ROOMS</v-card-subtitle
                  >
                </div>
                <v-spacer></v-spacer>
                <v-btn icon @click="showMy = !showMy">
                  <v-icon>{{
                    showMy ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>
              <v-divider></v-divider>
              <v-card-text class="pa-0 ma-0" v-if="showMy">
                <v-list two-line>
                  <v-list-item
                    class="pa-0 ma-0"
                    v-for="item in myChatrooms"
                    :key="item.id"
                  >
                    <v-list-item-avatar @click="doSwitch(item.id)">
                      <v-icon>mdi-message-text</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content @click="doSwitch(item.id)">
                      <v-list-item-title>
                        <v-badge
                          v-if="item.msgs > 0"
                          bordered
                          color="error"
                          :content="item.msgs"
                        >
                          {{ item.name }}
                        </v-badge>
                        <span v-else>{{ item.name }}</span>
                      </v-list-item-title>
                      <v-list-item-subtitle>{{
                        item.topic
                      }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn fab text @click="doLeave(item.id)">
                        <v-icon color="error" title="Leave chatroom">
                          mdi-exit-run
                        </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
            <v-divider v-if="showMy"></v-divider>
            <v-card flat>
              <v-card-actions>
                <div>
                  <v-card-title>OTHER CHATROOMS</v-card-title>
                  <v-card-subtitle
                    >{{ otherChatrooms.length }} ROOMS</v-card-subtitle
                  >
                </div>
                <v-spacer></v-spacer>

                <v-btn icon @click="showOthers = !showOthers">
                  <v-icon>{{
                    showOthers ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>
              <v-divider></v-divider>
              <v-card-text class="pa-0 ma-0" v-if="showOthers">
                <v-list two-line>
                  <v-list-item
                    class="pa-0 ma-0"
                    v-for="item in otherChatrooms"
                    :key="item.id"
                  >
                    <v-list-item-avatar>
                      <v-icon>mdi-message-outline</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        item.topic
                      }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn fab text @click="doJoin(item.id)">
                        <v-icon color="success" title="Join chatroom">
                          mdi-chat-plus
                        </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
            <v-divider v-if="showOthers"></v-divider>
          </v-card-text>
          <v-card-actions>
            <v-btn rounded dark block color="pink" @click="callCreateChatroom">
              <v-icon>mdi-plus</v-icon> NEW CHATROOM
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="6" v-if="currentChatroom" style="height: 100%;" fill-height>
        <v-card style="height: 100%; max-height: 100%; min-height: 100%;">
          <v-card-text style="height: calc(100% - 86px);overflow-y: scroll; flex-direction:column-reverse; ">
            <v-timeline align-top :dense="$vuetify.breakpoint.smAndDown">
              <v-timeline-item
                v-for="item in currentMessages"
                :key="item.id"
                :color="item.owner === userId ? 'green lighten-1' : 'indigo'"
                :left="item.owner !== userId"
                :right="item.owner === userId"
                :icon=" users[item.owner] &&
                  users[item.owner].type === 3 ? 'mdi-robot' : 'mdi-account'
                "
                fill-dot
              >
                <v-card
                  :color="item.owner === userId ? 'green lighten-1' : 'indigo'"
                  dark
                >
                  <v-card-title class="title">{{
                    users[item.owner].name
                  }}</v-card-title>
                  <v-card-subtitle>{{ item.createdAt }}</v-card-subtitle>
                  <v-card-text class="white text--primary">
                    <p v-if="item.type === 1">
                      {{ item.message }}
                    </p>
                    <p v-if="item.type === 2">
                      <a :href="item.message" target="_blank">{{
                        item.message
                      }}</a>
                    </p>
                    <p v-if="item.type === 3">
                      <v-img :src="item.message" />
                    </p>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-form
              onSubmit="return false;"
              style="width: 100%;"
              ref="login"
            >
              <v-text-field
                name="message"
                :autocomplete="false"
                v-model="message"
                type="text"
                label="Send your message to chatroom"
                prepend-icon="mdi-message-processing-outline"
                @click:append="doSendMessage(currentChatroom)"
                @keyup.enter="doSendMessage(currentChatroom)"
                append-icon="mdi-send"
              ></v-text-field>
              <input
                @change="doMessageImage"
                ref="image"
                style="display: none;"
                type="file"
                accept="image/*"
              />
            </v-form>
            <v-btn fab rounded @click="$refs.image.click()">
              <v-icon>mdi-image</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="3" v-if="currentChatroom" style="height: 100%;" fill-height>
        <v-card
          fill-height
          style="height: 100%; max-height: 100%; min-height: 100%;overflow-y: hidden;position: relative"
        >
          <v-card-title relative>CHATROOM USERS</v-card-title>
          <v-card-subtitle relative
            >{{ currentUsers.length }} users</v-card-subtitle
          >
          <v-divider></v-divider>
          <v-card-text
            class="pa-0 ma-0"
            style="overflow-y: scroll; height: calc(100% - 86px);"
          >
            <v-list two-line>
              <v-list-item v-for="item in currentUsers" :key="item">
                <v-list-item-avatar>
                  <v-icon v-if="isOnlineUser(item)[1]" color="success"
                    >mdi-lan-check</v-icon
                  >
                  <v-icon v-else color="error">mdi-lan-disconnect</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    >{{ users[item].name }}
                    {{ users[item].online }}</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    users[item].about
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-layout>
    <v-dialog v-model="createChatroom" persistent max-width="80%">
      <v-card>
        <v-card-title>
          <span class="headline">CREATE NEW CHATROOM</span>
        </v-card-title>
        <v-card-text v-if="roomErrors.length > 0" class="pb-0">
          <v-alert type="error">
            {{ roomErrors }}
          </v-alert>
        </v-card-text>
        <v-card-text>
          <v-form
            onSubmit="return false;"
            ref="createChatroom"
            v-model="validFormRoom"
          >
            <v-text-field
              name="chatroomName"
              autocomplete="chatroomName"
              :rules="chatroomNameRules"
              v-model="chatroomName"
              label="Chatroom name *"
              prepend-icon="mdi-chat-alert"
            ></v-text-field>
            <v-text-field
              name="chatroomTopic"
              autocomplete="chatroomTopic"
              v-model="chatroomTopic"
              label="Chatroom topic"
              prepend-icon="mdi-message-bulleted"
            ></v-text-field>
            <small>*indicates required field</small>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="createChatroom = false"
            >Close</v-btn
          >
          <v-btn
            :disabled="!validFormRoom"
            color="primary darken-1"
            @click="doChatroomRegister"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ChatService from "../services/chat";
import { mapGetters } from "vuex";
import { switchChatroom } from "../services/ioclient";

export default {
  name: "Chat",
  computed: {
    ...mapGetters([
      "userId",
      "myChatrooms",
      "otherChatrooms",
      "currentChatroom",
      "currentUsers",
      "users",
      "currentMessages",
    ]),
  },
  data: () => ({
    l: 1,
    message: null,
    showMy: false,
    showOthers: false,

    /* Chatroom popup */
    roomErrors: "",
    validFormRoom: false,
    createChatroom: false,
    chatroomName: null,
    chatroomTopic: null,
    chatroomNameRules: [(v) => !!v || "The chatroom name is mandatory"],
  }),
  methods: {
    callCreateChatroom() {
      this.chatroomName = null;
      this.chatroomTopic = null;
      this.createChatroom = true;

      /* Clear the popup dialog */
      setTimeout(() => {
        if (this.$refs.createChatroom) {
          this.$refs.createChatroom.resetValidation();
          this.$refs.createChatroom.reset();
        }
      }, 1);
    },
    isOnlineUser(user) {
      return [Date.now(),this.$store.getters.isOnline(user)];
    },
    doChatroomRegister() {
      this.roomErrors = "";

      /* Validate the form */
      const form = this.$refs["createChatroom"];
      if (!form.validate()) {
        return;
      }

      ChatService.createChatroom(this.chatroomName, this.chatroomTopic)
        .then(() => {
          /* Show success notification */
          this.$snotify.success(
            "The new chatroom was registered successfully",
            {
              timeout: 10000,
              showProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
            }
          );

          this.createChatroom = false;
        })
        .catch((err) => {
          const error = err.response.data.error;
          switch (error) {
            case 703:
              this.roomErrors =
                "There is chatroom registered with the same name";
              break;

            default:
              this.roomErrors =
                "Unknow chatroom registration error. Please try it later.";
              break;
          }
        });
    },
    doJoin(chatroom) {
      /* Call to join the chatroom */
      ChatService.joinChatroom(chatroom)
        .then(() => {
          /* Show success notification */
          this.$snotify.success("User successfully joined to the chatroom", {
            timeout: 10000,
            showProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
          });
        })
        .catch(() => {
          /* Show success notification */
          this.$snotify.error(
            "There were an unknown error joining the chatroom. Please, try it again",
            {
              timeout: 10000,
              showProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
            }
          );
        });
    },
    doLeave(chatroom) {
      /* Call to leave the chatroom */
      ChatService.leaveChatroom(chatroom)
        .then(() => {
          /* Show success notification */
          this.$snotify.success("User successfully leaved the chatroom", {
            timeout: 10000,
            showProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
          });
        })
        .catch(() => {
          /* Show error notification */
          this.$snotify.error(
            "There were an unknown error leaving the chatroom. Please, try it again",
            {
              timeout: 10000,
              showProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
            }
          );
        });
    },
    doSwitch(chatroom) {
      switchChatroom(chatroom)
        .then(() => {})
        .catch(() => {
          /* Show error notification */
          this.$snotify.error(
            "There were an unknown error switching the chatroom. Please, try it again",
            {
              timeout: 10000,
              showProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
            }
          );
        });
    },
    doSendMessage(chatroom) {
      /* Check for valid message */
      if (!this.message || this.message.length === 0) {
        return;
      }

      /* Call to send new message */
      ChatService.messageChatroom(chatroom, this.message, null)
        .then(() => {
          this.message = null;
        })
        .catch(() => {
          /* Show error notification */
          this.$snotify.error(
            "There were an unknown error sending the message. Please, try it again",
            {
              timeout: 10000,
              showProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
            }
          );
        });
    },
    doMessageImage(e) {
      /* Prepare to read the image */
      const selected = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        /* Call to send new message */
        ChatService.messageChatroom(this.currentChatroom, null, e.target.result)
          .then(() => {
            this.message = null;
          })
          .catch(() => {
            /* Show error notification */
            this.$snotify.error(
              "There were an unknown error sending the image. Please, try it again",
              {
                timeout: 10000,
                showProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
              }
            );
          });
      };

      /* Read the image as Base64 */
      reader.readAsDataURL(selected);
    },
  },
};
</script>
