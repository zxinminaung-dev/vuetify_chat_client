<template>
  <v-row justify="center" class="align-center ml-4 mr-4">
    <v-col cols="12" md="4">
      <v-card>
        <v-card-title>
          <v-row justify="center" class="mt-4 mb-4">
            <v-avatar>
              <v-img v-if="isHasImage"
                :src="user.image"
                alt="image"
                cover
              ></v-img>
              <v-icon v-else size="54" color="" icon="mdi-account-circle"></v-icon>
            </v-avatar>
          </v-row>
          <v-row justify="center">
            <h4>Chat Application</h4>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="SignUp" v-model="isValid">
            <v-row justify="center" class="mt-6">
              <v-col cols="12" md="10" align-self="center">
                <v-text-field
                  type="text"
                  v-model="user.name"
                  density="compact"
                  label="Name"
                  dense
                  required
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  :rules="nameRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="10" align-self="center" class="mt-n4">
                <v-text-field
                  type="text"
                  v-model="user.username"
                  density="compact"
                  label="User Name"
                  required
                  dense
                  prepend-inner-icon="mdi-account-outline"
                  :rules="userNameRules"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="10" align-self="center" class="mt-n4">
                <v-text-field
                  v-model="user.password"
                  required
                  :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  density="compact"
                  label="Password"
                  :counter="6"
                  :rules="passwordRules"
                  dense
                  prepend-inner-icon="mdi-lock-outline"
                  @click:append-inner="show = !show"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="10" align-self="center" class="mt-n4">
                <input
                  ref="fileInput"
                  type="file"                  
                  style="display: none"
                  @change="onFileChange()"
                  accept="image/png, image/jpeg, image/jpg"
                />
                <v-text-field
                v-model="text"
                density="compact"
                variant="outlined"
                prepend-inner-icon="mdi-paperclip"
                @click="openFileInput()"
                required 
                :rules="imageRules"
              ></v-text-field>
              </v-col>
              <br />
              <v-col cols="12" class="mt-n3 mb-6" md="10"
                ><v-btn block color="success" type="submit" variant="elevated">
                  Sign Up
                </v-btn></v-col
              >
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
    <v-snackbar v-model="snackbar" :color="color" location="top right" :timeout="timeout">
      {{ message }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog
      v-model="modal"
      persistent
      width="auto"
    >
      <v-card >
        <v-card-title class="text-center" color="success">Success SignUp</v-card-title>
        <v-card-text>
          <v-btn block color="primary" variant="elevated" @click="Login">
                 Go To Login Page
                </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import authService from "../services/auth/auth.service";
import userService from "../services/user/user.service";
import { socket } from "@/store/socket";
export default {
  data() {
    return {
      show: false,
      isValid: false,
      snackbar: false,
      socket: socket(),
      timeout: 2000,
      isHasImage:false,
      message:"",
      color: "",
      text: "",
      modal:false,
      user: {
        name: "",
        username: "",
        password: "",
        image: "",
        online: false,       
      },
      nameRules: [
        v => !!v || 'Name is required',
      ],
      userNameRules: [
        v => !!v || 'User Name is required',
      ],
      imageRules: [
        v => !!v || 'User Photo is required',
      ],
      passwordRules: [
        v => (v && v.length > 6) || 'Name must be at least 6 characters',
      ],
    };
  },
  methods: {
    openFileInput(){
      this.$refs.fileInput.click();
    },
    Login(){
      this.$router.push({name:'Login'})
    },
    onFileChange() {
      // Handle the file change event
      const reader = new FileReader();
      const fileInput = this.$refs.fileInput;
      const selectedFile = fileInput.files[0];
      if (selectedFile) {
        reader.onload = () => {
          // reader.result contains the Base64-encoded string
          const base64String = reader.result;
          // console.log(`Base64 string for item  :`, base64String);
          this.user.image = base64String;
        };
        reader.readAsDataURL(selectedFile);
        this.text = selectedFile.name;
        this.isHasImage = true;
        // Perform actions with the selected file, e.g., upload or process
      }
    },
    SignUp() {
      let vm = this;
      if (vm.isValid) {
        userService.Save(vm.user).then((res) => {
          if(res.data.success){
            this.modal=true,
            this.user={}
          }else{
            this.snackbar=true;
            this.color = "red darken-2";
            this.message = res.data.messages[0];
          }          
        });
      }
    },
  },
};
</script>
