import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect(){
      return '/home'
    }
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/learn',
    component: () => import('./views/Learn'),
  },
  {
    path: '/student',
    component: () => import('./views/Student'),
  },
  {
    path: '/about/:uerId',
    component: () => import('./views/About'),
  },
  {
    path: '/activity',
    component: () => import('./views/Activity'),
    redirect(){
      return '/activity/study'
    },
    children: [
      {
        path: 'study',
        component: ()=> import('./views/Study')
      },
      {
        path: 'personal',
        component: ()=> import('./views/Personal')
      },
      {
        path: 'download',
        name: 'download',
        component: ()=> import('./views/Download')
      },
    ]
  },
  {
    path: '/question/:id',
    name: 'question',
    component: ()=> import('./views/Question')
  }
];

export default new VueRouter({
  mode: 'history',
  routes,
});