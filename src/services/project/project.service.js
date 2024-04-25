import AuthHeader from "../auth/auth.header";
import api from "../api";

class ProjectService{
    GetAll(id){       
        return api.get("/project",{headers:AuthHeader()});
    }
}
export default new ProjectService()