import AuthHeader from "../auth/auth.header";
import api from "../api";

class MessageService{
    SendMessage(message){       
        return api.post("/message",message,{headers:AuthHeader()});
    }
    GetMessagesByFriendshipId(id){
        return api.get("/message?id="+id,{headers:AuthHeader()});
    }
}
export default new MessageService()