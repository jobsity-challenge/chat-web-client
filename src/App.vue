<template>
  <v-app style="max-height: 100vh; min-height: 100vh; overflow-y: hidden;">
    <vue-snotify></vue-snotify>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://pbs.twimg.com/profile_images/837760786466553856/ganu0Dms.jpg"
          transition="scale-transition"
          width="40"
        />
        <h1>JobSity Challenge</h1>
      </div>
      <v-spacer></v-spacer>
      <span v-if="!isLogged">
        <v-btn class="mr-2" to="/login" text>
          <span class="mr-2">Login</span>
        </v-btn>
        |
        <v-btn class="ml-2" to="/register" text>
          <span class="mr-2">Register</span>
        </v-btn>
      </span>
      <v-menu v-if="isLogged" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>
                  <h4 style="font-weight:bold;">{{ name }}</h4>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ about }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="doLogout">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main style="max-height: 100%; min-height: 100%; height: 100%">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import router from "./router";

export default {
  name: "App",
  computed: {
    ...mapGetters(["isLogged", "name", "about"]),
  },
  data: () => ({
    //
  }),
  methods: {
    doLogout() {
      /* Call the alogout user method */
      this.$store.dispatch("callLogoutUser").finally(() => {
        /* Redirect to login view */
        router.push("/login");
      });
    },
  },
};
</script>
