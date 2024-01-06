<template>
  <v-container fluid>
    <v-dialog v-model="dialog" persistent width="auto">
      <v-card>
        <v-card-text>
          <v-progress-circular indeterminate color="amber"></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-list
      density="compact"
      v-for="item in socket.messageList"
      :key="item"
      v-chat-scroll
      class="messages"
    >
      <v-list-item class="text-left mt-n4" v-if="item.to != socket.user.id">
        <v-row>
          <v-col cols="12" md="6" sm="8">
            <v-card-text class="ml-n3">From - {{ socket.user.name }}</v-card-text>
            <v-card color="primary" class="mt-n3" v-if="!item.isImage">
              <v-card-text>{{ item.text }}</v-card-text>
            </v-card>
            <v-card
              v-else
              class="mx-auto"
              max-width="300"
              height="200"
              :image="item.text"
              theme="dark"
            ></v-card>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item class="text-left mt-n4" v-else>
        <v-row justify="end">
          <v-col cols="12" md="6" sm="8">
            <v-card-text class="ml-n3">You</v-card-text>
            <v-card color="success" class="mt-n3" v-if="!item.isImage">
              <v-card-text>{{ item.text }}</v-card-text>
            </v-card>
            <v-card
              v-else
              class="mx-auto"
              max-width="300"
              height="200"
              :image="item.text"
              theme="dark"
            ></v-card>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import { socket } from "@/store/socket";
import friendShipService from "../services/friendship/friendship.service";
import messageService from "../services/message/message.service";
import Message from "../models/message.model";
export default {
  data() {
    return {
      socket: socket(),
      text: "",
      message: new Message(),
      selectFile: false,
      imageString: "",
      cardHeight: 0,
      dialog: false,
    };
  },
  created() {},
  watch: {
    "socket.user"(val) {
      if (val) {
        this.GetFriendShip(val.id);
      }
    },
  },
  created(){
    this.GetFriendShip(this.socket.user.id)
  },
  methods: {
    GetFriendShip(user_id) {
      this.dialog = true;
      this.socket.messageList = [];
      if(this.socket.loggedInUser && user_id){
        friendShipService.Get(this.socket.loggedInUser.id, user_id).then((res) => {
        this.socket.friendshipId = res.data.data.id;
        if (this.socket.friendshipId > 0) {
          messageService
            .GetMessagesByFriendshipId(this.socket.friendshipId)
            .then((res) => {
              
              this.socket.messageList = res.data.data;
            });
        }
      });
      }    
      this.dialog = false;  
    },
    GetMesssages() {},
  },
  mounted() {
    window.addEventListener("resize", this.updateDeviceWidth);
  },
  updated() {
    console.log("update");
  },
  beforeMount() {
  },
};
</script>

<style>
#scrollable {
  display: flex;
  flex-direction: column-reverse;
  overflow-y: scroll;
  height: 300px;
}
</style>
