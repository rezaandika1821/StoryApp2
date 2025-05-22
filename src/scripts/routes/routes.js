import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddStoryPage from '../pages/add/add-story-page';

const routes = {
  '/': {
    page: new HomePage(),
    requiresAuth: false,
  },
  '/add': {
    page: new AddStoryPage(),
    requiresAuth: true,
  },
  '/about': {
    page: new AboutPage(),
    requiresAuth: false,
  },
  '/login': {
    page: new LoginPage(),
    requiresAuth: false,
  },
  '/register': {
    page: new RegisterPage(),
    requiresAuth: false,
  },
};

export default routes;
