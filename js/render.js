let notifications = [];
let currentPage = 'inicio';
const panel = document.getElementById('notificationPanel');
const btnNotification = document.getElementById('btn-notication-graduation-cap');
btnNotification.addEventListener('click', () => {
  if (panel) panel.classList.toggle('hidden');
});

window.addEventListener('DOMContentLoaded', () => {
  initNotifications();
  navigate('inicio'); 
  lucide.createIcons();
});
function initNotifications() {
  if (!document.getElementById('notifications-container')) {
    const container = document.createElement('div');
    container.id = 'notifications-container';
    container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 12px;';
    document.body.appendChild(container);
  }
}

function addNotificationToPanel(title, message, type = 'info') {
  const notification = {
    id: Date.now(),
    title,
    message,
    type,
    timestamp: new Date()
  };

  notifications.unshift(notification);
  updateNotificationPanel();

  const badge = document.getElementById('notificationBadge');
  if (badge) badge.classList.remove('hidden');
}

function updateNotificationPanel() {
  const list = document.getElementById('notificationList');
  if (!list) return;

  if (notifications.length === 0) {
    list.innerHTML = '<div class="px-4 py-6 text-center text-gray-400 text-sm">Nenhuma notificação</div>';
    return;
  }

  list.innerHTML = notifications.map(notif => {
    const icons = { success: 'check-circle', error: 'alert-circle', info: 'info', warning: 'alert-triangle' };
    const textColors = { success: 'text-emerald-700', error: 'text-red-700', info: 'text-blue-700', warning: 'text-amber-700' };
    const bgColors = { success: 'bg-emerald-50', error: 'bg-red-50', info: 'bg-blue-50', warning: 'bg-amber-50' };
    const iconColors = { success: 'text-emerald-600', error: 'text-red-600', info: 'text-blue-600', warning: 'text-amber-600' };

    return `
          <div class="${bgColors[notif.type]} border-b border-gray-200 px-4 py-3 flex gap-3 hover:opacity-80 transition">
            <i data-lucide="${icons[notif.type]}" class="w-4 h-4 flex-shrink-0 mt-0.5 ${iconColors[notif.type]}"></i>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm ${textColors[notif.type]}">${notif.title}</p>
              <p class="text-xs ${textColors[notif.type]} opacity-75 line-clamp-2">${notif.message}</p>
            </div>
            <button onclick="removeNotification(${notif.id})" class="flex-shrink-0 ${textColors[notif.type]} hover:opacity-70 transition">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
          </div>
        `;
  }).join('');

  lucide.createIcons();
}

function removeNotification(id) {
  notifications = notifications.filter(n => n.id !== id);
  updateNotificationPanel();

  if (notifications.length === 0) {
    const badge = document.getElementById('notificationBadge');
    if (badge) badge.classList.add('hidden');
  }
}

function clearAllNotifications() {
  notifications = [];
  updateNotificationPanel();
  const badge = document.getElementById('notificationBadge');
  if (badge) badge.classList.add('hidden');
}

