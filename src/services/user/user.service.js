import AuthHeader from "../auth/auth.header";
import api from "../api";

class UserService{
    GetAll(id){       
        return api.get("/user?id="+id,{headers:AuthHeader()});
    }
    Save(user){
      return api.post("/user",user,{headers:AuthHeader()});
    }
    Delete(id){
      return api.delete("/user?id="+id,{headers:AuthHeader()});
    }
    GetById(id){
      return api.get("/user/getbyid?id="+id,{headers:AuthHeader()});
    }
}
export default new UserService()