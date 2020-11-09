import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import StudentPage from '../views/Student.vue'
import SessionPage from '../views/Session.vue'
import SessionsPage from '../views/Sessions.vue'
import TeacherPage from '../views/Teacher.vue'

import 'leaflet/dist/leaflet.css';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/session/:session_id',
    name: 'Session',
    component: SessionPage
  },
  {
    path: '/session/',
    name: 'Sessions',
    component: SessionsPage
  },
  {
    path: '/session/:session_id/student-recap/:student_id',
    name: 'Student recap',
    component: StudentPage
  },
  {
    path: '/session/:session_id/teacher-recap/',
    name: 'teacher recap',
    component: TeacherPage
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
