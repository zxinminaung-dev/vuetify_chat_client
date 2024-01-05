<template>
  <!-- v-if="store.isLogin" -->

  <v-app-bar fixed app v-if="socket.isLogin" class="fixed-bar">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Messenger App</v-app-bar-title>
    <v-spacer></v-spacer>
    <!--  -->
    <v-menu class="mr-2" v-if="socket.notViewList.length > 0" >
      <template v-slot:activator="{ props }">
        <v-btn class="text-none" stacked v-bind="props">
          <v-badge :content="socket.notViewList.length" color="error">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-card width="250">
        <v-list density="compact" v-for="item in socket.notViewList">
          <v-list-item :key="item.id" :title="item.name" @click="changeUser(item)">
            <template v-slot:prepend>
              <v-avatar size="30">
                <v-img v-if="item.image" :src="item.image" alt="image" cover></v-img>
                <v-icon v-else size="30" color="" icon="mdi-account-circle"></v-icon>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <v-menu class="mr-2">
      <template v-slot:activator="{ props }">
        <v-avatar size="30" v-bind="props" class="mr-3">
          <v-img
            v-if="socket.loggedInUser.image"
            :src="socket.loggedInUser.image"
            alt="image"
            cover
          ></v-img>
          <v-icon v-else size="30" color="" icon="mdi-account-circle"></v-icon>
        </v-avatar>
      </template>
      <v-card width="250">
        <v-list density="compact">
          <v-list-item class="mt-2 text-center">
            <v-avatar size="45">
              <v-img
                v-if="socket.loggedInUser.image"
                :src="socket.loggedInUser.image"
                alt="image"
                cover
              ></v-img>
              <v-icon v-else size="45" color="" icon="mdi-account-circle"></v-icon>
            </v-avatar>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="text-center">{{ socket.loggedInUser.name }}</v-list-item>
          <v-list-item class="text-center">
            <v-btn block class="mb-2" color="primary" elevated @click="manageAccount">
              Manage Account
            </v-btn>
          </v-list-item>
          <v-list-item class="text-center">
            <v-btn
              class="mb-2"
              append-icon="mdi-logout"
              density="comfortable"
              @click="Logout"
            >
              Logout
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
  <v-navigation-drawer v-model="sidebar" app v-if="socket.isLogin" position="left">
    <v-list dense>
      <v-list-item
      v-for="(item, i) in socket.users" 
        :key="item"
        :value="item"
        color="primary"
        :title="item.name"
        @click="changeUser(item)"
      >
        <template v-slot:prepend>
          <v-avatar size="35">
            <v-img v-if="item.image" :src="item.image" alt="image" cover></v-img>
            <v-icon v-else size="35" color="" icon="mdi-account-circle"></v-icon>
          </v-avatar>
        </template>
        <!-- v-if="item.online" -->
        <template v-slot:append>
          <v-icon
            v-if="item.online"
            class="mt-n1"
            size="12"
            color="green"
            icon="mdi-circle"
          ></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-navigation-drawer location="right" app v-if="socket.isLogin">
    <v-list class="text-center">
      <v-list-item>
        <v-avatar size="60">
          <v-img
            v-if="socket.user.image"
            :src="socket.user.image"
            alt="image"
            cover
          ></v-img>
          <v-icon v-else size="60" color="" icon="mdi-account-circle"></v-icon>
        </v-avatar>
      </v-list-item>
      <v-list-item>{{ socket.user.name }} </v-list-item>
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
      showNoti: false,
    };
  },
  watch: {
    "socket.loggedInUser"(val) {
      this.GetUserList();
    },
    "socket.newMessage"(val) {
      if (val.to == this.socket.loggedInUser.id && val.from != this.socket.user.id) {
        this.AddNewMessageUser(val.from);
      }
    },
  },
  created() {
    if (!this.socket.loggedInUser.id > 0) {
      var user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.socket.loggedInUser.id = user.id;
        this.socket.loggedInUser.name = user.name;
        this.socket.loggedInUser.username = user.username;
        this.socket.loggedInUser.image = user.image;
      }
    }
    this.GetUserList();
  },
  mounted() {
    window.addEventListener("resize", this.updateDeviceWidth);
  },
  beforeMount() {},
  methods: {
    GetUserList() {
      this.socket.users = [];
      userService.GetAll(this.socket.loggedInUser.id).then((res) => {
        this.socket.users = res.data.data;
        if(res.data.data.length>0){
          this.socket.user = res.data.data[0];
        }
        
      });
    },
    manageAccount() {},
    AddNewMessageUser(id) {
      if (id > 0) {
        userService.GetById(id).then((res) => {
          var user = this.socket.notViewList.filter((x) => x.id == res.data.id)[0];
          if (!user) {
            this.socket.notViewList.push(res.data);
          }
        });
      }
    },
    Logout() {
      authService.Logout(this.socket.loggedInUser.id).then((res) => {
        if (res.status == 200) {
          this.$router.push("/login");
        }
      });
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
      var notViewuser = this.socket.notViewList.filter((x) => x.id == user.id);
      if (notViewuser) {
        this.socket.notViewList.pop(user);
      }
    },
  },
  computed: {},
};
</script>
<style></style>
