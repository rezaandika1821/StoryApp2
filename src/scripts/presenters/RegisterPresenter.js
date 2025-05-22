import API from '../data/api';
import Swal from 'sweetalert2';

export default class RegisterPresenter {
  constructor({ view }) {
    this.view = view;
  }

  init() {
    this._bindFormSubmit();
  }


  _bindFormSubmit() {
    const form = this.view.getFormElement();
    form.addEventListener('submit', (e) => this._handleSubmit(e));
  }

  async _handleSubmit(event) {
    event.preventDefault();
    this.view.setSubmitButtonDisabled(true);

    const { name, email, password } = this.view.getFormValues();

    try {
      await API.register({ name, email, password });
      Swal.fire('Sukses!', 'Registrasi berhasil. Silakan login.', 'success');
      this.view.navigateToLogin();
    } catch (err) {
      Swal.fire('Gagal', err.message || 'Terjadi kesalahan.', 'error');
      this.view.setSubmitButtonDisabled(false);
    }
  }
}
