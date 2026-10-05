const M = window.MARIAGE;
const $ = (s, el = document) => el.querySelector(s);
const esc = (t = "") => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const dateMariage = new Date(M.date + "T12:00:00");
const dateLimite = new Date(M.dateLimiteReponse + "T23:59:59");
const fmtLong = d => d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const fmtCourt = d => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const majuscule = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Textes généraux ---------- */
const noms = `${M.maries.a} & ${M.maries.b}`;
document.title = `${noms} · ${fmtCourt(dateMariage)}`;
$("#nom-a").textContent = M.maries.a;
$("#nom-b").textContent = M.maries.b;
$("#nav-initiales").textContent = `${M.maries.a[0]} & ${M.maries.b[0]}`;
$("#hero-date").textContent = majuscule(fmtLong(dateMariage));
$("#programme-date").textContent = majuscule(fmtLong(dateMariage));
$("#date-limite").textContent = dateLimite.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }).replace(/^1 /, "1er ");
$("#pied-noms").textContent = noms;
$("#pied-date").textContent = fmtCourt(dateMariage);

/* ---------- Compte à rebours ---------- */
function compteur() {
  const diff = dateMariage - new Date();
  if (diff <= 0) {
    $("#compteur").innerHTML = `<div style="padding:10px 22px"><b>C'est le grand jour !</b></div>`;
    return;
  }
  $("#cd-j").textContent = Math.floor(diff / 864e5);
  $("#cd-h").textContent = Math.floor(diff / 36e5) % 24;
  $("#cd-m").textContent = Math.floor(diff / 6e4) % 60;
}
compteur();
setInterval(compteur, 30000);

/* ---------- Navigation ---------- */
const nav = $("#nav"), toggle = $("#nav-toggle"), liens = $("#nav-links");
const majNav = () => nav.classList.toggle("solide", window.scrollY > window.innerHeight * 0.6);
addEventListener("scroll", majNav, { passive: true });
majNav();
toggle.addEventListener("click", () => {
  const ouvert = liens.classList.toggle("ouvert");
  toggle.setAttribute("aria-expanded", ouvert);
  nav.classList.add("solide");
});
liens.addEventListener("click", e => { if (e.target.tagName === "A") { liens.classList.remove("ouvert"); majNav(); } });

/* ---------- Icônes ---------- */
const ICONES = {
  rings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="9" cy="14" r="5.5"/><circle cx="15" cy="14" r="5.5"/><path d="M10 4.5l2-2 2 2-2 2z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
  glass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 3h5l-.5 6a2 2 0 0 1-4 0zM13 3h5l.5 6a2 2 0 0 1-4 0zM8.5 11v8M15.5 11v8M6 21h5M13 21h5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  sms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>'
};

/* ---------- Lieux ---------- */
$("#lieux-liste").innerHTML = M.lieux.map((l, i) => {
  const q = encodeURIComponent(l.adresse);
  return `
  <article class="carte lieu apparait">
    <iframe loading="lazy" title="Plan : ${esc(l.titre)}" referrerpolicy="no-referrer-when-downgrade"
      src="https://maps.google.com/maps?q=${q}&z=${i === 0 ? 16 : 13}&output=embed"></iframe>
    <div class="lieu-corps">
      <span class="lieu-badge">${i === 0 ? "Mariage civil" : "Cérémonie & réception"}</span>
      <h3>${esc(l.titre)}</h3>
      <p class="lieu-sous">${esc(l.sousTitre)}</p>
      <p class="lieu-adresse">${esc(l.adresse)}</p>
      <ul>${l.acces.map(a => `<li>${esc(a)}</li>`).join("")}</ul>
      <div class="lieu-actions">
        <a class="btn btn-secondaire" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${q}">Google Maps</a>
        <a class="btn btn-secondaire" target="_blank" rel="noopener" href="https://waze.com/ul?q=${q}&navigate=yes">Waze</a>
      </div>
    </div>
  </article>`;
}).join("");

/* ---------- Programme ---------- */
$("#timeline").innerHTML = M.programme.map(p => `
  <li class="etape apparait">
    <div class="etape-icone">${ICONES[p.icone] || ICONES.heart}</div>
    <div class="etape-carte">
      <div class="etape-heure">${esc(p.heure)}</div>
      <p class="etape-titre">${esc(p.titre)}</p>
      <p class="etape-lieu">${esc(p.lieu)}</p>
    </div>
  </li>`).join("");

/* ---------- FAQ ---------- */
$("#faq-liste").innerHTML = M.faq.map((f, i) => `
  <details class="apparait"${i === 0 ? " open" : ""}>
    <summary>${esc(f.q)}</summary>
    <p>${esc(f.r)}${f.couleurs ? `<span class="couleurs">${f.couleurs.map(c => `<i style="background:${esc(c)}"></i>`).join("")}</span>` : ""}</p>
  </details>`).join("");

