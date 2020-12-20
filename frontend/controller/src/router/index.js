import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import StudentPage from '../views/Student.vue'
import SessionPage from '../views/Session.vue'
import SessionsPage from '../views/Sessions.vue'
import TeacherPage from '../views/Teacher.vue'
import SchoolsPage from '../views/Schools.vue'
import ClassesPage from '../views/Classes.vue'
import StudentSummary from '../views/StudentSummary.vue'
import Tree from '../views/Tree.vue'
import ControlPage from '../views/Control.vue'

import 'leaflet/dist/leaflet.css';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    path: '/schools/',
    name: 'Schools selection',
    component: SchoolsPage
  },
  {
    path: '/schools/:school_id/classes',
    name: 'Class selection',
    component: ClassesPage
  },
  {
    path: '/schools/:school_id/classes/:class_id/sessions',
    name: 'Session selection',
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
  {
    path: '/student-summary/:class_id/:student_id',
    name: 'student summary',
    component: StudentSummary
  },
  {
    path: '/tree',
    name: 'tree',
    component: Tree
  },
  {
      path: '/control',
      name: 'control',
      component: ControlPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
