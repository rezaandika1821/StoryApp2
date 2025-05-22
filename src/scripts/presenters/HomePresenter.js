// File: src/scripts/presenters/HomePresenter.js
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fixLeafletIcons } from '../utils/fixLeafletIcons';

import API from '../data/api.js';
import HomeView from '../views/HomeView.js';
import { saveStories as saveStoriesIDB, getAllStories as getAllStoriesIDB, deleteStory as deleteStoryIDB } from '../utils/idb-helper.js';

const HomePresenter = {
  async init() {
    fixLeafletIcons();
    const container = HomeView.getStoryListContainer();
    const mapElement = HomeView.getMapElement();
    let map = null;

    // Helper untuk render offline stories
    async function renderOfflineStories() {
      const offlineStories = await getAllStoriesIDB();
      HomeView.clearLoading(container);
      HomeView.renderStories(container, offlineStories, {
        offline: true,
        onDelete: async (id) => {
          await deleteStoryIDB(id);
          renderOfflineStories();
        },
      });
    }

    // Cek koneksi
    if (!navigator.onLine) {
      await renderOfflineStories();
      return;
    }

    try {
      const stories = await API.getAllStories();
      // Simpan ke IndexedDB untuk offline
      await saveStoriesIDB(stories);

      const renderContent = () => {
        HomeView.clearLoading(container);
        HomeView.renderStories(container, stories);
      };
      HomeView.runViewTransition(renderContent);

      // Inisialisasi peta
      map = L.map(mapElement).setView([-2.5489, 118.0149], 4);
      const baseOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      });
      const baseTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap contributors',
      });
      baseOSM.addTo(map);
      L.control.layers(
        { 'OpenStreetMap': baseOSM, 'OpenTopoMap': baseTopo },
        {},
        { collapsed: false }
      ).addTo(map);
      HomeView.addStoryMarkers(map, stories);
    } catch (error) {
      // Jika gagal fetch API, tampilkan data offline
      await renderOfflineStories();
      if (map) map.remove();
    }
  },
};

export default HomePresenter;
