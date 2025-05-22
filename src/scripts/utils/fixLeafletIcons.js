// File: src/scripts/utils/fixLeafletIcons.js
import L from 'leaflet';

export function fixLeafletIcons() {
  // Hapus cache URL lama (jika ada)
  delete L.Icon.Default.prototype._getIconUrl;

  // Gunakan CDN Leaflet untuk asset icon
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}
