export default function AuthHeader(){
    let user=JSON.parse(localStorage.getItem('user'));
    if(user && user.token){
        //if(user.expireDate >= date){
            return {
                Authorization:'Bearer '+user.token
            }
        //}
        // else{
        //     router.push('/login')
        // }
    }else{
        return{};
    }

}