/* ---------- Témoins ---------- */
const COULEURS_AVATAR = ["#8C3A72", "#6E52A3", "#4F74AE", "#4F8F72"];
const groupes = {};
M.temoins.forEach(t => (groupes[t.role] ||= []).push(t));
let n = 0;
$("#temoins-liste").innerHTML = `<div class="temoins-groupes">${Object.entries(groupes).map(([role, liste]) => `
  <div class="temoins-groupe apparait">
    <h3>${esc(role.replace(/^Témoin/, "Témoins"))}</h3>
    <div class="temoins-grille">${liste.map(t => {
      const tel = t.tel.replace(/\s/g, "");
      const intl = "+33" + tel.slice(1);
      const ini = t.nom.split(" ").map(p => p[0]).join("").slice(0, 2);
      return `
      <div class="carte temoin">
        <div class="avatar" style="background:${COULEURS_AVATAR[n++ % 4]}">${esc(ini)}</div>
        <div class="temoin-infos">
          <p class="temoin-nom">${esc(t.nom)}</p>
          <p class="temoin-tel">${esc(t.tel)}</p>
        </div>
        <div class="temoin-actions">
          <a class="rond" href="tel:${intl}" aria-label="Appeler ${esc(t.nom)}">${ICONES.phone}</a>
          <a class="rond" href="sms:${intl}" aria-label="Envoyer un SMS à ${esc(t.nom)}">${ICONES.sms}</a>
        </div>
      </div>`;
    }).join("")}</div>
  </div>`).join("")}</div>`;

/* ---------- Animations d'apparition ---------- */
const obs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".apparait").forEach(el => obs.observe(el));

/* ---------- Formulaire RSVP ---------- */
const form = $("#form-rsvp"), statut = $("#form-statut"), blocPresent = $("#si-present");
const majPresence = () => {
  const v = form.presence.value;
  blocPresent.hidden = v === "non";
};
form.addEventListener("change", majPresence);
majPresence();

function erreur(msg, champ) {
  statut.textContent = msg;
  statut.className = "form-statut erreur";
  if (champ) { champ.closest(".champ")?.classList.add("invalide"); champ.focus?.(); }
}
form.addEventListener("input", e => e.target.closest(".champ")?.classList.remove("invalide"));
form.addEventListener("change", e => e.target.closest(".champ")?.classList.remove("invalide"));

let db = null, fs = null;
async function initFirebase() {
  if (db) return;
  if (!M.firebase || String(M.firebase.apiKey).startsWith("A_REMPLACER")) {
    throw new Error("config");
  }
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
  fs = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
  db = fs.getFirestore(initializeApp(M.firebase));
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  statut.textContent = ""; statut.className = "form-statut";
  if (form.site.value) return; // robot

  const nom = form.nom.value.trim();
  const presence = form.presence.value;
  if (nom.length < 2) return erreur("Merci d'indiquer votre nom.", form.nom);
  if (!presence) return erreur("Merci d'indiquer si vous serez présent·e.", form.querySelector("[name=presence]"));

  const coupe = (v, max) => v.trim().slice(0, max);
  const reponse = {
    nom: coupe(nom, 120),
    presence,
    allergies: presence === "oui" ? coupe(form.allergies.value, 300) : "",
    chanson: presence === "oui" ? coupe(form.chanson.value, 200) : "",
    message: coupe(form.message.value, 1000)
  };

  const btn = $("#btn-envoyer");
  btn.disabled = true; btn.textContent = "Envoi…";
  try {
    await initFirebase();
    await fs.addDoc(fs.collection(db, "rsvp"), { ...reponse, creeLe: fs.serverTimestamp() });
    form.hidden = true;
    const merci = $("#merci");
    merci.hidden = false;
    $("#merci-titre").textContent = presence === "oui" ? `Merci ${reponse.nom.split(" ")[0]} !` : "Merci pour votre réponse";
    $("#merci-texte").textContent = presence === "oui"
      ? `Nous avons hâte de vous retrouver le ${fmtCourt(dateMariage)} !`
      : "Vous nous manquerez. Merci d'avoir pris le temps de nous répondre.";
    merci.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (err) {
    console.error(err);
    erreur(err.message === "config"
      ? "Le formulaire n'est pas encore activé. Contactez un témoin en attendant."
      : "Oups, l'envoi a échoué. Vérifiez votre connexion et réessayez.");
  } finally {
    btn.disabled = false; btn.textContent = "Envoyer ma réponse";
  }
});

$("#btn-autre").addEventListener("click", () => {
  form.reset(); majPresence();
  $("#merci").hidden = true; form.hidden = false;
  form.nom.focus();
});
