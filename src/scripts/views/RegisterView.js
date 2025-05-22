export default class RegisterView {
  getTemplate() {
    return `
      <section class="container" aria-label="Register">
        <div class="auth-card" role="form" aria-label="Register Form">
          <h2>Register</h2>
          <form id="registerForm">
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required />

            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />

            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />

            <button type="submit" id="registerButton">Daftar</button>
          </form>
          <p id="registerMessage" aria-live="polite"></p>
        </div>
      </section>
    `;
  }

  getFormElement() {
    return document.querySelector('#registerForm');
  }

  getSubmitButton() {
    return document.querySelector('#registerButton');
  }

  getFormValues() {
    const form = this.getFormElement();
    return {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
    };
  }

  setSubmitButtonDisabled(state) {
    this.getSubmitButton().disabled = state;
  }

  showMessage(msg) {
    const el = document.querySelector('#registerMessage');
    el.textContent = msg;
  }
  navigateToLogin() {
    window.location.hash = '#/login';
  }
}