function showNotification(title, message, type = 'info', duration = 5000) {
  initNotifications();
  addNotificationToPanel(title, message, type);

  const container = document.getElementById('notifications-container');

  const icons = { success: 'check-circle', error: 'alert-circle', info: 'info', warning: 'alert-triangle' };
  const bgColors = { success: 'bg-emerald-50 border-emerald-300', error: 'bg-red-50 border-red-300', info: 'bg-blue-50 border-blue-300', warning: 'bg-amber-50 border-amber-300' };
  const textColors = { success: 'text-emerald-800', error: 'text-red-800', info: 'text-blue-800', warning: 'text-amber-800' };
  const iconColors = { success: 'text-emerald-600', error: 'text-red-600', info: 'text-blue-600', warning: 'text-amber-600' };

  const notification = document.createElement('div');
  notification.className = `border rounded-lg p-4 w-80 shadow-lg animate-slide-in ${bgColors[type]}`;
  notification.innerHTML = `
        <div class="flex gap-3">
          <i data-lucide="${icons[type]}" class="w-5 h-5 flex-shrink-0 ${iconColors[type]}"></i>
          <div class="flex-1">
            <p class="font-semibold ${textColors[type]}">${title}</p>
            <p class="text-sm ${textColors[type]} opacity-80">${message}</p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 ${textColors[type]} hover:opacity-70">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>
      `;

  container.appendChild(notification);
  lucide.createIcons();

  if (duration > 0) {
    setTimeout(() => {
      notification.style.animation = 'slide-out 0.3s ease-out forwards';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

function showMessage(text, type) {
  const title = type === 'success' ? 'Sucesso!' : 'Erro!';
  showNotification(title, text, type, 3000);
}

let schools = [];
currentPage = 'inicio';
let darkMode = false;
let lotacoes = [];
let formacoes = [];
let selectedSchool = null;
let userProfile = {
  name: 'Usuário Padrão',
  email: 'usuario@admin.com',
  role: 'Administrador',
  avatar: null
};

const defaultConfig = {
  dashboard_title: 'Painel Administrativo',
  background_color: '#ffffff',
  text_color: '#1e293b',
  primary_action_color: '#2563eb'
};

function getConfig() {
  return window.elementSdk?.config || defaultConfig;
}


function toggleDark() {
  darkMode = !darkMode;
  document.documentElement.classList.toggle('dark', darkMode);

  // Trocar ícone entre lua e sol
  const darkIcon = document.getElementById('darkIcon');
  if (darkIcon) {
    if (darkMode) {
      darkIcon.setAttribute('data-lucide', 'sun');
    } else {
      darkIcon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
  }
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('hidden');
}

function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`[data-page="${page}"]`);
  if (btn) btn.classList.add('active');
  renderPage();
}

function renderPage() {
  const content = document.getElementById('content');
  switch (currentPage) {
    case 'inicio': content.innerHTML = renderInicio(); break;
    case 'funcionario': content.innerHTML = renderFuncionario(); break;
    case 'novo-funcionario': content.innerHTML = renderNovoFuncionario(); break;
    case 'func-desligados': content.innerHTML = renderFuncDesligados(); break;
    case 'recadastramento': content.innerHTML = renderRecadastramento(); break;
    case 'rel-funcionarios': content.innerHTML = renderRelFuncionarios(); break;
    case 'rel-gerais': content.innerHTML = renderRelGerais(); break;
    case 'rel-nao-recad': content.innerHTML = renderRelNaoRecad(); break;
    case 'rel-log': content.innerHTML = renderRelLog(); break;
    case 'config': content.innerHTML = renderConfig(); break;
    case 'perfil': content.innerHTML = renderPerfil(); break;
    default: content.innerHTML = renderInicio();
  }
  lucide.createIcons();
}

function renderInicio() {
  const schoolCards = schools.map((s, i) => `
        <div class="school-card bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-semibold text-gray-800">${s.name}</h3>
            <button onclick="schools.splice(${i},1);renderPage()" class="text-red-400 hover:text-red-600"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>
          <p class="text-sm text-gray-500">${s.type || 'Escola Municipal'}</p>
          <p class="text-xs text-gray-400 mt-1">${s.address || ''}</p>
          <div class="flex gap-2 mt-4">
            <button onclick="goToFuncionarioForm('${s.name}')" class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center justify-center gap-1"><i data-lucide="user-plus" class="w-3 h-3"></i> Novo Func.</button>
            <button onclick="removeFuncionarios(${i})" class="flex-1 bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-200 flex items-center justify-center gap-1"><i data-lucide="user-x" class="w-3 h-3"></i> Remover</button>
          </div>
        </div>
      `).join('');

  return `
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800">Início</h1>
          <button onclick="showAddSchool()" class="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center gap-1"><i data-lucide="plus" class="w-4 h-4"></i> Novo</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="stat-card bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p class="text-sm text-emerald-600 font-medium">Total de Ativos</p>
            <p class="text-2xl font-bold text-emerald-700 mt-1">${schools.length || 0}</p>
          </div>
          <div class="stat-card bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p class="text-sm text-blue-600 font-medium">Total Geral</p>
            <p class="text-2xl font-bold text-blue-700 mt-1">${schools.length || 0}</p>
          </div>
          <div class="stat-card bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p class="text-sm text-purple-600 font-medium">Lotações Visíveis</p>
            <p class="text-2xl font-bold text-purple-700 mt-1">${schools.length || 0}</p>
          </div>
        </div>
        <div class="card-grid">
          ${schoolCards}
          <button onclick="showAddSchool()" class="border-2 border-dashed border-gray-300 rounded-xl p-8 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition min-h-[120px]"><i data-lucide="plus" class="w-8 h-8"></i></button>
        </div>
        <div id="addSchoolModal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div class="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h3 class="font-bold text-lg mb-4">Cadastrar Escola</h3>
            <input id="schoolName" placeholder="Nome da escola" class="w-full border rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <input id="schoolType" placeholder="Tipo (ex: Municipal)" class="w-full border rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <input id="schoolAddr" placeholder="Endereço" class="w-full border rounded-lg px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <div class="flex gap-2">
              <button onclick="addSchool()" class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Salvar</button>
              <button onclick="hideAddSchool()" class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300">Cancelar</button>
            </div>
          </div>
        </div>
      `;
}

function showAddSchool() { document.getElementById('addSchoolModal').classList.remove('hidden'); }
function hideAddSchool() { document.getElementById('addSchoolModal').classList.add('hidden'); }
function addSchool() {
  const name = document.getElementById('schoolName').value.trim();
  if (!name) { showNotification('Aviso', 'Por favor, preencha o nome da escola', 'warning'); return; }
  schools.push({ name, type: document.getElementById('schoolType').value, address: document.getElementById('schoolAddr').value });
  hideAddSchool();
  showNotification('Sucesso!', `Escola "${name}" cadastrada com sucesso`, 'success', 3000);
  document.getElementById('schoolName').value = '';
  document.getElementById('schoolType').value = '';
  document.getElementById('schoolAddr').value = '';
  renderPage();
}

function renderFuncionario() {
  return `
        <h1 class="text-xl md:text-2xl font-bold text-gray-800 mb-6">Funcionário</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 class="font-bold text-red-700 text-lg mb-2">Funcionários Desligados</h3>
              <p class="text-sm text-red-600/80 leading-relaxed">Acompanhe todas as pessoas com vínculo encerrado.</p>
            </div>
            <button onclick="navigate('func-desligados')" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 w-full">Ver lista de desligados</button>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 class="font-bold text-blue-700 text-lg mb-2">Recadastramento Anual</h3>
              <p class="text-sm text-blue-600/80 leading-relaxed">Atualize as informações dos funcionários.</p>
            </div>
            <button onclick="navigate('recadastramento')" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 w-full">Ver histórico detalhado</button>
          </div>
          <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 class="font-bold text-gray-700 text-lg mb-2">Cadastro de Funcionário</h3>
              <p class="text-sm text-gray-600/80 leading-relaxed">Cadastre novos funcionários no sistema.</p>
            </div>
            <button onclick="navigate('novo-funcionario')" class="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 w-full">Novo cadastro</button>
          </div>
        </div>
      `;
}

function renderNovoFuncionario() {
  const lotacoesHtml = lotacoes.map((lot, i) => `
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-800">Lotação ${i + 1}</p>
              <p class="text-xs text-gray-600">Cargo: ${lot.cargo || '-'} | Secretaria: ${lot.secretaria_atual || '-'}</p>
              <p class="text-xs text-gray-600">Admissão: ${lot.data_admissao || '-'}</p>
            </div>
            <button onclick="removeLotacao(${i})" class="text-red-500 hover:text-red-700"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>
        </div>
      `).join('');

  const formacoesHtml = formacoes.map((form, i) => `
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-800">${form.curso || 'Formação'}</p>
              <p class="text-xs text-gray-600">Nível: ${form.nivel || '-'} | Instituição: ${form.instituicao || '-'}</p>
              <p class="text-xs text-gray-600">Período: ${form.ano_inicio || '-'} a ${form.ano_conclusao || '-'}</p>
            </div>
            <button onclick="removeFormacao(${i})" class="text-red-500 hover:text-red-700"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </div>
        </div>
      `).join('');

  return `
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800">Cadastramento de Funcionário</h1>
          <button onclick="navigate('funcionario')" class="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">← Voltar</button>
        </div>
        
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
            <button onclick="switchFormTab('pessoais')" class="form-tab-btn flex-shrink-0 px-6 py-3 text-sm font-medium text-gray-700 border-b-2 border-blue-600 text-blue-600" data-tab="pessoais">Dados Pessoais</button>
            <button onclick="switchFormTab('profissionais')" class="form-tab-btn flex-shrink-0 px-6 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600" data-tab="profissionais">Dados Profissionais</button>
            <button onclick="switchFormTab('endereco')" class="form-tab-btn flex-shrink-0 px-6 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600" data-tab="endereco">Endereço</button>
            <button onclick="switchFormTab('formacao')" class="form-tab-btn flex-shrink-0 px-6 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600" data-tab="formacao">Formação</button>
          </div>

          <div class="p-6">
            <div id="form-tab-pessoais" class="form-tab-content">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Dados Pessoais</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Nome</label><input id="nome" placeholder="Nome completo" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Matrícula</label><input id="matricula" placeholder="Matrícula" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">CPF</label><input id="cpf" placeholder="000.000.000-00" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">RG</label><input id="rg" placeholder="RG" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Data de Emissão RG</label><input id="rg_emissao" type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">UF do RG</label><select id="rg_uf" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>AC</option><option>AL</option><option>AP</option><option>AM</option><option>BA</option><option>CE</option><option>DF</option><option>ES</option><option>GO</option><option>MA</option><option>MT</option><option>MS</option><option>MG</option><option>PA</option><option>PB</option><option>PR</option><option>PE</option><option>PI</option><option>RJ</option><option>RN</option><option>RS</option><option>RO</option><option>RR</option><option>SC</option><option>SP</option><option>SE</option><option>TO</option></select></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Data de Nascimento</label><input id="data_nascimento" type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Local de Nascimento</label><input id="local_nascimento" placeholder="Cidade" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">UF de Nascimento</label><select id="nascimento_uf" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>AC</option><option>AL</option><option>AP</option><option>AM</option><option>BA</option><option>CE</option><option>DF</option><option>ES</option><option>GO</option><option>MA</option><option>MT</option><option>MS</option><option>MG</option><option>PA</option><option>PB</option><option>PR</option><option>PE</option><option>PI</option><option>RJ</option><option>RN</option><option>RS</option><option>RO</option><option>RR</option><option>SC</option><option>SP</option><option>SE</option><option>TO</option></select></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Nacionalidade</label><input id="nacionalidade" placeholder="Brasileira" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Estado Civil</label><select id="estado_civil" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Solteiro</option><option>Casado</option><option>Divorciado</option><option>Viúvo</option><option>Separado</option><option>Unido Estavelmente</option></select></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Sexo</label><select id="sexo" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Masculino</option><option>Feminino</option><option>Outro</option></select></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Nome da Mãe</label><input id="nome_mae" placeholder="Nome da mãe" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Nome do Pai</label><input id="nome_pai" placeholder="Nome do pai" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Telefone</label><input id="telefone" placeholder="(00) 00000-0000" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
              </div>
            </div>

            <div id="form-tab-profissionais" class="form-tab-content hidden">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Dados Profissionais (Lotações)</h3>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 class="font-semibold text-gray-800 text-sm mb-4">Nova Lotação</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Lotado</label><select id="lotado" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option ${selectedSchool ? 'selected' : ''}>Sim</option><option>Não</option></select></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Cargo</label><select id="prof_cargo" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Professor</option><option>Diretor</option><option>Coordenador</option><option>Secretário</option><option>Auxiliar</option></select></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Função</label><select id="prof_funcao" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Docente</option><option>Administrativa</option><option>Operacional</option></select></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Situação do Vínculo</label><select id="prof_vinculo" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Efetivo</option><option>Contratado</option><option>Comissionado</option></select></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Status</label><select id="prof_status" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Ativo</option><option>Licença</option><option>Afastado</option></select></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Secretaria de Origem</label><select id="prof_secretaria_origem" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Educação</option><option>Saúde</option><option>Administração</option></select></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Secretaria Atual</label><select id="prof_secretaria_atual" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option ${selectedSchool ? 'selected' : ''}>Educação</option><option>Saúde</option><option>Administração</option></select></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Data de Admissão</label><input id="prof_data_admissao" type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Data de Desligamento</label><input id="prof_data_desligamento" type="date" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Salário Base</label><input id="prof_salario" type="number" step="0.01" placeholder="0.00" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Gratificação</label><input id="prof_gratificacao" type="number" step="0.01" placeholder="0.00" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Adicional de Função</label><input id="prof_adicional" type="number" step="0.01" placeholder="0.00" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Nível</label><select id="prof_nivel" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Nível I</option><option>Nível II</option><option>Nível III</option></select></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Classe</label><select id="prof_classe" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Classe A</option><option>Classe B</option><option>Classe C</option></select></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Referência</label><select id="prof_referencia" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Ref. 1</option><option>Ref. 2</option><option>Ref. 3</option></select></div>
                </div>
                <div class="mb-4"><label class="block text-xs font-medium text-gray-600 mb-1">Observação</label><textarea id="prof_obs" placeholder="Observações adicionais" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" rows="2"></textarea></div>
                <button onclick="adicionarLotacao()" class="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Adicionar Lotação</button>
              </div>
              <div id="lotacoes-list">${lotacoesHtml || '<p class="text-gray-400 text-sm text-center py-6">Nenhuma lotação adicionada ainda</p>'}</div>
            </div>

            <div id="form-tab-endereco" class="form-tab-content hidden">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Endereço</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label class="block text-xs font-medium text-gray-600 mb-1">CEP</label><input id="cep" placeholder="00000-000" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div class="lg:col-span-2"><label class="block text-xs font-medium text-gray-600 mb-1">Logradouro</label><input id="logradouro" placeholder="Rua, Avenida..." class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Número</label><input id="numero" placeholder="Número" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div class="lg:col-span-2"><label class="block text-xs font-medium text-gray-600 mb-1">Complemento</label><input id="complemento" placeholder="Apto, Bloco..." class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Bairro</label><input id="bairro" placeholder="Bairro" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">Cidade</label><input id="cidade" placeholder="Cidade" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                <div><label class="block text-xs font-medium text-gray-600 mb-1">UF</label><select id="endereco_uf" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>AC</option><option>AL</option><option>AP</option><option>AM</option><option>BA</option><option>CE</option><option>DF</option><option>ES</option><option>GO</option><option>MA</option><option>MT</option><option>MS</option><option>MG</option><option>PA</option><option>PB</option><option>PR</option><option>PE</option><option>PI</option><option>RJ</option><option>RN</option><option>RS</option><option>RO</option><option>RR</option><option>SC</option><option>SP</option><option>SE</option><option>TO</option></select></div>
              </div>
            </div>

            <div id="form-tab-formacao" class="form-tab-content hidden">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Formação Acadêmica</h3>
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 class="font-semibold text-gray-800 text-sm mb-4">Nova Formação</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Nível</label><select id="form_nivel" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Fundamental Incompleto</option><option>Fundamental Completo</option><option>Médio Incompleto</option><option>Médio Completo</option><option>Técnico Incompleto</option><option>Técnico Completo</option><option>Graduação Incompleta</option><option>Graduação Completa</option><option>Especialização</option><option>Mestrado</option><option>Doutorado</option></select></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Situação do Vínculo</label><select id="form_situacao" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"><option>Selecione</option><option>Cursando</option><option>Concluído</option><option>Trancado</option><option>Cancelado</option></select></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Curso</label><input id="form_curso" placeholder="Nome do curso" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Instituição</label><input id="form_instituicao" placeholder="Nome da instituição" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Ano de Início</label><input id="form_inicio" type="number" placeholder="2020" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                  <div><label class="block text-xs font-medium text-gray-600 mb-1">Ano de Conclusão</label><input id="form_conclusao" type="number" placeholder="2023" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"></div>
                </div>
                <div class="mb-4"><label class="block text-xs font-medium text-gray-600 mb-1">Observação</label><textarea id="form_obs" placeholder="Observações adicionais" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" rows="2"></textarea></div>
                <button onclick="adicionarFormacao()" class="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700">+ Adicionar Formação</button>
              </div>
              <div id="formacoes-list">${formacoesHtml || '<p class="text-gray-400 text-sm text-center py-6">Nenhuma formação adicionada ainda</p>'}</div>
            </div>
          </div>

          <div class="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-between">
            <button onclick="navigate('funcionario')" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100">Cancelar</button>
            <button onclick="salvarFuncionario()" class="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Salvar Funcionário</button>
          </div>
        </div>
      `;
}

function renderFuncDesligados() {
  return `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800">Funcionários Desligados</h1>
          <button onclick="navigate('funcionario')" class="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 w-full sm:w-auto">← Voltar</button>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Filtrar por Lotação</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Todos</option>
                <option>Educação</option>
                <option>Saúde</option>
                <option>Administração</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Buscar por Nome, CPF ou Matrícula</label>
              <input type="text" placeholder="Digite para buscar..." class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 pl-8">
            </div>
          </div>
          <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Filtrar</button>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Nome</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Matrícula</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">CPF</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Lotação</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Data Desligamento</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                  <td colspan="4" class="px-4 py-8 text-center text-gray-400 text-sm">Nenhum funcionário desligado encontrado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
}

function renderRecadastramento() {
  return `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800">Recadastramento de Servidores</h1>
          <button onclick="navigate('funcionario')" class="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 w-full sm:w-auto">← Voltar</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p class="text-xs text-blue-600 font-medium">Pendentes</p>
            <p class="text-2xl font-bold text-blue-700 mt-1">0</p>
          </div>
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p class="text-xs text-emerald-600 font-medium">Recadastrados</p>
            <p class="text-2xl font-bold text-emerald-700 mt-1">0</p>
          </div>
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p class="text-xs text-amber-600 font-medium">Vencidos</p>
            <p class="text-2xl font-bold text-amber-700 mt-1">0</p>
          </div>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>    
              <label class="block text-xs font-medium text-gray-600 mb-1">Lotação</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Todos</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Buscar por Nome, CPF ou Matrícula</label>
              <input type="text" placeholder="Digite para buscar..." class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 pl-8">
            </div>
          </div>
          <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Filtrar</button>
          <button class="w-full mt-2 border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 hover:text-white">Limpar Filtros</button>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Nome</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Matrícula</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Lotação Atual</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Cargo</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Último Recadastramento</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-400 text-sm">Nenhum servidor encontrado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
}

function renderRelFuncionarios() {
  return `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800">Relatório de Funcionários</h1>
          <button onclick="navigate('inicio')" class="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 w-full sm:w-auto">← Voltar</button>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <button class="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
              Novo Funcionário
              </button>
            </div>
            <div>
              <button class="w-full  bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Afastados/Licença</button>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Buscar (Nome, CPF ou Matrícula)</label>
              <input type="text" placeholder="Digite para buscar..." class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Filtrar por Secretaria</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Todos</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Situação do vínculo</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Todos</option>
                <option>Efetivo</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Filtrar por Lotação</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Todos</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Filtrar por Cargo</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Todos</option>
                <option>Professor</option>
                <option>Diretor</option>
                <option>Coordenador</option>
                <option>Secretário</option>
                <option>Auxiliar</option>
              </select>
            </div>
            <div>
              <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 mb-2" style="margin-top: 1.3rem;">Aplicar Filtros</button>
            </div>
            <div>
              <button class="w-full mt-2 border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 hover:text-white" style="margin-top: 1.3rem;">Todos</button>
            </div>
            <div>
              <button class="w-full mt-2 border border-yellow-600 text-yellow-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 hover:text-white" style="margin-top: 1.3rem;">Ativos</button>
            </div>
            <div>
              <button class="w-full mt-2 border border-red-600 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white">Inativos</button>
            </div>
            <div>
              <button class="w-full mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700">Gerar PDF desta lista</button>
            </div>
          </div>
          
          
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Nome</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Matrícula</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Cargo</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                  <td colspan="4" class="px-4 py-8 text-center text-gray-400 text-sm">Nenhum funcionário cadastrado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
}

function renderRelGerais() {
  return `
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800">Relatórios Gerais</h1>
          <button onclick="navigate('inicio')" class="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">← Voltar</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold text-gray-800 mb-4">Relatório de Folha de Pagamento</h3>
            <p class="text-sm text-gray-600 mb-4">Gere relatório detalhado da folha de pagamento</p>
            <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
              <i data-lucide="file-pdf" class="w-4 h-4"></i> Gerar PDF
            </button>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold text-gray-800 mb-4">Relatório de Lotações</h3>
            <p class="text-sm text-gray-600 mb-4">Visualize todas as lotações cadastradas</p>
            <button class="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2">
              <i data-lucide="file-pdf" class="w-4 h-4"></i> Exportar PDF
            </button>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold text-gray-800 mb-4">Relatório de Formações</h3>
            <p class="text-sm text-gray-600 mb-4">Exporte dados de formação acadêmica</p>
            <button class="w-full bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-2">
              <i data-lucide="file-pdf" class="w-4 h-4"></i> Exportar PDF
            </button>
          </div>
          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 class="font-semibold text-gray-800 mb-4">Relatório Geral Consolidado</h3>
            <p class="text-sm text-gray-600 mb-4">Gere relatório completo do sistema</p>
            <button class="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
              <i data-lucide="file-pdf" class="w-4 h-4"></i> Exportar Tudo
            </button>
          </div>
        </div>
      `;
}

function renderRelNaoRecad() {
  return `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800">Servidores não recadastrados</h1>
          <button onclick="navigate('inicio')" class="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 w-full sm:w-auto">← Voltar</button>
        </div>
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex gap-3">
          <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
          <div>
            <p class="font-semibold text-amber-800">Atenção!</p>
            <p class="text-sm text-amber-700">Estes servidores não completaram o recadastramento anual.</p>
          </div>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Período de Recadastramento</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Nenhum período encerrado</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Lotação</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Todos</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Buscar (Nome, CPF ou Matrícula)</label>
              <input type="text" placeholder="Digite para buscar..." class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            </div>
            <div>
              <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2 mt-2" style="margin-top: 1.3rem;">
                <i data-lucide="search" class="w-4 h-4"></i> Buscar
              </button>
            </div>
          </div>
          <button class="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
            <i data-lucide="download" class="w-4 h-4"></i> Exportar PDF
          </button>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Nome</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Matrícula</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Dias em Atraso</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-400 text-sm">Nenhum servidor encontrado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
}

function renderRelLog() {
  return `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800">Log de alterações</h1>
          <button onclick="navigate('inicio')" class="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 w-full sm:w-auto">← Voltar</button>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Buscar Servidor</label>
              <input type="text" placeholder="Nome, CPF ou Matrícula" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Filtrar por Lotação</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Todos</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Filtrar por Usuário</label>
              <select class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Todos</option>
              </select>  
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Data Inicial</label>
              <input type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Data Final</label>
              <input type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            </div>
            
          </div>
          </div>
          
          <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Filtrar</button>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Data/Hora</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Servidor</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Lotação</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Usuário</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Ação</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700">Observação</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                  <td colspan="4" class="px-4 py-8 text-center text-gray-400 text-sm">Nenhum registro encontrado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
}

function renderConfig() {
  const themes = [
    { name: 'Azul', gradient: 'from-blue-500 to-indigo-600', bg: '#3b82f6', accent: '#4f46e5' },
    { name: 'Roxo', gradient: 'from-purple-500 to-pink-600', bg: '#a855f7', accent: '#ec4899' },
    { name: 'Verde', gradient: 'from-green-500 to-emerald-600', bg: '#22c55e', accent: '#10b981' },
    { name: 'Vermelho', gradient: 'from-red-500 to-orange-600', bg: '#ef4444', accent: '#f97316' },
    { name: 'Ciano', gradient: 'from-cyan-500 to-blue-600', bg: '#06b6d4', accent: '#0ea5e9' },
    { name: 'Rosa', gradient: 'from-pink-500 to-rose-600', bg: '#ec4899', accent: '#e11d48' }, { name: 'Amarelo', gradient: 'from-yellow-500 to-amber-600', bg: '#f59e0b', accent: '#d97706' },
      { name: 'Indigo', gradient: 'from-indigo-500 to-blue-600', bg: '#6366f1', accent: '#4f46e5' }, { name: 'Laranja', gradient: 'from-orange-500 to-red-600', bg: '#f97316', accent: '#ef4444' },
     { name: 'Verde Limão', gradient: 'from-lime-500 to-green-600', bg: '#84cc16', accent: '#65a30d' }, { name: 'Fúcsia', gradient: 'from-fuchsia-500 to-pink-600', bg: '#d946ef', accent: '#ec4899' },
      { name: 'Cinza', gradient: 'from-gray-500 to-slate-600', bg: '#6b7280', accent: '#4b5563' }, { name: 'Azul Claro', gradient: 'from-blue-300 to-blue-500', bg: '#60a5fa', accent: '#3b82f6' }, { name: 'Rosa Claro', gradient: 'from-pink-300 to-pink-500', bg: '#fda4af', accent: '#ec4899' }, { name: 'Verde Claro', gradient: 'from-green-300 to-green-500', bg: '#86efac', accent: '#22c55e' },
       { name: 'Amarelo Claro', gradient: 'from-yellow-300 to-yellow-500', bg: '#fde68a', accent: '#f59e0b' }, { name: 'Ciano Claro', gradient: 'from-cyan-300 to-cyan-500', bg: '#67e8f9', accent: '#06b6d4' }, { name: 'Roxo Claro', gradient: 'from-purple-300 to-purple-500', bg: '#c084fc', accent: '#a855f7' }, { name: 'Laranja Claro', gradient: 'from-orange-300 to-orange-500', bg: '#fdba74', accent: '#f97316' }, { name: 'Indigo Claro', gradient: 'from-indigo-300 to-indigo-500', bg: '#a5b4fc', accent: '#6366f1' }, { name: 'Fúcsia Claro', gradient: 'from-fuchsia-300 to-fuchsia-500', bg: '#f0abfc', accent: '#d946ef' }, { name: 'Cinza Claro', gradient: 'from-gray-300 to-gray-500', bg: '#d1d5db', accent: '#6b7280' }, { name: 'Azul Escuro', gradient: 'from-blue-700 to-blue-900', bg: '#1e40af', accent: '#1e3a8a' }, { name: 'Roxo Escuro', gradient: 'from-purple-700 to-purple-900', bg: '#6b21a8', accent: '#581c87' }, { name: 'Verde Escuro', gradient: 'from-green-700 to-green-900', bg: '#15803d', accent: '#166534' }, { name: 'Vermelho Escuro', gradient: 'from-red-700 to-red-900', bg: '#b91c1c', accent: '#991b1b' }, { name: 'Ciano Escuro', gradient: 'from-cyan-700 to-cyan-900', bg: '#0891b2', accent: '#0c4a6e' }, { name: 'Rosa Escuro', gradient: 'from-pink-700 to-pink-900', bg: '#be123c', accent: '#9f1239' }, { name: 'Amarelo Escuro', gradient: 'from-yellow-700 to-yellow-900', bg: '#b45309', accent: '#78350f' }, { name: 'Indigo Escuro', gradient: 'from-indigo-700 to-indigo-900', bg: '#4338ca', accent: '#312e81' }, { name: 'Laranja Escuro', gradient: 'from-orange-700 to-orange-900', bg: '#c2410c', accent: '#9a3412' }, { name: 'Fúcsia Escuro', gradient: 'from-fuchsia-700 to-fuchsia-900', bg: '#9d174d', accent: '#831843' }, { name: 'Cinza Escuro', gradient: 'from-gray-700 to-gray-900', bg: '#374151', accent: '#1f2937' }

  ];

  return `
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-800">Configurações</h1>
          <button onclick="navigate('perfil')" class="px-3 py-1.5 text-xs bg-gray-200 dark:bg-white text-gray-900 dark:text-gray-900 rounded-lg hover:bg-gray-300 dark:hover:bg-whitefont-medium">← Voltar</button>
        </div>
        
        <div class="bg-white dark:bg-white rounded-xl border border-gray-200 dark:border-slate-300 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-800 mb-6">Tema da Aplicação</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">Selecione um tema de cores para personalizar sua experiência</p>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            ${themes.map(theme => `
              <button onclick="applyTheme('${theme.bg}', '${theme.accent}')" class="group relative">
                <div class="bg-gradient-to-br ${theme.gradient} rounded-xl p-6 h-32 shadow-lg hover:shadow-xl transition transform hover:scale-105 flex flex-col items-center justify-center">
                  <div class="w-12 h-12 rounded-full bg-white/20 mb-2"></div>
                  <span class="text-white font-semibold text-sm">${theme.name}</span>
                </div>
              </button>
            `).join('')}
          </div>
          
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <h4 class="font-semibold text-gray-800 dark:text-gray-800 mb-3">Preferências Gerais</h4>
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <span class="text-sm text-gray-700 dark:text-gray-600">Notificações ativas</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked>
                <span class="text-sm text-gray-700 dark:text-gray-600">Modo automático de tema escuro</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked>
                <span class="text-sm text-gray-700 dark:text-gray-600">Lembrar último acesso</span>
              </label>
            </div>
          </div>
        </div>
      `;
}

function renderPerfil() {
  const hasAvatar = userProfile.avatar !== null;
  return `
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Perfil</h1>
          <button onclick="navigate('inicio')" class="px-3 py-1.5 text-xs bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 font-medium">← Voltar</button>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6">
          <div class="flex flex-col sm:flex-row gap-6 mb-6">
            <div class="flex flex-col items-center">
              <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden mb-4" id="profileAvatarDisplay">
                <img id="profileAvatarImg" src="" style="display:${hasAvatar ? 'block' : 'none'}; width:100%; height:100%; object-fit:cover;">
                <span id="profileAvatarText" style="display:${hasAvatar ? 'none' : 'block'}">U</span>
              </div>
              <input type="file" id="avatarInput" accept="image/*" style="display:none" onchange="handleAvatarUpload(event)">
              <button onclick="document.getElementById('avatarInput').click()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                <i data-lucide="camera" class="w-4 h-4"></i> Mudar Foto
              </button>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informações Pessoais</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nome Completo</label>
                  <input id="profileName" type="text" value="${userProfile.name}" class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-slate-700 dark:text-white">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                  <input id="profileEmail" type="email" value="${userProfile.email}" class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-slate-700 dark:text-white">
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Função</label>
                  <input id="profileRole" type="text" value="${userProfile.role}" class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-slate-700 dark:text-white">
                </div>
              </div>
              <button onclick="saveProfile()" class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      `;
}

function switchFormTab(tabName) {
  document.querySelectorAll('.form-tab-content').forEach(t => t.classList.add('hidden'));
  document.querySelectorAll('.form-tab-btn').forEach(b => { b.classList.remove('border-blue-600', 'text-blue-600'); b.classList.add('border-transparent'); });
  document.getElementById('form-tab-' + tabName).classList.remove('hidden');
  const btn = document.querySelector('[data-tab="' + tabName + '"]');
  if (btn) { btn.classList.add('border-blue-600', 'text-blue-600'); }
}

function adicionarLotacao() {
  const cargo = document.getElementById('prof_cargo').value;
  if (!cargo) { showNotification('Aviso', 'Preencha o cargo!', 'warning'); return; }
  lotacoes.push({
    cargo: cargo,
    funcao: document.getElementById('prof_funcao').value,
    vinculo: document.getElementById('prof_vinculo').value,
    status: document.getElementById('prof_status').value,
    secretaria_origem: document.getElementById('prof_secretaria_origem').value,
    secretaria_atual: document.getElementById('prof_secretaria_atual').value,
    data_admissao: document.getElementById('prof_data_admissao').value,
    data_desligamento: document.getElementById('prof_data_desligamento').value,
    salario: document.getElementById('prof_salario').value,
    gratificacao: document.getElementById('prof_gratificacao').value,
    adicional: document.getElementById('prof_adicional').value,
    nivel: document.getElementById('prof_nivel').value,
    classe: document.getElementById('prof_classe').value,
    referencia: document.getElementById('prof_referencia').value,
    obs: document.getElementById('prof_obs').value
  });
  showNotification('Sucesso!', 'Lotação adicionada com sucesso', 'success', 3000);
  document.getElementById('prof_cargo').value = '';
  document.getElementById('prof_funcao').value = '';
  document.getElementById('prof_vinculo').value = '';
  document.getElementById('prof_status').value = '';
  document.getElementById('prof_secretaria_origem').value = '';
  document.getElementById('prof_secretaria_atual').value = '';
  renderPage();
}

function removeLotacao(i) {
  lotacoes.splice(i, 1);
  showNotification('Sucesso!', 'Lotação removida com sucesso', 'success', 3000);
  renderPage();
}

function adicionarFormacao() {
  const curso = document.getElementById('form_curso').value;
  if (!curso) { showNotification('Aviso', 'Preencha o curso!', 'warning'); return; }
  formacoes.push({
    nivel: document.getElementById('form_nivel').value,
    situacao: document.getElementById('form_situacao').value,
    curso: curso,
    instituicao: document.getElementById('form_instituicao').value,
    ano_inicio: document.getElementById('form_inicio').value,
    ano_conclusao: document.getElementById('form_conclusao').value,
    obs: document.getElementById('form_obs').value
  });
  showNotification('Sucesso!', 'Formação adicionada com sucesso', 'success', 3000);
  document.getElementById('form_curso').value = '';
  renderPage();
}

function removeFormacao(i) {
  formacoes.splice(i, 1);
  showNotification('Sucesso!', 'Formação removida com sucesso', 'success', 3000);
  renderPage();
}

function salvarFuncionario() {
  const nome = document.getElementById('nome').value;
  if (!nome) { showNotification('Aviso', 'Nome é obrigatório!', 'warning'); return; }
  showNotification('Sucesso!', 'Funcionário salvo com sucesso!', 'success', 3000);
  setTimeout(() => navigate('funcionario'), 1500);
}

function goToFuncionarioForm(schoolName) {
  selectedSchool = schoolName;
  navigate('novo-funcionario');
}

function removeFuncionarios(schoolIndex) {
  schools[schoolIndex].funcionarios = [];
  showNotification('Sucesso!', 'Funcionários removidos com sucesso', 'success', 3000);
  renderPage();
}

function toggleUserPanel() {
  let userPanel = document.getElementById('userPanel');
  userPanel.classList.toggle('hidden');
}

function goToUserProfile() {
  document.getElementById('userPanel').classList.add('hidden');
  navigate('perfil');
}

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      userProfile.avatar = e.target.result;
      updateAvatarDisplay();
      showNotification('Sucesso!', 'Foto de perfil atualizada', 'success', 3000);
    };
    reader.readAsDataURL(file);
  }
}

