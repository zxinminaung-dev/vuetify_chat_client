<template>
  <!-- v-if="store.isLogin" -->

  <v-app-bar fixed app v-if="socket.isLogin" class="fixed-bar">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Messenger App</v-app-bar-title>
    <v-spacer></v-spacer>
    <!-- <v-badge content="socket.count" color="error" class="mr-3">
      <v-icon>mdi-account-school</v-icon>
    </v-badge> -->
    <v-menu class="mr-2">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" density="comfortable" icon="mdi-account-circle"> </v-btn>
      </template>
      <v-card width="250">
        <v-list density="compact">
          <v-list-item class="mt-2 text-center">
            <v-avatar>
              <v-icon size="35" color="" icon="mdi-account-circle"></v-icon>
            </v-avatar>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="text-center">{{ socket.loggedInUser.name }}</v-list-item>
          <v-list-item class="text-center">
            <v-btn class="mb-2" density="comfortable" @click="Logout">
              Logout
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
  <v-navigation-drawer v-model="sidebar" app v-if="socket.isLogin" position="left">
    <v-list density="compact" v-for="item in socket.users" :key="item">
      <v-list-item v-if="socket.loggedInUser.id != item.id" prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
        @click="changeUser(item)" :title="item.name">
        <!-- v-if="item.online" -->
        <template v-slot:append>
          <v-icon v-if="item.online" class="mt-n1" size="12" color="green" icon="mdi-circle"></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-navigation-drawer location="right" app v-if="socket.isLogin">
    <v-list class="text-center">
      <v-list-item>
        <v-avatar size="69">
          <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John"></v-img>
        </v-avatar>
      </v-list-item>
      <v-list-item :title="socket.user.name">
      </v-list-item>
      <v-divider></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapState } from "pinia";
import { socket } from "../../store/socket";
import userService from "../../services/user/user.service";
import authService from "@/services/auth/auth.service";
export default {
  name: "NavigationDrawer",
  components: {},
  data() {
    return {
      appTitle: "Awesome App",
      showNavbar: true,
      sidebar: true,
      dialog: false,
      socket: socket(),
      valid: false,
      deviceWidth: window.innerWidth,
    };
  },
  watch: {
    'socket.loggedInUser'(val) {
      this.GetUserList();
    }
  },
  created() {
    if (!this.socket.loggedInUser.id > 0) {
      var user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        this.socket.loggedInUser.id = user.id;
        this.socket.loggedInUser.name = user.name;
        this.socket.loggedInUser.username = user.username
      }

    }
    this.GetUserList();
  },
  mounted() {
    // this.socket.connect();
    window.addEventListener("resize", this.updateDeviceWidth);
    // this.context = this.$refs.whiteboardCanvas.getContext("2d");
  },
  beforeMount() {
    // this.socket.disconnect();
  },
  methods: {
    GetUserList() {
      this.socket.users = []
      userService.GetAll(this.socket.loggedInUser.id).then((res) => {
        this.socket.users = res.data.data;
        this.socket.user = res.data.data[0];
      });
    },
    Logout(){
      authService.Logout(this.socket.loggedInUser.id).then((res)=>{
          if(res.status==200){
            this.$router.push("/login");
          }
      })
    },
    updateDeviceWidth() {
      this.deviceWidth = window.innerWidth;
      if (this.deviceWidth > 1000) {
        this.canvasWidth = 900;
      } else if (this.deviceWidth > 600) {
        this.canvasWidth = 600;
      } else {
        this.canvasWidth = 350;
      }
    },
    updateparent(val) {
      this.valid = val;
    },
    showNav() {
      // Check if the current route is not the login route
      this.showNavBar = this.$route.name !== "login" ? ture : false;
    },
    changeUser(user) {
      this.socket.user = user;
    },
  },
  computed: {
    ...mapState[(socket, ["count,message,item,socket,messages"])],
  },
};
</script>
<style></style>
