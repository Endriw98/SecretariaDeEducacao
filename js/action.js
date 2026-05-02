lucide.createIcons();

    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember').checked;
      
      // Aqui você pode adicionar sua lógica de validação
      console.log('Login enviado:', { email, password, remember });
      
      // Exemplo: você pode fazer um fetch para sua API
      // fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, remember })
      // })
    });
    const loginButton = document.getElementById('btn-login');
    loginButton.addEventListener('click', function() {
      // Redireciona para a página principal
      window.location.href = 'main.html';
    });