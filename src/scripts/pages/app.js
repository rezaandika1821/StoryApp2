import routes from '../routes/routes.js';
import { getActiveRoute } from '../routes/url-parser.js';
import { withViewTransition } from '../utils/view-transition.js';
import { subscribePushNotification, unsubscribePushNotification, isPushSubscribed } from '../utils/push-notification.js';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._insertSkipLink();
    this._setupDrawer();
    this._setupRouter();
    this._setupPushNotificationUI();

    // Render halaman pertama kali (jika belum ada hash, paksa ke home)
    if (!window.location.hash) {
      window.location.hash = '#/';
    }
  }

  _insertSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to content';
    skipLink.classList.add('skip-to-content');

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  _setupRouter() {
    window.addEventListener('hashchange', () => this.renderPage());
    window.addEventListener('load', () => this.renderPage());
  }

  async renderPage() {
    try {
      // Cleanup halaman sebelumnya jika ada
      if (this.#currentPage && typeof this.#currentPage.cleanup === 'function') {
        await this.#currentPage.cleanup();
      }

      const url = getActiveRoute();
      const route = routes[url] || null;

      if (!route) {
        this.#content.innerHTML = '<p>Halaman tidak ditemukan</p>';
        this.#currentPage = null;
        return;
      }

      const isLoggedIn = !!localStorage.getItem('accessToken');

      if (route.requiresAuth && !isLoggedIn) {
        window.location.hash = '#/login';
        this.#currentPage = null;
        return;
      }

      this._updateNav(isLoggedIn);

      this.#currentPage = route.page;

      const renderContent = async () => {
        this.#content.innerHTML = await route.page.render();
        if (typeof route.page.afterRender === 'function') {
          await route.page.afterRender();
        }

        // Fokuskan ke main content untuk pengguna keyboard
        const mainEl = document.querySelector('#main-content');
        if (mainEl) {
          mainEl.setAttribute('tabindex', '-1');
        }
      };

      // Jika browser mendukung View Transitions API
      await withViewTransition(async () => {
        await renderContent();
      });

    } catch (error) {
      console.error('Error saat merender halaman:', error);
      this.#content.innerHTML = '<p>Terjadi kesalahan saat memuat halaman.</p>';
      this.#currentPage = null;
    }
  }
  // Simpan referensi halaman saat ini untuk cleanup
  #currentPage = null;

  _updateNav(isLoggedIn) {
    const loginLink = document.querySelector('#loginLink');
    const logoutButton = document.querySelector('#logoutButton');
    const addStoryLink = document.querySelector('#addStoryLink');

    // Push Notification button
    let notifBtn = document.querySelector('#pushNotifBtn');
    if (!notifBtn) {
      notifBtn = document.createElement('button');
      notifBtn.id = 'pushNotifBtn';
      notifBtn.type = 'button';
      notifBtn.className = 'subscribe';
      notifBtn.textContent = 'Subscribe Notifikasi';
      const navList = document.querySelector('#nav-list');
      // Insert before logout button for better alignment
      const logoutLi = document.querySelector('#logoutButton')?.parentElement;
      if (navList && logoutLi) {
        navList.insertBefore(notifBtn, logoutLi);
      } else if (navList) {
        navList.appendChild(notifBtn);
      }
    }
    notifBtn.style.display = isLoggedIn ? 'inline-block' : 'none';

    if (loginLink) loginLink.style.display = isLoggedIn ? 'none' : 'inline-block';
    if (addStoryLink) addStoryLink.style.display = isLoggedIn ? 'inline-block' : 'none';
    if (logoutButton) logoutButton.style.display = isLoggedIn ? 'inline-block' : 'none';

    if (logoutButton) {
      logoutButton.onclick = () => {
        localStorage.removeItem('accessToken');
        window.location.hash = '#/login';
      };
    }
    if (notifBtn) {
      notifBtn.onclick = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        if (await isPushSubscribed()) {
          await unsubscribePushNotification(token);
          notifBtn.textContent = 'Subscribe Notifikasi';
          notifBtn.classList.remove('unsubscribe');
          notifBtn.classList.add('subscribe');
          alert('Notifikasi dinonaktifkan');
        } else {
          await subscribePushNotification(token);
          notifBtn.textContent = 'Unsubscribe Notifikasi';
          notifBtn.classList.remove('subscribe');
          notifBtn.classList.add('unsubscribe');
          alert('Notifikasi diaktifkan!');
        }
      };
      // Set initial state
      isPushSubscribed().then((subscribed) => {
        if (subscribed) {
          notifBtn.textContent = 'Unsubscribe Notifikasi';
          notifBtn.classList.remove('subscribe');
          notifBtn.classList.add('unsubscribe');
        } else {
          notifBtn.textContent = 'Subscribe Notifikasi';
          notifBtn.classList.remove('unsubscribe');
          notifBtn.classList.add('subscribe');
        }
      });
    }
  }

  _setupPushNotificationUI() {
    // Ensure push notif button is present on first load
    this._updateNav(!!localStorage.getItem('accessToken'));
  }
}

export default App;
