import AddStoryView from '../../views/AddStoryView.js';
import AddStoryPresenter from '../../presenters/AddStoryPresenter.js';

export default class AddStoryPage {
  constructor() {
    // Buat instance view dan presenter agar dapat diinisialisasi & dibersihkan
    this.view = new AddStoryView();
    this.presenter = new AddStoryPresenter({ view: this.view });
  }

  async render() {
    // Render template form + map
    return this.view.getTemplate();
  }

  async afterRender() {
    // Inisialisasi presenter (map, kamera, geolocation, form handler)
    this.presenter.init();
  }
  
  async cleanup() {
    if (typeof this.presenter.cleanup === 'function') {
      this.presenter.cleanup();
    }
  }
}