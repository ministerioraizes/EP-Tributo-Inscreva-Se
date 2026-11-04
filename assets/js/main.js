/* ═══════════════════════════════════════════════════
   RAÍZES - EP TRIBUTO, INSCRIÇÃO  |  main.js
═══════════════════════════════════════════════════ */

/* Número que recebe as inscrições pelo WhatsApp */
const WHATSAPP_INSCRICOES = '5585981563690';

/* ── Navegação ── */
const navbar = document.getElementById('navbar');
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
}, { passive: true });

/* ── Aparecer ao rolar ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Partículas do topo ── */
(function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${Math.random() > .5 ? 'var(--gold)' : 'var(--gold-light)'};
      animation-duration: ${Math.random() * 18 + 12}s;
      animation-delay: ${Math.random() * 12}s;
    `;
    container.appendChild(p);
  }
})();

/* ── Inscrição: monta a mensagem pronta para o WhatsApp ── */
const form = document.getElementById('formInscricao');
const passoFinal = document.getElementById('passoFinal');
const linkWhatsapp = document.getElementById('linkWhatsapp');

function montarMensagem(dados) {
  const texto = (campo) => (dados.get(campo) || '').trim();
  const linhas = [
    'Olá! Quero me inscrever na gravação dos clipes do EP Tributo, no dia 28/11.',
    '',
    `*Nome:* ${texto('nome')}`,
    `*E-mail:* ${texto('email')}`,
    `*Telefone:* ${texto('telefone')}`,
  ];
  if (texto('origem')) linhas.push(`*Como fiquei sabendo:* ${texto('origem')}`);
  linhas.push(
    '*Autorizo o uso da minha imagem e voz:* Sim',
    `*Quero receber novidades por WhatsApp e e-mail:* ${texto('novidades')}`
  );
  return linhas.join('\n');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const mensagem = montarMensagem(new FormData(form));
  linkWhatsapp.href = `https://wa.me/${WHATSAPP_INSCRICOES}?text=${encodeURIComponent(mensagem)}`;
  form.hidden = true;
  passoFinal.hidden = false;
  passoFinal.focus({ preventScroll: true });
  document.getElementById('inscricao').scrollIntoView();
});

document.getElementById('corrigir').addEventListener('click', () => {
  passoFinal.hidden = true;
  form.hidden = false;
  form.scrollIntoView();
});
