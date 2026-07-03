/* Weather + footer/export surface synced to the shipped v5 app. */

async function loadWeather(t) {
  const body = document.getElementById("wx-body");
  const stamp = document.getElementById("wx-stamp");
  if (!body) return;

  const WMO = {
    0: ["Clear sky", "sun"],
    1: ["Mainly clear", "sun"],
    2: ["Partly cloudy", "cloud-sun"],
    3: ["Overcast", "cloud"],
    45: ["Fog", "cloud-fog"],
    48: ["Rime fog", "cloud-fog"],
    51: ["Light drizzle", "cloud-drizzle"],
    53: ["Drizzle", "cloud-drizzle"],
    55: ["Heavy drizzle", "cloud-drizzle"],
    61: ["Light rain", "cloud-rain"],
    63: ["Rain", "cloud-rain"],
    65: ["Heavy rain", "cloud-rain-wind"],
    71: ["Light snow", "cloud-snow"],
    73: ["Snow", "cloud-snow"],
    75: ["Heavy snow", "cloud-snow"],
    80: ["Light showers", "cloud-rain"],
    81: ["Showers", "cloud-rain"],
    82: ["Heavy showers", "cloud-rain-wind"],
    95: ["Thunderstorm", "cloud-lightning"],
    96: ["Storm + hail", "cloud-lightning"],
    99: ["Severe storm", "cloud-lightning"]
  };

  const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const dir = d => COMPASS[Math.round(d / 22.5) % 16];

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${t.lat}&longitude=${t.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=${encodeURIComponent(t.tz)}&forecast_days=16`;

  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status);

    const j = await r.json();
    const d = j.daily;
    const idx = {};
    d.time.forEach((tm, i) => idx[tm] = i);

    let html = '<div class="wx-grid">';
    t.sessions.forEach(s => {
      const i = idx[s.date];
      const dl = `${s.date.slice(8, 10)}/${s.date.slice(5, 7)}`;

      if (i === undefined) {
        html += `<div class="wx-day"><div class="d">${dl}</div><div class="sess">${s.sess}</div><div class="desc" style="margin-top:14px">Outside the 16-day forecast window. Check back closer to the weekend.</div></div>`;
        return;
      }

      const code = d.weather_code[i];
      const [desc, icon] = WMO[code] || ["—", "cloud"];
      const hi = Math.round(d.temperature_2m_max[i]);
      const lo = Math.round(d.temperature_2m_min[i]);
      const pop = d.precipitation_probability_max[i];
      const ws = Math.round(d.wind_speed_10m_max[i]);
      const wd = d.wind_direction_10m_dominant[i];

      html += `<div class="wx-day"><div class="d">${dl}</div><div class="sess">${s.sess}</div><div class="cond"><i data-lucide="${icon}"></i><div class="temp">${hi}°<small> / ${lo}°C</small></div></div><div class="desc">${desc}</div><div class="wx-row"><span><i data-lucide="droplets"></i>${pop == null ? "–" : pop + "%"} rain</span><span><i data-lucide="wind"></i>${ws} km/h <span style="display:inline-block;transform:rotate(${(wd + 180) % 360}deg)">↑</span> ${dir(wd)}</span></div></div>`;
    });

    html += "</div>";
    body.innerHTML = html;
    stamp.textContent = "Live · updated " + new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
    if (window.lucide) lucide.createIcons();
  } catch (e) {
    body.innerHTML = '<div class="wx-error">Couldn’t load live conditions right now. The forecast refreshes automatically next time this opens.</div>';
    stamp.textContent = "Live feed unavailable";
  }
}

function currentDataExport() {
  return {
    version: appDataMeta.version || APP_DATE,
    season: appDataMeta.season || Number(SEASON),
    tracks: TRACKS,
    raceResults,
    historicWinners
  };
}

function flash(btn, txt) {
  const original = btn.innerHTML;
  btn.classList.add("ok");
  btn.innerHTML = `<i data-lucide="check"></i>${txt}`;
  if (window.lucide) lucide.createIcons();
  setTimeout(() => {
    btn.classList.remove("ok");
    btn.innerHTML = original;
    if (window.lucide) lucide.createIcons();
  }, 1600);
}

function buildSource() {
  const clone = document.documentElement.cloneNode(true);
  const slot = clone.querySelector("#save-slot");
  if (slot) slot.innerHTML = "";
  return "<!DOCTYPE html>\n" + clone.outerHTML;
}

let _srcURL = null;
function freshSourceURL(mime) {
  if (_srcURL) {
    URL.revokeObjectURL(_srcURL);
    _srcURL = null;
  }
  const blob = new Blob([buildSource()], { type: mime });
  _srcURL = URL.createObjectURL(blob);
  setTimeout(() => {
    if (_srcURL) {
      URL.revokeObjectURL(_srcURL);
      _srcURL = null;
    }
  }, 90000);
  return _srcURL;
}

document.getElementById("t-copy").addEventListener("click", async e => {
  const src = buildSource();
  try {
    await navigator.clipboard.writeText(src);
    flash(e.currentTarget, "Source copied");
  } catch (_) {
    const ta = document.createElement("textarea");
    ta.value = src;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (__){ }
    ta.remove();
    flash(e.currentTarget, ok ? "Source copied" : "Copy failed");
  }
});

document.getElementById("t-prep").addEventListener("click", e => {
  const slot = document.getElementById("save-slot");
  slot.innerHTML = "";
  const a = document.createElement("a");
  a.href = freshSourceURL("text/html");
  a.download = "f1-racetracks-app.html";
  a.className = "save-link";
  a.textContent = "⤓ Save f1-racetracks-app.html";
  slot.appendChild(a);
  flash(e.currentTarget, "Ready → click Save");
});

document.getElementById("t-tab").addEventListener("click", e => {
  const w = window.open(freshSourceURL("text/plain"), "_blank");
  flash(e.currentTarget, w ? "Opened" : "Popup blocked");
});

document.getElementById("t-data").addEventListener("click", e => {
  const slot = document.getElementById("save-slot");
  slot.innerHTML = "";
  const blob = new Blob([JSON.stringify(currentDataExport(), null, 2)], { type: "application/json" });
  const u = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = u;
  a.download = "f1-racetracks-data.json";
  a.className = "save-link";
  a.textContent = "⤓ Save f1-racetracks-data.json";
  slot.appendChild(a);
  flash(e.currentTarget, "Ready → click Save");
  setTimeout(() => URL.revokeObjectURL(u), 90000);
});
