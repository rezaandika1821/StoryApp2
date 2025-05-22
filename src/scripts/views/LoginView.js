class LoginView {
  getTemplate() {
    return `
      <section class="container" aria-label="Login">
        <div class="auth-card" role="form" aria-label="Login Form">
          <h2>Login</h2>
          <form id="loginForm">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />

            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />

            <a href="#" class="link">Forgot password?</a>
            <button type="submit" id="loginButton">Login</button>

            <div class="footer">
              Belum punya akun? <a href="#/register" class="link">Daftar di sini</a>
            </div>
          </form>
          <p id="errorMessage" style="color: red;" aria-live="polite"></p>
        </div>
      </section>
    `;
  }

  getFormElement() {
    return document.querySelector('#loginForm');
  }

  getSubmitButton() {
    return document.querySelector('#loginButton');
  }

  getFormValues() {
    const form = this.getFormElement();
    return {
      email: form.email.value.trim(),
      password: form.password.value,
    };
  }

  setSubmitButtonDisabled(state) {
    this.getSubmitButton().disabled = state;
  }

  setSubmitButtonText(text) {
    this.getSubmitButton().textContent = text;
  }

  showErrorMessage(msg) {
    document.querySelector('#errorMessage').textContent = msg;
  }

  navigateToHome() {
    window.location.hash = '/';
  }
}

export default new LoginView();
