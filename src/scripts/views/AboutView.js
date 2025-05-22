export default class AboutView {
    getTemplate() {
      return `
        <section class="about">
          <h2>Tentang Story App</h2>
          <p>
            Story App adalah aplikasi web Single‑Page (SPA) yang memungkinkan kamu  
            berbagi pengalaman dan cerita menarik dari seluruh penjuru Nusantara.  
            🌏✍️
          </p>
            
          <h3>Fitur Unggulan</h3>
          <ul>
            <li><strong>Tambah Cerita & Peta Interaktif</strong>  
              Tandai lokasi perjalananmu langsung di peta, lalu bagikan cerita dan foto. 🗺️📸</li>
            <li><strong>Autentikasi dan Keamanan</strong>  
              Sistem login berbasis token menjaga privasi dan memastikan konten hanya  
              dapat dikelola oleh pemiliknya. 🔒</li>
            <li><strong>Hash‑Based Routing</strong>  
              Navigasi tanpa reload halaman, transisi halus untuk pengalaman seperti  
              aplikasi native. 🖥️🚀</li>
            <li><strong>Responsive & Aksesibilitas</strong>  
              Desain adaptif di desktop maupun mobile, dengan dukungan navigasi keyboard  
              & screen reader. 🤝</li>
          </ul>
            
          <h3>Teknologi</h3>
          <p>
            Dibangun menggunakan:<br>
            • <strong>Vanilla JavaScript</strong> (MVP architecture)<br>
            • <strong>Webpack</strong> (module bundler & dev server)<br>
            • <strong>Leaflet.js</strong> (peta interaktif & marker)<br>
            • <strong>SweetAlert2</strong> (notifikasi & dialog yang cantik)<br>
            • <strong>Story API</strong> sebagai backend (RESTful & JSON)<br>
          </p>
            
          <h3>Kenapa Harus Pakai Story App?</h3>
          <ol>
            <li><em>Mudah Digunakan:</em> Antarmuka simpel, langsung siap pakai.</li>
            <li><em>Bebas Berkreasi:</em> Tambahkan gambar, lokasi, dan narasi sesukamu.</li>
            <li><em>Koleksi Kenangan:</em> Simpan semua cerita dalam satu tempat,  
              bisa diakses kapan saja.</li>
          </ol>
            
          <h3>Ayo Berbagi Ceritamu!</h3>
          <p>
            Bergabunglah bersama komunitas penulis petualang.  
            Klik menu <strong>“Tambah Cerita”</strong> dan mulai ceritakan kisahmu sekarang!  
            🎉
          </p>
        </section>
      `;
    }
    getShowMoreButton() {
      return document.querySelector('#show-more');
    }
    getExtraInfoContainer() {
      return document.querySelector('#extra-info');
    }
  }
  