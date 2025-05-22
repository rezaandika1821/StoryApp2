import AboutView from '../../views/AboutView.js';

export default class AboutPage {
  constructor() {
    this.view = new AboutView();
  }
  async render() {
    return this.view.getTemplate();
  }
  async afterRender() {
    
  }
}
