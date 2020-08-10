<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Register user account</v-toolbar-title>
          </v-toolbar>
          <v-card-text v-if="errors.length > 0" class="pb-0">
            <v-alert type="error">
              {{ errors }}
            </v-alert>
          </v-card-text>
          <v-card-text>
            <v-form onSubmit="return false;" ref="register" v-model="validForm">
              <v-text-field
                name="name"
                autocomplete="name"
                :rules="nameRules"
                v-model="name"
                type="text"
                label="User full name *"
                prepend-icon="mdi-badge-account"
              ></v-text-field>
              <v-text-field
                name="about"
                autocomplete="about"
                :rules="aboutRules"
                v-model="about"
                type="text"
                label="About me"
                prepend-icon="mdi-information"
              ></v-text-field>
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
                @keyup.enter="doRegister"
                @click:append="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi mdi-eye' : 'mid mdi-eye-off'"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn :disabled="!validForm" color="primary" @click="doRegister"
              >REGISTER</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn text link to="/login" color="primary"
              >LOGIN INTO ACCOUNT</v-btn
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
  name: "Register",
  data: () => ({
    errors: "",
    name: "",
    about: "",
    email: "",
    password: "",
    nameRules: [(v) => !!v || "The user name is mandatory"],
    aboutRules: [
      (v) => !v || v.length < 100 || "About me only support 100 characters",
    ],
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
    doRegister() {
      this.errors = "";
      this.loading = true;

      /* Validate the form */
      const form = this.$refs["register"];
      if (!form.validate()) {
        this.loading = false;
        return;
      }

      /* Call the authenticate user method */
      this.$store
        .dispatch("callRegister", {
          name: this.name,
          about: this.about,
          email: this.email,
          password: this.password,
        })
        .then(() => {
          /* Show success notification */
          this.$snotify.success(
            "User account registered successfully. Now you can access and chat",
            {
              timeout: 10000,
              showProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
            }
          );

          /* On success redirect to chat view */
          router.push("/login");
        })
        .catch((err) => {
          const error = err.response.data.error;
          switch (error) {
            case 703:
              this.errors = "There is an user registered with this email";
              break;

            default:
              this.errors =
                "Unknow account registration error. Please try it later.";
              break;
          }
        });
    },
  },
};
</script>
