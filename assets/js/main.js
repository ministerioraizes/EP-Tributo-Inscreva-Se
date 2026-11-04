/* ═══════════════════════════════════════════════════
   RAÍZES - EP TRIBUTO, INSCRIÇÃO  |  main.js
═══════════════════════════════════════════════════ */

/* Supabase: esta chave é pública por natureza. A tabela só permite adicionar inscrições. */
const SUPABASE_URL = 'https://rwndhrsckbowmllavimf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_dcaVsl7MiqdUmCLkYswZ1Q_n4Gap2s3';

/* Número usado como alternativa quando não for possível salvar a inscrição */
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

/* ── Inscrição ── */
const form = document.getElementById('formInscricao');
const botaoEnviar = document.getElementById('botaoEnviar');
const erroEnvio = document.getElementById('erroEnvio');
const linkWhatsapp = document.getElementById('linkWhatsapp');
const sucesso = document.getElementById('sucesso');
const sucessoTitulo = document.getElementById('sucessoTitulo');

function lerInscricao() {
  const dados = new FormData(form);
  const texto = (campo) => (dados.get(campo) || '').trim();
  return {
    nome: texto('nome'),
    email: texto('email').toLowerCase(),
    telefone: texto('telefone'),
    origem: texto('origem') || null,
    autoriza_imagem: true, // o formulário só é enviado com a caixa marcada
    quer_novidades: texto('novidades') === 'Sim',
  };
}

function montarMensagem(i) {
  const linhas = [
    'Olá! Quero me inscrever na gravação dos clipes do EP Tributo, no dia 28/11.',
    '',
    `*Nome:* ${i.nome}`,
    `*E-mail:* ${i.email}`,
    `*Telefone:* ${i.telefone}`,
  ];
  if (i.origem) linhas.push(`*Como fiquei sabendo:* ${i.origem}`);
  linhas.push(
    '*Autorizo o uso da minha imagem e voz:* Sim',
    `*Quero receber novidades por WhatsApp e e-mail:* ${i.quer_novidades ? 'Sim' : 'Não'}`
  );
  return linhas.join('\n');
}

/* Devolve true quando a inscrição foi salva ou a pessoa já estava inscrita */
async function salvarInscricao(inscricao) {
  const controle = new AbortController();
  const limite = setTimeout(() => controle.abort(), 15000);
  try {
    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/inscricoes_tributo`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(inscricao),
      signal: controle.signal,
    });
    if (resposta.ok) return { salvo: true, jaInscrito: false };
    if (resposta.status === 409) return { salvo: true, jaInscrito: true };
    return { salvo: false };
  } catch {
    return { salvo: false };
  } finally {
    clearTimeout(limite);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const inscricao = lerInscricao();

  erroEnvio.hidden = true;
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = 'Enviando...';

  const { salvo, jaInscrito } = await salvarInscricao(inscricao);

  botaoEnviar.disabled = false;
  botaoEnviar.textContent = 'Confirmar inscrição';

  if (!salvo) {
    linkWhatsapp.href = `https://wa.me/${WHATSAPP_INSCRICOES}?text=${encodeURIComponent(montarMensagem(inscricao))}`;
    erroEnvio.hidden = false;
    return;
  }

  sucessoTitulo.textContent = jaInscrito ? 'Você já está inscrito(a)!' : 'Inscrição confirmada!';
  form.hidden = true;
  sucesso.hidden = false;
  sucesso.focus({ preventScroll: true });
  document.getElementById('inscricao').scrollIntoView();
});
