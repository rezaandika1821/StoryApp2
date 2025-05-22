
import LoginView from '../views/LoginView';
import API from '../data/api';

const LoginPresenter = {
  init() {
    const token = localStorage.getItem('accessToken');

    if (token) {
      LoginView.navigateToHome();
      return;
    }

    const loginForm = LoginView.getFormElement();
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      LoginView.showErrorMessage('');
      LoginView.setSubmitButtonDisabled(true);
      LoginView.setSubmitButtonText('Logging in...');

      const { email, password } = LoginView.getFormValues();

      try {
        const loginResult = await API.login({ email, password });
        const token = loginResult?.token;
        if (!token) throw new Error('Token tidak ditemukan dalam response login.');

        localStorage.setItem('accessToken', token);
        LoginView.navigateToHome();
      } catch (error) {
        console.error('Login error:', error);
        LoginView.showErrorMessage(error.message || 'Terjadi kesalahan saat login.');
      } finally {
        LoginView.setSubmitButtonDisabled(false);
        LoginView.setSubmitButtonText('Login');
      }
    });
  },
};

export default LoginPresenter;