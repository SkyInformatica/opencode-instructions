#!/usr/bin/env node
// Renova o token do SkyNet (POST /v2/account/login) e grava em token.json.
// Só o token fica em disco — a senha não é guardada em lugar nenhum.
//
//   node renovar-token.mjs <usuario> <senha>
//   SKYNET_EMAIL=... SKYNET_SENHA=... node renovar-token.mjs

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [, , usuario, senha] = process.argv;
const email = usuario || process.env.SKYNET_EMAIL;
const pass = senha || process.env.SKYNET_SENHA;
if (!email || !pass) {
  console.error("Uso: node renovar-token.mjs <usuario> <senha>");
  process.exit(1);
}

const BASE = (process.env.SKYNET_URL || "https://erp.skyinformatica.com.br").replace(/\/+$/, "");
const API = /\/skynet(\/api)?$/i.test(BASE) ? `${BASE}${/\/skynet\/api$/i.test(BASE) ? "" : "/api"}` : `${BASE}/skynet/api`;
const TOKEN_FILE = process.env.SKYNET_TOKEN_FILE || join(dirname(fileURLToPath(import.meta.url)), "token.json");
const TIMEOUT_MS = Number(process.env.SKYNET_TIMEOUT_MS || 30000);

const res = await fetch(`${API}/v2/account/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json;charset=UTF-8", Accept: "application/json" },
  body: JSON.stringify({ email, senha: pass }),
  signal: AbortSignal.timeout(TIMEOUT_MS),
});
const raw = await res.text();
if (!res.ok) {
  console.error(`Login falhou: HTTP ${res.status} ${res.statusText} — ${raw.slice(0, 500)}`);
  process.exit(1);
}
let token;
try {
  ({ token } = JSON.parse(raw || "{}"));
} catch {
  console.error("Resposta do login não é JSON:", raw.slice(0, 300));
  process.exit(1);
}
if (!token) {
  console.error("Login não retornou token — a conta pode exigir dupla autenticação.");
  process.exit(1);
}

const obtidoEm = new Date().toISOString();
writeFileSync(
  TOKEN_FILE,
  JSON.stringify({ token, obtidoEm, expiraAproximadamente: new Date(Date.now() + 8 * 3600e3).toISOString(), login: email }, null, 2)
);
console.log(`token gravado em ${TOKEN_FILE}`);
console.log(`expira aproximadamente em ${new Date(Date.now() + 8 * 3600e3).toLocaleString("pt-BR")}`);