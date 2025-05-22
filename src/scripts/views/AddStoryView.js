
export default class AddStoryView {
  // Tambahkan method untuk membuat canvas agar DOM manipulation tetap di View
  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  setSubmitButtonDisabled(state) {
    this.getSubmitButton().disabled = state;
  }

  setLocationInfo(text) {
    this.getLocationInfo().textContent = text;
  }

  showWarning(msg) {
    // Untuk konsistensi, bisa gunakan SweetAlert2 di presenter, atau tampilkan pesan di bawah form jika ingin di View
    // Sementara biarkan kosong, karena warning utama tetap di Swal di presenter
  }
  constructor() {
    this.fileInput = null;
    this.video = null;
    this.snapshot = null;
    this.btnUse = null;
    this.btnCapture = null;
    this.submitButton = null;
  }

  getTemplate() {
  return `
    <section class="container" aria-label="Tambah Cerita Baru">
      <h1>Tambah Cerita Baru</h1>
      <form id="addStoryForm" aria-label="Form tambah cerita">
        <div class="form-group">
          <label for="description">Deskripsi</label>
          <textarea id="description" name="description" required></textarea>
        </div>

        <fieldset>
          <legend>Ambil Gambar</legend>
          <div class="photo-input" style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-start;">
            <div style="display: flex; flex-direction: column; gap: 0.5rem; min-width: 180px;">
              <button type="button" id="btnUseCamera" aria-controls="cameraPreview">Gunakan Kamera</button>
              <label for="photo">Pilih Foto dari Galeri</label>
              <input type="file" id="photo" name="photo" accept="image/*" capture="environment" />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; min-width: 220px;">
              <video id="cameraPreview" autoplay hidden aria-label="Pratinjau Kamera" aria-hidden="true" style="max-width: 100%; border-radius: 8px; background: #222;"></video>
              <button type="button" id="btnCapture" hidden>Ambil Foto</button>
              <div id="snapshotWrapper" style="position: relative; display: flex; flex-direction: column; align-items: center;">
                <img id="snapshot" alt="Foto Hasil Capture" hidden style="max-width: 100%; border-radius: 8px; margin-bottom: 0.5rem;" />
                <button type="button" id="btnDeleteSnapshot" hidden style="background: #e74c3c; color: #fff; border: none; border-radius: 6px; padding: 0.4rem 1rem; font-size: 0.95rem; margin-top: 0.2rem;">Hapus Gambar</button>
              </div>
            </div>
          </div>
        </fieldset>

        <div class="form-group">
          <label for="map">Pilih Lokasi</label>
          <div id="map" style="height: 300px; width: 100%; margin-bottom: 1rem;" aria-label="Peta untuk memilih lokasi"></div>
          <p id="locationInfo" aria-live="polite">Klik peta untuk memilih lokasi</p>
        </div>

        <button type="submit" id="submitButton">Kirim Cerita</button>
      </form>
    </section>
  `;
}


  initializeElements() {
    this.fileInput = document.getElementById('photo');
    this.video = document.getElementById('cameraPreview');
    this.snapshot = document.getElementById('snapshot');
    this.btnDeleteSnapshot = document.getElementById('btnDeleteSnapshot');
    this.btnUse = document.getElementById('btnUseCamera');
    this.btnCapture = document.getElementById('btnCapture');
    this.submitButton = document.getElementById('submitButton');
  }

  getDeleteSnapshotButton() {
    return this.btnDeleteSnapshot;
  }

  onDeleteSnapshotClick(handler) {
    if (this.btnDeleteSnapshot) {
      this.btnDeleteSnapshot.addEventListener('click', handler);
    }
  }

  getMapContainer() {
    return document.getElementById('map');
  }

  getFormElement() {
    return document.getElementById('addStoryForm');
  }

  getDescription() {
    return document.getElementById('description').value.trim();
  }

  getPhotoFile() {
    return this.fileInput.files[0];
  }

  getUseCameraButton() {
    return this.btnUse;
  }

  getCaptureButton() {
    return this.btnCapture;
  }

  getCameraPreview() {
    return this.video;
  }

  getSnapshotImage() {
    return this.snapshot;
  }


  getLocationInfo() {
    return document.getElementById('locationInfo');
  }

  setLocationInfo(text) {
    this.getLocationInfo().textContent = text;
  }

  setSubmitButtonDisabled(state) {
    this.getSubmitButton().disabled = state;
  }

  getSubmitButton() {
    return this.submitButton;
  }

  onUseCameraClick(handler) {
    this.btnUse.addEventListener('click', handler);
  }

  onCaptureClick(handler) {
    this.btnCapture.addEventListener('click', handler);
  }

  onFileChange(handler) {
    this.fileInput.addEventListener('change', handler);
  }

  showStream(stream) {
    this.video.srcObject = stream;
    this.video.hidden = false;
    this.btnCapture.hidden = false;
    this.snapshot.hidden = true;
  }

  showSnapshot(url) {
    this.snapshot.src = url;
    this.snapshot.hidden = false;
    this.video.hidden = true;
    this.btnCapture.hidden = true;
    if (this.btnDeleteSnapshot) this.btnDeleteSnapshot.hidden = false;
  }

  hideSnapshot() {
    this.snapshot.src = '';
    this.snapshot.hidden = true;
    if (this.btnDeleteSnapshot) this.btnDeleteSnapshot.hidden = true;
  }

  stopStream(stream) {
    stream.getTracks().forEach((t) => t.stop());
  }

  navigateToHome() {
    window.location.hash = '#/';
  }
}
