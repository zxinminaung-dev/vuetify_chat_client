import AuthHeader from "../auth/auth.header";
import api from "../api";

class FriendshipService{
    Get(from,to){       
        return api.get("/friendship?from="+from+"&&to="+to,{headers:AuthHeader()});
    }
}
export default new FriendshipService()