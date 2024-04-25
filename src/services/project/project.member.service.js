import AuthHeader from "../auth/auth.header";
import api from "../api";

class ProjectMemberService{
    GetProjectMembers(id){       
        return api.get("/project/getmembers?id="+id,{headers:AuthHeader()});
    }
}
export default new ProjectMemberService()