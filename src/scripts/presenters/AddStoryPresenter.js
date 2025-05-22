import L from 'leaflet';
import { fixLeafletIcons } from '../utils/fixLeafletIcons';
import API from '../data/api';
import Swal from 'sweetalert2';

export default class AddStoryPresenter {
  constructor({ view }) {
    this.view = view;
    this.map = null;
    this.marker = null;
    this.selectedLat = null;
    this.selectedLon = null;
    this.capturedPhoto = null;
    this.stream = null;
  }

  init() {
    this.view.initializeElements();
    fixLeafletIcons();
    this._initMap();
    this._bindFormSubmit();
    this._bindCameraEvents();
  }

  _initMap() {
    this.map = L.map(this.view.getMapContainer()).setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e) => {
      this.selectedLat = e.latlng.lat;
      this.selectedLon = e.latlng.lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }

      this.view.setLocationInfo(`Lokasi dipilih: ${this.selectedLat.toFixed(4)}, ${this.selectedLon.toFixed(4)}`);
    });
  }

  _bindCameraEvents() {
    this.view.onUseCameraClick(async () => {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.view.showStream(this.stream);
        this.capturedPhoto = null;
        this.view.hideSnapshot();
      } catch {
        Swal.fire('Error', 'Tidak dapat mengakses kamera.', 'error');
      }
    });

    this.view.onCaptureClick(() => {
      const video = this.view.getCameraPreview();
      // Pindahkan pembuatan canvas ke View agar DOM manipulation tetap di View
      const canvas = this.view.createCanvas(video.videoWidth, video.videoHeight);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        this.capturedPhoto = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        this.view.showSnapshot(url);
        this.view.stopStream(this.stream);
      }, 'image/jpeg');
    });

    this.view.onFileChange(() => {
      this.capturedPhoto = null;
      if (this.stream) {
        this.view.stopStream(this.stream);
      }
      this.view.hideSnapshot();
    });

    // Handler untuk tombol hapus gambar
    this.view.onDeleteSnapshotClick(() => {
      this.capturedPhoto = null;
      this.view.hideSnapshot();
    });
  }

  _bindFormSubmit() {
    this.view.getFormElement().addEventListener('submit', (e) => this._handleSubmit(e));
  }

  async _handleSubmit(event) {
    event.preventDefault();

    this.view.setSubmitButtonDisabled(true);

    const description = this.view.getDescription();
    const photoFile = this.capturedPhoto || this.view.getPhotoFile();


    if (!photoFile) {
      Swal.fire('Foto Kosong!', 'Silakan ambil atau pilih foto terlebih dahulu.', 'warning');
      this.view.setSubmitButtonDisabled(false);
      return;
    }

    if (this.selectedLat == null || this.selectedLon == null) {
      Swal.fire('Pilih Lokasi!', 'Silakan klik lokasi pada peta terlebih dahulu.', 'warning');
      this.view.setSubmitButtonDisabled(false);
      return;
    }

    try {
      await API.addStory({
        lat: this.selectedLat,
        lon: this.selectedLon,
        description,
        photoFile,
      });
      Swal.fire('Berhasil!', 'Cerita berhasil ditambahkan.', 'success');
      // Jangan tampilkan notifikasi lokal jika user sudah unsubscribe
      // (fallback ini hanya untuk user yang masih subscribe)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(async (reg) => {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            reg.showNotification('Story berhasil dibuat', {
              body: `Anda telah membuat story baru dengan deskripsi: ${description}`,
              icon: '/images/logo.png',
              badge: '/images/logo.png',
            });
          }
        });
      }
      this.view.navigateToHome();
    } catch (err) {
      Swal.fire('Gagal', err.message || 'Terjadi kesalahan.', 'error');
      this.view.setSubmitButtonDisabled(false);
    }
  }
  async cleanup() {
    // stop camera stream
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    // remove leaflet map
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  }
}
