import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './views/Home';
import Users from '@/views/Users';
import UserContent from '@/views/UserContent';
import Documents from '@/views/Documents';
import DocumentContent from '@/views/DocumentContent';
import Logon from '@/views/Logon';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/logon',
    name: 'Logon',
    component: Logon,
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
  },
  {
    path: '/users/:id',
    name: 'UserContent',
    component: UserContent,
  },
  {
    path: '/docs/:type',
    name: 'Docs',
    component: Documents,
  },
  {
    path: '/docs/:type/:id',
    name: 'DocumentContent',
    component: DocumentContent,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
