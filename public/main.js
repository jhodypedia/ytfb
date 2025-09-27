// Token store
let TOKEN = localStorage.getItem("token") || "";

function headersJSON() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}`, "X-Timezone": tz };
}

async function apiGET(url){ const r=await fetch(url,{headers:headersJSON()}); return r.json(); }
async function apiPOST(url,body){ const r=await fetch(url,{method:"POST",headers:headersJSON(),body:JSON.stringify(body)}); return r.json(); }
async function apiDELETE(url){ const r=await fetch(url,{method:"DELETE",headers:headersJSON()}); return r.json(); }

// Mobile sidebar toggle
window.toggleSidebar = () => document.querySelector(".sidebar")?.classList.toggle("show");
