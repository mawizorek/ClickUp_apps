/* Permanent polish layer for the weekend surfaces.
   Owns compact home-card styling, mobile table/podium fixes,
   and footer-label normalization after rerenders.
 */

const WEEKEND_POLISH_STYLE_ID = 'pp-weekend-polish-style';

function injectWeekendPolishStyle() {
  if (document.getElementById(WEEKEND_POLISH_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = WEEKEND_POLISH_STYLE_ID;
  style.textContent = `
    .tbl{table-layout:fixed !important}
    .tbl td,.tbl th{overflow-wrap:break-word !important;hyphens:auto !important}
    .tnote{font-size:.84rem !important;line-height:1.45 !important}
    @media (max-width:720px){
      .tbl th:nth-child(1),.tbl td:nth-child(1){width:10% !important}
      .tbl th:nth-child(2),.tbl td:nth-child(2){width:20% !important}
      .tbl th:nth-child(3),.tbl td:nth-child(3){width:16% !important}
      .tbl th:nth-child(4),.tbl td:nth-child(4){width:17% !important}
      .tbl th:nth-child(5),.tbl td:nth-child(5){width:37% !important}
      .podium-steps{gap:10px !important;align-items:flex-end !important}
      .podium-step{padding:14px 10px 12px !important;min-width:0 !important}
      .step-driver{font-size:.88rem !important;line-height:1.08 !important}
      .step-team{font-size:.68rem !important;line-height:1.2 !important}
      .step-pos{display:none !important}
    }
  `;
  document.head.appendChild(style);
}

function applyWeekendSurfacePolish() {
  injectWeekendPolishStyle();
  ensureWeekendFooterLabel();
}
