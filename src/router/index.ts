import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../components/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/employees',
      name: 'Employees',
      component: () => import('../views/EmployeesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/employees/:id',
      name: 'EmployeeDetail',
      component: () => import('../views/EmployeeDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/departments',
      name: 'Departments',
      component: () => import('../views/DepartmentsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/positions',
      name: 'Positions',
      component: () => import('../views/PositionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/payroll',
      name: 'Payroll',
      component: () => import('../views/PayrollView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/payroll/periods/:id',
      name: 'PayrollPeriod',
      component: () => import('../views/PayrollPeriodView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/currencies',
      name: 'Currencies',
      component: () => import('../views/CurrenciesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    // Try to fetch user profile if token exists but user is not loaded
    if (authStore.token && !authStore.user) {
      try {
        await authStore.fetchProfile();
      } catch (error) {
        // Token is invalid, redirect to login
        authStore.logout();
        next('/login');
        return;
      }
    }
    next();
  }
});

export default router;
