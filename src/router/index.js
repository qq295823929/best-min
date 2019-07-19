import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login/Login';
import ProjectFile from '@/components/ProjectFile/ProjectFile'
import ProjectDetails from '@/components/ProjectFile/ProjectDetails'
Vue.use(Router)
export default new Router({
  routes: [
      // {path: '/',name: 'HelloWorld', component: HelloWorld},
      {path: '/login',name: 'Login', component: Login},
      {path:'/projectFile',name:'ProjectFile',component:ProjectFile},
      {path:'/projectDetails',name:'ProjectDetails',component:ProjectDetails,}
  ]
})
