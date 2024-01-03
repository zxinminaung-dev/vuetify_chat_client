<template>
    <v-row justify="center" class="align-center  ml-4 mr-4">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-row justify="center" class="mt-4 mb-4">
              <v-avatar>
                <v-icon size="54" color="" icon="mdi-account-circle"></v-icon>
              </v-avatar>
            </v-row>
            <v-row justify="center">
              <h4>Student Management System</h4>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="Login" v-model="isValid">
              <v-row justify="center" class="mt-6">
                <v-col cols="12" md="10" align-self="center">
                  <v-text-field
                    type="text"
                    v-model="user.username"
                    density="compact"
                    label="User Name"
                    dense
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="10" align-self="center" class="mt-n4">
                  <v-text-field
                    v-model="user.password"
                    :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    density="compact"
                    label="Password"
                    dense
                    prepend-inner-icon="mdi-lock-outline"
                    @click:append-inner="show = !show"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <br />
                <v-col cols="12" class="mt-n3 mb-6" md="10"
                  ><v-btn block color="success" type="submit" variant="elevated">
                    Sign In
                  </v-btn></v-col
                >
              </v-row>
              <!-- <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-btn color="success" size="large" type="submit" variant="elevated"
                      >Save</v-btn
                    >
                  </v-col>
                </v-row> -->
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-snackbar v-model="snackbar" :color="color" location="top right" :timeout="timeout">
      {{ text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    </v-row>
</template>
<script>
import authService from "../services/auth/auth.service";
import { socket } from "@/store/socket";
export default {
  data() {
    return {
      show: false,
      isValid: false,
      snackbar: false,
      socket: socket(),
      timeout: 2000,
      color: "",
      text: "",
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    userNameRule(v) {
      return !!v || "User Name is required";
    },

    passwordRule(v) {
      return !!v || "Password is required";
    },
    Login() {
      let vm = this;
      if (vm.isValid) {
        authService.Login(vm.user).then((res) => {
          if (res.success) {           
            vm.$router.push("/");
             this.socket.loggedInUser=res;
          } else {
            vm.snackbar = true;
            vm.color = "red darken,-2";
            vm.text = res.messages[0];
          }
        });
      }
    },
  },
};
</script>