// Utilities
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import User from '../models/user.model'
import LoggedInUser from '@/models/loggedIn.user.model';
const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_API;
export const socket = defineStore('socket', {
    state: () => {
        return {
            socket: null,
            items: [],
            messages: [],
            users: [],
            user: new User(),
            isLogin: false,
            messageList:[],
            loggedInUser: new LoggedInUser(),
            friendshipId:0
        }
    },
    actions: {
        connect() {
            this.socket = io(SOCKET_URL); // Replace with your server address
            this.socket.on('message', (data) => {
                console.log(data)
                if(data.friendShipId == this.friendshipId){
                    var message = this.messageList.filter(x=> x.id == data.id)[0]
                    if(!message){
                        this.messageList.push(data);
                    }                   
                }
            });
            this.socket.on('connect', () => {
                console.log('connection success')
            });
            this.socket.on('online', (data) => {
                this.users= this.users.map(obj => {
                    if (obj.id === data.id) {
                        return { ...obj, online: data.online };
                    }
                    return obj;
                });
                console.log(this.users)
            });
            this.socket.on('disconnected', (data) => {
                console.log('Disconnected ')
            });
        },
        disconnect() {
            if (this.socket) {
                this.socket = null;
                console.log('Disconnected')
            }
        },
    }
})
