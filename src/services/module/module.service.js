import AuthHeader from "../auth/auth.header";
import api from "../api";

class ModuleService{
    GetModules(id){       
        return api.get("/project/getmembers?id="+id,{headers:AuthHeader()});
    }
}
export default new ModuleService()