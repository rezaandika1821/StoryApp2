import HomePresenter from '../../presenters/HomePresenter';
import HomeView from '../../views/HomeView';

export default class HomePage {
  async render() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.hash = '/login';
      return '';
    }

    return HomeView.getTemplate();
  }

  async afterRender() {
    await HomePresenter.init();
  }
}