function updateAvatarDisplay() {
  // Atualizar avatar no header
  const headerAvatarImg = document.getElementById('userAvatarImg');
  const headerAvatarText = document.getElementById('userAvatarText');
  if (userProfile.avatar) {
    headerAvatarImg.src = userProfile.avatar;
    headerAvatarImg.style.display = 'block';
    headerAvatarText.style.display = 'none';
  } else {
    headerAvatarImg.style.display = 'none';
    headerAvatarText.style.display = 'block';
  }

  // Atualizar avatar no painel
  const panelAvatarImg = document.getElementById('userPanelAvatarImg');
  const panelAvatarText = document.getElementById('userPanelAvatarText');
  if (userProfile.avatar) {
    panelAvatarImg.src = userProfile.avatar;
    panelAvatarImg.style.display = 'block';
    panelAvatarText.style.display = 'none';
  } else {
    panelAvatarImg.style.display = 'none';
    panelAvatarText.style.display = 'block';
  }

  // Atualizar avatar na página de perfil se estiver aberta
  if (currentPage === 'perfil') {
    const profileAvatarImg = document.getElementById('profileAvatarImg');
    const profileAvatarText = document.getElementById('profileAvatarText');
    if (userProfile.avatar) {
      profileAvatarImg.src = userProfile.avatar;
      profileAvatarImg.style.display = 'block';
      profileAvatarText.style.display = 'none';
    } else {
      profileAvatarImg.style.display = 'none';
      profileAvatarText.style.display = 'block';
    }
  }
}

