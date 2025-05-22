import RegisterView from '../../views/RegisterView.js';
import RegisterPresenter from '../../presenters/RegisterPresenter.js';

export default class RegisterPage {
  constructor() {
    // simpan instance view supaya presenter bisa akses elemen‑elemen-nya
    this.view = new RegisterView();
  }

  async render() {
    // kembalikan HTML form registrasi
    return this.view.getTemplate();
  }

  async afterRender() {
    // inisialisasi presenter (binding form submit, dsb.)
    const presenter = new RegisterPresenter({ view: this.view });
    presenter.init();
  }
}
