// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { socket } from '@/store/socket'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
const routes = [
  {
    path: '',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
router.beforeEach((to,from) => {
  const store = socket();
  const routeName ="Login"
  const singUp = "SignUp"
  const loggedIn = localStorage.getItem('user');
  console.log(loggedIn)
  
  console.log(to)
  if(to.name===routeName){
    store.isLogin=false;
    localStorage.removeItem('user');
  }
  else if(to.name===singUp){
    store.isLogin=false;
    localStorage.removeItem('user');
  }
  else{
    console.log('Heere')
    if(!loggedIn){
      store.isLogin=false;
        router.push({name:'Login'});
    }
    else{
      store.isLogin=true;    
      if(store.loggedInUser.id==0){    
        var userdata= JSON.parse(loggedIn)    
        store.loggedInUser.id=userdata.id
        store.loggedInUser.name=userdata.name
        store.loggedInUser.username=userdata.username
      }
    }
  }
  
});
export default router