function saveProfile() {
  userProfile.name = document.getElementById('profileName').value;
  userProfile.email = document.getElementById('profileEmail').value;
  userProfile.role = document.getElementById('profileRole').value;

  // Atualizar exibição no painel do usuário
  document.getElementById('userFullName').textContent = userProfile.name;

  showNotification('Sucesso!', 'Perfil atualizado com sucesso', 'success', 3000);
}

function logoutUser() {
  document.getElementById('userPanel').classList.add('hidden');
  showNotification('Até logo!', 'Você saiu do sistema', 'info', 2000);
  window.location.href = 'index.html'; // Redirecionar para página de login
}

function applyTheme(primaryColor, accentColor) {
  // Remover estilo anterior se existir
  const oldStyle = document.getElementById('theme-style');
  if (oldStyle) oldStyle.remove();

  // Aplicar cores ao sidebar (gradiente)
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.style.background = `linear-gradient(180deg, ${primaryColor} 0%, ${accentColor} 100%)`;
  }

  // Aplicar tema ao mobile menu
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    const mobileNav = mobileMenu.querySelector('.sidebar-gradient');
    if (mobileNav) {
      mobileNav.style.background = `linear-gradient(180deg, ${primaryColor} 0%, ${accentColor} 100%)`;
    }
  }

  // Criar novo stylesheet com o tema
  const styleSheet = document.createElement('style');
  styleSheet.id = 'theme-style';
  styleSheet.textContent = `
        /* Botões primários */
        button.bg-blue-600 { background-color: ${primaryColor} !important; }
        button.bg-blue-600:hover { opacity: 0.9 !important; }
        button.hover\\:bg-blue-700:hover { background-color: ${primaryColor} !important; opacity: 0.85 !important; }
        
        /* Cores de texto */
        .text-blue-600 { color: ${primaryColor} !important; }
        .text-blue-700 { color: ${primaryColor} !important; }
        
        /* Bordas */
        .border-blue-600 { border-color: ${primaryColor} !important; }
        .border-blue-300 { border-color: ${primaryColor}80 !important; }
        
        /* Backgrounds claros */
        .bg-blue-50 { background-color: ${primaryColor}15 !important; }
        .border-blue-200 { border-color: ${primaryColor}30 !important; }
        
        /* Focus states */
        input:focus, select:focus, textarea:focus {
          border-color: ${primaryColor} !important;
          box-shadow: 0 0 0 3px ${primaryColor}30 !important;
        }
        
        /* Links e elementos interativos */
        a.text-blue-600:hover { color: ${primaryColor} !important; }
        button.text-blue-600 { color: ${primaryColor} !important; }
      `;
  document.head.appendChild(styleSheet);

  showNotification('Sucesso!', 'Tema aplicado com sucesso', 'success', 2000);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

