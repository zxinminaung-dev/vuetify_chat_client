<template>
    <v-bottom-navigation v-if="socket.isLogin" app>
        <v-col cols="12" md="12">
            <input ref="fileInput" type="file" style="display: none" @change="onFileChange()"
                accept="image/png, image/jpeg, image/jpg" />
            <v-list-item class="text-left mt-n3">
                <v-text-field v-model="text" variant="underlined" prepend-icon="mdi-paperclip" append-icon="mdi-send"
                    @click:prepend="openFileInput()" @click:append="sendMessage"></v-text-field>
            </v-list-item>
        </v-col>

    </v-bottom-navigation>
</template>
<script>
import Message from '../../models/message.model'
import { socket } from '@/store/socket';
import messageService from '@/services/message/message.service';
export default {
    data() {
        return {
            socket: socket(),
            text: '',
            message: new Message(),
            selectFile: false,
            imageString: '',
        }
    },
    watch: {

    },
    created() {

    },
    methods: {
        sendMessage() {
            this.message.from = this.socket.loggedInUser.id
            this.message.to = this.socket.user.id
            this.message.friendshipId = this.socket.friendshipId
            if (this.selectFile) {
                this.message.text = this.imageString
                this.message.isImage = true
            } else {
                this.message.text = this.text
                this.message.isImage = false
            }
            if (this.message.text) {
                messageService.SendMessage(this.message).then((res) => {
                    console.log(res)
                    if (res.status == 200) {
                        this.selectFile = false
                        this.isImage = false
                        this.text = ''
                    }

                })
            }

        },
        openFileInput(index) {
            // Programmatically trigger a click on the hidden file input
            this.$refs.fileInput.click();
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
                    this.imageString = base64String;
                };
                reader.readAsDataURL(selectedFile);
                this.text = selectedFile.name;
                this.selectFile = true;
                // Perform actions with the selected file, e.g., upload or process
            }

        },
    },
}
</script>
