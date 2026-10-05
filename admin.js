import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = s => document.querySelector(s);
const esc = (t = "") => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const app = initializeApp(window.MARIAGE.firebase);
const auth = getAuth(app);
const db = getFirestore(app);

let reponses = [], stop = null;

$("#form-connexion").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, st = $("#statut-connexion");
  st.textContent = "Connexion…"; st.className = "form-statut";
  try {
    await signInWithEmailAndPassword(auth, f.email.value.trim(), f.mdp.value);
  } catch {
    st.textContent = "E-mail ou mot de passe incorrect."; st.className = "form-statut erreur";
  }
});
$("#btn-deco").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, user => {
  $("#form-connexion").hidden = !!user;
  $("#tableau-bord").hidden = !user;
  if (stop) { stop(); stop = null; }
  if (!user) return;
  stop = onSnapshot(query(collection(db, "rsvp"), orderBy("creeLe", "desc")), snap => {
    reponses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    afficher();
  }, err => {
    console.error(err);
    $("#lignes").innerHTML = `<tr><td colspan="9">Accès refusé : vérifiez que votre e-mail est bien listé dans les règles Firestore.</td></tr>`;
  });
});

const dateTxt = r => r.creeLe?.toDate ? r.creeLe.toDate().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "";

function afficher() {
  const oui = reponses.filter(r => r.presence === "oui");
  $("#s-presents").textContent = oui.reduce((s, r) => s + (r.nombre || 0), 0);
  $("#s-foyers").textContent = reponses.length;
  $("#s-absents").textContent = reponses.filter(r => r.presence === "non").length;
  $("#s-allergies").textContent = oui.filter(r => r.allergies).length;

  const q = $("#recherche").value.trim().toLowerCase();
  const liste = reponses.filter(r => !q || (r.nom + " " + r.accompagnants).toLowerCase().includes(q));
  $("#lignes").innerHTML = liste.length ? liste.map(r => `
    <tr>
      <td><b style="font-weight:500">${esc(r.nom)}</b></td>
      <td><span class="tag ${r.presence}">${r.presence === "oui" ? "Présent" : "Absent"}</span></td>
      <td>${r.presence === "oui" ? r.nombre : "–"}</td>
      <td>${esc(r.accompagnants)}</td>
      <td>${esc(r.allergies)}</td>
      <td>${esc(r.chanson)}</td>
      <td>${esc(r.message)}</td>
      <td style="white-space:nowrap">${dateTxt(r)}</td>
      <td><button class="suppr" data-id="${r.id}" title="Supprimer">✕</button></td>
    </tr>`).join("") : `<tr><td colspan="9" style="text-align:center;color:var(--doux)">Aucune réponse pour l'instant.</td></tr>`;
}
$("#recherche").addEventListener("input", afficher);

$("#lignes").addEventListener("click", async e => {
  const id = e.target.dataset?.id;
  if (!id) return;
  const r = reponses.find(x => x.id === id);
  if (confirm(`Supprimer la réponse de ${r?.nom} ?`)) await deleteDoc(doc(db, "rsvp", id));
});

function telecharger(nom, contenu, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([contenu], { type }));
  a.download = nom; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

$("#btn-csv").addEventListener("click", () => {
  const cols = ["nom", "presence", "nombre", "accompagnants", "allergies", "chanson", "message"];
  const cell = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lignes = [[...cols, "date"].join(";"), ...reponses.map(r => [...cols.map(c => cell(r[c])), cell(dateTxt(r))].join(";"))];
  telecharger("reponses-mariage.csv", "﻿" + lignes.join("\n"), "text/csv;charset=utf-8");
});

$("#btn-playlist").addEventListener("click", () => {
  const chansons = reponses.filter(r => r.chanson).map(r => `${r.chanson}  (${r.nom})`);
  telecharger("playlist-invites.txt", chansons.join("\n") || "Aucune chanson pour l'instant.", "text/plain;charset=utf-8");
});
