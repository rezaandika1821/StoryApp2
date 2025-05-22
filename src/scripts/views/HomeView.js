const HomeView = {
  getStoryListContainer() {
    return document.querySelector('#storyListContainer');
  },

  getMapElement() {
    return document.querySelector('#map');
  },

  runViewTransition(callback) {
    if (window.document.startViewTransition) {
      window.document.startViewTransition(callback);
    } else {
      callback();
    }
  },
  getTemplate() {
    return `
      <section class="container" aria-label="Halaman Utama">
        <h1>Daftar Cerita</h1>
        <div id="storyListContainer" class="story-list" aria-live="polite">
          <p id="loadingMessage">Memuat data cerita...</p>
        </div>
        <div id="map" style="height: 400px; width: 100%; margin-top: 2rem;" aria-label="Peta lokasi cerita"></div>
      </section>
    `;
  },

  clearLoading(container) {
    container.innerHTML = '';
  },

  renderStories(container, stories, opts = {}) {
    const { offline = false, onDelete } = opts;
    stories.forEach((story) => {
      const card = document.createElement('article');
      card.classList.add('story-card');
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'article');

      card.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" loading="lazy" style="max-width: 100%; border-radius: 8px; margin-bottom: 0.5rem;" />
          <h3 style="margin: 0.5rem 0 0.25rem 0; text-align: center;">${story.name}</h3>
          <p style="text-align: center; margin-bottom: 0.5rem;">${story.description}</p>
          <small style="color: #888;">${new Date(story.createdAt).toLocaleString()}</small>
          ${offline && onDelete ? '<button class="delete-story-btn" data-id="' + story.id + '" style="margin-top:0.75rem; background:#e74c3c; color:#fff; border:none; border-radius:6px; padding:0.4rem 1rem; cursor:pointer;">Hapus</button>' : ''}
        </div>
      `;

      if (offline && onDelete) {
        card.querySelector('.delete-story-btn').onclick = (e) => {
          e.stopPropagation();
          onDelete(story.id);
        };
      }

      card.addEventListener('click', () => {
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            console.log('Transisi halaman cerita (belum implementasi detail)');
          });
        } else {
          console.log('Transisi halaman cerita (belum implementasi detail)');
        }
      });
      container.appendChild(card);
    });
  },

  addStoryMarkers(map, stories) {
    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`
          <strong>${story.name}</strong><br>
          ${story.description}
        `);
      }
    });
  },

  showError(container, message) {
    container.innerHTML = `<p class="error" role="alert">Gagal memuat data. ${message}</p>`;
  }
};

export default HomeView;
