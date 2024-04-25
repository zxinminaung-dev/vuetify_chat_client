<template>
  <!-- v-if="store.isLogin" -->
  <v-navigation-drawer
    v-model="sidebar"
    app
    v-if="socket.isLogin"
    position="left"
  >
    <v-list dense>
      <v-list-item class="text-center">
        <p class="font-weight-bold spacing2">WorkStation</p>
      </v-list-item>
      <hr class="mt-2" />
      <v-list-item>
        <v-btn
          block
          variant="tonal"
          color="primary"
          prepend-icon="mdi-plus-circle"
        >
          <template v-slot:prepend>
            <v-icon color="success"></v-icon>
          </template>
          Projects
        </v-btn>
      </v-list-item>
      <v-list-item
        v-for="item in projectList"
        :key="item.id"
        :value="item"
        color="primary"
        :title="item.Name"
        @click="changeSelectedProject(item)"
      >
        <template v-slot:prepend>
          <v-avatar size="20">
            <v-icon size="20" color="" icon="mdi-folder-outline"></v-icon>
          </v-avatar>
        </template>
        <!-- v-if="item.online" -->
        <template v-slot:append>
          <v-icon
            size="23"
            color="green"
            icon="mdi-account-multiple-plus-outline"
            @click="AddMembersClick"
          ></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar fixed app v-if="socket.isLogin" class="fixed-bar">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Project Management System</v-app-bar-title>
    <v-spacer></v-spacer>
    <!--  -->
    <v-menu class="mr-2" v-if="socket.notViewList.length > 0">
      <template v-slot:activator="{ props }">
        <v-btn class="text-none" stacked v-bind="props">
          <v-badge :content="socket.notViewList.length" color="error">
            <v-icon>mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-card width="250">
        <v-list
          density="compact"
          v-for="item in socket.notViewList"
          :key="item.id"
        >
          <v-list-item
            :key="item.id"
            :title="item.name"
            @click="changeUser(item)"
          >
            <template v-slot:prepend>
              <v-avatar size="30">
                <v-img
                  v-if="item.image"
                  :src="item.image"
                  alt="image"
                  cover
                ></v-img>
                <v-icon
                  v-else
                  size="30"
                  color=""
                  icon="mdi-account-circle"
                ></v-icon>
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
              <v-icon
                v-else
                size="45"
                color=""
                icon="mdi-account-circle"
              ></v-icon>
            </v-avatar>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="text-center">{{
            socket.loggedInUser.name
          }}</v-list-item>
          <v-list-item class="text-center">
            <v-btn
              block
              class="mb-2"
              color="primary"
              elevated
              @click="manageAccount"
            >
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

  <v-navigation-drawer location="right" app v-if="socket.isLogin">
    <v-list class="text-center">
      <v-list-item><p class="font-weight-bold spacing2">{{ socket.selectedProject.Name }}</p> </v-list-item>
      <v-list-item>
        <p class="font-weight-bold spacing2">Team Members</p>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item
        v-for="item in projectMembers"
        :key="item.Id"
        color="primary"
        :title="item.Name"
      >
        <template v-slot:prepend>
          <v-avatar size="25">
            <v-icon size="25" color="" icon="mdi-account-circle-outline"></v-icon>
          </v-avatar>
        </template>
        <!-- v-if="item.online" -->
        <template v-slot:append>
          <v-icon
            size="25"
            class="mt-n1"
            icon="mdi-comment"
            @click="messageClick(item)"
          ></v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { socket } from "../../store/socket";
import userService from "../../services/user/user.service";
import projectService from "../../services/project/project.service";
import authService from "@/services/auth/auth.service";
import projectMemberService from '../../services/project/project.member.service'
export default {
  name: "NavigationDrawer",
  components: {},
  data() {
    return {
      showNavbar: true,
      sidebar: true,
      dialog: false,
      socket: socket(),
      valid: false,
      projectList: [],
      deviceWidth: window.innerWidth,
      showNoti: false,
      projectMembers:[]
    };
  },
  watch: {
    "socket.loggedInUser"(val) {
      this.GetProjectList();
    },
    "socket.selectedProject"(val){
      this.GetProjectMembers(val.Id)
    },
    "socket.newMessage"(val) {
      if (
        val.to == this.socket.loggedInUser.id &&
        val.from != this.socket.user.id
      ) {
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
    this.GetProjectList();
  },
  mounted() {
    window.addEventListener("resize", this.updateDeviceWidth);
  },
  beforeMount() {},
  methods: {
    GetProjectList() {
      projectService.GetAll().then((res) => {
        this.projectList = res.data.data;
        this.socket.selectedProject = this.projectList[0];
      });
    },
    manageAccount() {},
    AddNewMessageUser(id) {
      if (id > 0) {
        userService.GetById(id).then((res) => {
          var user = this.socket.notViewList.filter(
            (x) => x.id == res.data.id
          )[0];
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
    changeSelectedProject(project) {
      this.socket.selectedProject = project;
    },
    GetProjectMembers(id){
      projectMemberService.GetProjectMembers(id).then((res)=>{
        this.socket.teamMembers = res.data.data
        this.projectMembers = res.data.data        
      })
    },
    messageClick(user){
      alert(this.socket.selectedProject.Name+" "+user.Name)
    },
    AddMembersClick(){
      alert('add members')
    }
  },
  computed: {},
};
</script>
<style></style>