function generateDarkBg(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 'rgb(26, 26, 46)';
    // Reduzir luminosidade para criar fundo escuro
    return `rgb(${Math.max(rgb.r * 0.15, 15)}, ${Math.max(rgb.g * 0.15, 15)}, ${Math.max(rgb.b * 0.15, 15)})`;
}

function generateDarkSurface(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 'rgb(22, 33, 62)';
    // Superfície levemente mais clara que o fundo
    return `rgb(${Math.max(rgb.r * 0.25, 20)}, ${Math.max(rgb.g * 0.25, 20)}, ${Math.max(rgb.b * 0.25, 20)})`;
}


function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}


function applyTheme(primaryColor, accentColor) {
            // Remover estilo anterior se existir
            const oldStyle = document.getElementById('theme-style');
            if (oldStyle) oldStyle.remove();

            // Gerar cores escuras a partir da cor primária
            const darkBg = generateDarkBg(primaryColor);
            const darkSurface = generateDarkSurface(primaryColor);

            // Aplicar cores ao sidebar (gradiente)
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.style.background = `linear-gradient(180deg, ${primaryColor} 0%, ${accentColor} 100%)`;
            }

            // Aplicar tema ao mobile menu
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                const mobileNav = mobileMenu.querySelector('.sidebar-gradient');
                if (mobileNav) {
                    mobileNav.style.background = `linear-gradient(180deg, ${primaryColor} 0%, ${accentColor} 100%)`;
                }
            }

            // Criar novo stylesheet com o tema
            const styleSheet = document.createElement('style');
            styleSheet.id = 'theme-style';
            styleSheet.textContent = `
        /* Tema claro - Botões primários */
        button.bg-blue-600 { background-color: ${primaryColor} !important; }
        button.bg-blue-600:hover { opacity: 0.9 !important; }
        button.hover\\:bg-blue-700:hover { background-color: ${primaryColor} !important; opacity: 0.85 !important; }
        
        /* Tema claro - Cores de texto */
        .text-blue-600 { color: ${primaryColor} !important; }
        .text-blue-700 { color: ${primaryColor} !important; }
        
        /* Tema claro - Bordas */
        .border-blue-600 { border-color: ${primaryColor} !important; }
        .border-blue-300 { border-color: ${primaryColor}80 !important; }
        
        /* Tema claro - Backgrounds claros */
        .bg-blue-50 { background-color: ${primaryColor}15 !important; }
        .border-blue-200 { border-color: ${primaryColor}30 !important; }
        
        /* Tema claro - Focus states */
        input:focus, select:focus, textarea:focus {
          border-color: ${primaryColor} !important;
          box-shadow: 0 0 0 3px ${primaryColor}30 !important;
        }
        
        /* Tema claro - Links e elementos interativos */
        a.text-blue-600:hover { color: ${primaryColor} !important; }
        button.text-blue-600 { color: ${primaryColor} !important; }
        
        /* Tema escuro - Fundo principal */
        .dark body, .dark .center-content { background: ${darkBg} !important; }
        .dark .top-bar { background: ${darkSurface} !important; }
        
        /* Tema escuro - Cards e superfícies */
        .dark .stat-card, .dark .school-card, .dark .form-card { background: ${darkSurface} !important; }
        .dark .bg-white { background: ${darkSurface} !important; }
        .dark .bg-gray-50 { background: ${darkBg} !important; }
        
        /* Tema escuro - Botões primários no modo escuro */
        .dark button.bg-blue-600 { background-color: ${primaryColor} !important; }
        .dark button.hover\\:bg-blue-700:hover { background-color: ${primaryColor} !important; opacity: 0.85 !important; }
        
        /* Tema escuro - Cores de texto */
        .dark .text-blue-600 { color: ${primaryColor} !important; }
        .dark .text-blue-700 { color: ${primaryColor} !important; }
        .dark .border-blue-600 { border-color: ${primaryColor} !important; }
        
        /* Tema escuro - Inputs */
        .dark input:focus, .dark select:focus, .dark textarea:focus {
          border-color: ${primaryColor} !important;
          box-shadow: 0 0 0 3px ${primaryColor}30 !important;
        }
        
        /* Tema escuro - Sidebar gradiente */
        .dark .sidebar-gradient { background: linear-gradient(180deg, ${primaryColor} 0%, ${accentColor} 100%) !important; }
      `;
            document.head.appendChild(styleSheet);

            // Se estiver em modo escuro, aplicar as cores imediatamente
            if (darkMode) {
                const body = document.body;
                const topBar = document.querySelector('.top-bar');
                if (body) body.style.background = darkBg;
                if (topBar) topBar.style.background = darkSurface;
            }

            showNotification('Sucesso!', 'Tema aplicado com sucesso', 'success', 2000);
        }

function hexToHsl(hex) {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h = 0, s = 0;
            const l = (max + min) / 2;

            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                switch (max) {
                    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                    case g: h = ((b - r) / d + 2) / 6; break;
                    case b: h = ((r - g) / d + 4) / 6; break;
                }
            }

            return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
        }


// Fechar painel ao clicar fora
document.addEventListener('click', function (event) {
  const userPanel = document.getElementById('userPanel');
  const userButton = event.target.closest('[onclick*="toggleUserPanel"]') || event.target.closest('.flex.items-center.gap-2.relative.group button');

  if (userPanel && !userPanel.contains(event.target) && !userButton) {
    userPanel.classList.add('hidden');
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initNotifications();
    renderPage();
    lucide.createIcons();
    showNotification('Bem-vindo!', 'Dashboard carregado com sucesso', 'success', 3000);
  });
} else {
  initNotifications();
  renderPage();
  lucide.createIcons();
  showNotification('Bem-vindo!', 'Dashboard carregado com sucesso', 'success', 3000);
}





