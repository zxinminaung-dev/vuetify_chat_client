import api from "../api";
import AuthHeader from "./auth.header";
class AuthService {
  Login(user) {
    //console.log(user)
    return api.post('/auth/login', user)
      .then(res => {
        if (res.data.token) {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
        return res.data;
      });
  }
  Logout(id) {
    return api.post("/auth/logout?id="+id,{headers:AuthHeader()});
  }
}
export default new AuthService();