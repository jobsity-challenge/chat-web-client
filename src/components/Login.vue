<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login into you account</v-toolbar-title>
          </v-toolbar>
          <v-card-text v-if="errors.length > 0" class="pb-0">
            <v-alert type="error">
              {{ errors }}
            </v-alert>
          </v-card-text>
          <v-card-text>
            <v-form onSubmit="return false;" ref="login" v-model="validForm">
              <v-text-field
                name="email"
                autocomplete="email"
                :rules="emailRules"
                v-model="email"
                type="email"
                label="Email address *"
                prepend-icon="mdi-email"
              ></v-text-field>
              <v-text-field
                id="password"
                name="password"
                autocomplete="password"
                :rules="passwordRules"
                v-model="password"
                label="Password *"
                prepend-icon="mdi-lock"
                @keyup.enter="doLogin"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi mdi-eye' : 'mid mdi-eye-off'"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn :disabled="!validForm" color="primary" @click="doLogin"
              >LOGIN</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn text link to="/register" color="primary"
              >REGISTER NEW ACCOUNT</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from "../router";

export default {
  name: "Login",
  data: () => ({
    errors: "",
    email: "",
    password: "",
    emailRules: [
      (v) => !!v || "The email address is mandatory",
      (v) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !v || pattern.test(v) || "Invalid email address";
      },
    ],
    passwordRules: [(v) => !!v || "The password is mandatory"],
    showPassword: false,
    validForm: false,
    loading: false,
  }),
  methods: {
    doLogin() {
      this.errors = "";
      this.loading = true;

      /* Validate the form */
      const form = this.$refs["login"];
      if (!form.validate()) {
        this.loading = false;
        return;
      }

      /* Call the authenticate user method */
      this.$store
        .dispatch("callAuthenticateUser", {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          /* On success redirect to chat view */
          router.push("/");
        })
        .catch((err) => {
          const error = err.response.data.error;
          switch (error) {
            case 702:
              this.errors = "User account not registered";
              break;

            case 1001:
              this.errors = "Invalid user credentials";
              break;

            default:
              this.errors = "Unknow account error. Please try it later.";
              break;
          }
        });
    },
  },
};
</script>
