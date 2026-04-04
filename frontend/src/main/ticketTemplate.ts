import dayjs from 'dayjs';

const fmt = (dateStr: string) => dayjs(dateStr).format('DD/MM/YY HH:mm');
const money = (n: number) =>
  '$' + Number(n).toLocaleString('es-CO', { minimumFractionDigits: 0 });

const baseCSS = (paperWidth: string) => `
  @page { size: ${paperWidth === '58' ? '58mm' : '80mm'} auto; margin: 0; }
  * { box-sizing: border-box; }
  body {
    width: ${paperWidth === '58' ? '50mm' : '72mm'};
    font-family: "Segoe UI", system-ui, sans-serif;
    font-size: 11px;
    margin: 0;
    padding: 2mm;
  }
  p { margin: 1px 0; }
  .center { text-align: center; }
  .bold { font-weight: 700; }
  .sep { border: none; border-top: 1px dashed #000; margin: 3px 0; }
  .sep-solid { border: none; border-top: 1px solid #000; margin: 4px 0; }
  .plate { font-size: 22px; font-weight: 700; text-align: center; letter-spacing: 2px; }
  .receipt { font-size: 18px; font-weight: 700; text-align: center; }
  .datetime { font-size: 13px; font-weight: 700; text-align: center; }
  .big-name { font-size: 22px; font-weight: 700; text-align: center; }
  .row { display: flex; justify-content: space-between; }
  .total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; }
  .rules { text-align: justify; font-size: 10px; }
  .details { width: 100%; border-collapse: collapse; }
  .details td { padding: 1px 0; vertical-align: top; }
  .details .lbl { white-space: nowrap; padding-right: 6px; }
  .right { text-align: right; }
  .total-right { text-align: right; font-weight: 700; font-size: 14px; }
`;

const DEV_FOOTER = `
  <hr class="sep">
  <p class="center" style="font-size:9px">Ambientes Seguros S.A.S &copy; ${new Date().getFullYear()}</p>
  <p class="center" style="font-size:9px">www.ambientes-seguros.com</p>
`;

const html = (css: string, body: string) => `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>${css}</style>
</head><body>${body}${DEV_FOOTER}</body></html>`;

export function buildEntryHTML(
  data: EntryPrintPayload,
  qrDataUrl?: string,
): string {
  const { movement, info } = data;
  const paperWidth = info.paperWidth ?? '80';
  const entryDate = dayjs(movement.entryTime);
  let body = '';

  body += `<p class="big-name">${esc(info.name)}</p>`;

  if (info.includeParkingInfo) {
    if (info.nit) body += `<p class="center">NIT: ${esc(info.nit)}</p>`;
    if (info.address) body += `<p class="center">DIRECCION: ${esc(info.address)}</p>`;
    if (info.phone) body += `<p class="center">Telefono: ${esc(info.phone)}</p>`;
  }

  if (info.ticketHeader) {
    for (const line of info.ticketHeader.split('\n')) {
      if (line.trim()) body += `<p class="center">${esc(line.trim())}</p>`;
    }
  }

  body += `<hr class="sep">`;
  body += `<p class="datetime">FECHA: ${entryDate.format('DD/MM/YYYY')} &nbsp; HORA: ${entryDate.format('HH:mm:ss')}</p>`;
  body += `<p class="receipt">RECIBO No: ${movement.nTicket.toLocaleString('es-CO')}</p>`;
  body += `<hr class="sep">`;

  if (qrDataUrl) {
    body += `<p class="center"><img src="${qrDataUrl}" width="80" height="80" alt="QR"></p>`;
  }

  body += `<p class="plate">${esc(movement.plate)}</p>`;
  body += `<hr class="sep">`;

  if (info.includeBasicRules && info.ticketFooter) {
    body += `<p class="bold center" style="font-size:13px">REGLAMENTO</p>`;
    body += `<p class="rules">${esc(info.ticketFooter)}</p>`;
    body += `<hr class="sep">`;
  } else if (info.ticketFooter) {
    body += `<p class="center">${esc(info.ticketFooter)}</p>`;
  }

  return html(baseCSS(paperWidth), body);
}

export function buildExitHTML(data: ExitPrintPayload, qrDataUrl?: string): string {
  const { sale, info } = data;
  const paperWidth = info.paperWidth ?? '80';
  const mov = sale.movement;
  const cashBack = Number(sale.amountPaid) - Number(sale.total);
  const fmtDt = (s: string) => dayjs(s).format('DD/MM/YYYY HH:mm:ss');
  let body = '';

  // --- Encabezado ---
  body += `<p class="big-name">${esc(info.name)}</p>`;

  if (info.includeParkingInfo) {
    if (info.nit)     body += `<p class="center">NIT: ${esc(info.nit)}</p>`;
    if (info.address) body += `<p class="center">DIRECCION: ${esc(info.address)}</p>`;
    if (info.phone)   body += `<p class="center">Telefono: ${esc(info.phone)}</p>`;
  }

  if (info.ticketHeader) {
    for (const line of info.ticketHeader.split('\n')) {
      if (line.trim()) body += `<p class="center">${esc(line.trim())}</p>`;
    }
  }

  // --- Número de recibo ---
  body += `<p class="receipt">RECIBO No. ${mov.nTicket.toLocaleString('es-CO')}</p>`;

  // --- QR ---
  if (qrDataUrl) {
    body += `<p class="center" style="margin:4px 0"><img src="${qrDataUrl}" width="100" height="100" alt="QR"></p>`;
  }

  // --- Placa ---
  body += `<p class="plate">Placa : ${esc(mov.plate)}</p>`;

  // --- Detalles ---
  body += `<hr class="sep">`;
  body += `<table class="details">`;
  body += `<tr><td class="lbl">Entrada:</td><td>${fmtDt(mov.entryTime)}</td></tr>`;
  body += `<tr><td class="lbl">Salida :</td><td>${fmtDt(mov.exitTime)}</td></tr>`;
  body += `<tr><td class="lbl">Tiempo :</td><td>${esc(mov.parkingTime)}</td></tr>`;
  if (mov.tariff?.name) {
    body += `<tr><td class="lbl">Tarifa :</td><td>${esc(mov.tariff.name)}</td></tr>`;
  }
  if (sale.paymentMethod?.name) {
    body += `<tr><td class="lbl">M&eacute;todo:</td><td>${esc(sale.paymentMethod.name)}</td></tr>`;
  }
  body += `</table>`;

  // --- Totales ---
  body += `<hr class="sep-solid">`;
  if (Number(sale.discount) > 0) {
    body += `<div class="right">Descuento ${money(Number(sale.discount))}</div>`;
  }
  body += `<div class="total-right">Total ${money(Number(sale.total))}</div>`;
  if (cashBack > 0) {
    body += `<div class="right">Vuelto ${money(cashBack)}</div>`;
  }
  body += `<hr class="sep-solid">`;

  // --- Pie (el reglamento es solo para tickets de ingreso) ---
  if (!info.includeBasicRules && info.ticketFooter) {
    for (const line of info.ticketFooter.split('\n')) {
      if (line.trim()) body += `<p class="center">${esc(line.trim())}</p>`;
    }
  }
  body += `<p class="center">¡Gracias!</p>`;

  return html(baseCSS(paperWidth), body);
}

const BILLS = [100_000, 50_000, 20_000, 10_000, 5_000, 2_000];
const COINS = [1_000, 500, 200, 100, 50];

export function buildCashCountHTML(data: CashCountPayload): string {
  const { counts, base, info } = data;
  const paperWidth = info.paperWidth ?? '80';
  const now = dayjs();
  const fmtNum = (n: number) => n.toLocaleString('es-CO', { minimumFractionDigits: 0 });

  const billsTotal = BILLS.reduce((s, d) => s + (counts[d] ?? 0) * d, 0);
  const coinsTotal = COINS.reduce((s, d) => s + (counts[d] ?? 0) * d, 0);
  const total = billsTotal + coinsTotal;
  const arqueo = total - base;

  const tableCSS = `
    .ct { width: 100%; border-collapse: collapse; font-size: 10px; }
    .ct th { text-align: left; border-bottom: 1px solid #000; padding: 1px 0; }
    .ct th:not(:first-child), .ct td:not(:first-child) { text-align: right; }
    .ct td { padding: 1px 0; }
    .section-title { font-weight: 700; font-size: 11px; margin: 4px 0 2px; }
    .total-line { display: flex; justify-content: space-between; font-weight: 700; font-size: 11px; margin-top: 2px; }
    .grand-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; margin-top: 4px; }
  `;

  const denomRow = (denom: number) => {
    const cnt = counts[denom] ?? 0;
    const val = cnt * denom;
    return `<tr><td>${fmtNum(denom)}</td><td>${cnt}</td><td>${fmtNum(val)}</td></tr>`;
  };

  let body = '';

  // --- Encabezado ---
  body += `<p class="big-name">${esc(info.name)}</p>`;
  if (info.includeParkingInfo) {
    if (info.nit)     body += `<p class="center">NIT: ${esc(info.nit)}</p>`;
    if (info.address) body += `<p class="center">DIRECCION: ${esc(info.address)}</p>`;
    if (info.phone)   body += `<p class="center">Telefono: ${esc(info.phone)}</p>`;
  }
  if (info.ticketHeader) {
    for (const line of info.ticketHeader.split('\n')) {
      if (line.trim()) body += `<p class="center">${esc(line.trim())}</p>`;
    }
  }

  // --- Fecha / hora ---
  body += `<p>Fecha: ${now.format('DD/MM/YYYY')}</p>`;
  body += `<p>Hora: ${now.format('hh:mm:ss A')}</p>`;

  // --- Título ---
  body += `<hr class="sep">`;
  body += `<p class="receipt">ARQUEO</p>`;
  body += `<hr class="sep">`;

  // --- Billetes ---
  body += `<p class="section-title">BILLETES</p>`;
  body += `<table class="ct"><thead><tr><th>Denominaci&oacute;n</th><th>Cant</th><th>Valor($)</th></tr></thead><tbody>`;
  BILLS.forEach(d => { body += denomRow(d); });
  body += `</tbody></table>`;
  body += `<div class="total-line"><span>TOTAL BILLETES........$</span><span>${fmtNum(billsTotal)}</span></div>`;

  // --- Monedas ---
  body += `<p class="section-title">MONEDAS</p>`;
  body += `<table class="ct"><thead><tr><th>Denominaci&oacute;n</th><th>Cant</th><th>Valor($)</th></tr></thead><tbody>`;
  COINS.forEach(d => { body += denomRow(d); });
  body += `</tbody></table>`;
  body += `<div class="total-line"><span>TOTAL MONEDAS ........$</span><span>${fmtNum(coinsTotal)}</span></div>`;

  // --- Resumen ---
  body += `<hr class="sep-solid">`;
  body += `<div class="total-line"><span>Total contado</span><span>$ ${fmtNum(total)}</span></div>`;
  body += `<div class="total-line"><span>Base</span><span>$ ${fmtNum(base)}</span></div>`;
  body += `<hr class="sep">`;
  body += `<div class="grand-total"><span>Total arqueo = $</span><span>${fmtNum(arqueo)}</span></div>`;

  return html(baseCSS(paperWidth) + tableCSS, body);
}

function expenseHeader(info: ParkingInfoForPrint, title: string): string {
  let body = '';
  body += `<p class="big-name">${esc(info.name)}</p>`;
  if (info.includeParkingInfo) {
    if (info.nit)     body += `<p class="center">NIT: ${esc(info.nit)}</p>`;
    if (info.address) body += `<p class="center">DIRECCION: ${esc(info.address)}</p>`;
    if (info.phone)   body += `<p class="center">Telefono: ${esc(info.phone)}</p>`;
  }
  if (info.ticketHeader) {
    for (const line of info.ticketHeader.split('\n')) {
      if (line.trim()) body += `<p class="center">${esc(line.trim())}</p>`;
    }
  }
  body += `<p style="font-size:9px" class="center">${dayjs().format('DD/MM/YYYY HH:mm:ss')}</p>`;
  body += `<hr class="sep">`;
  body += `<p class="receipt">${title}</p>`;
  body += `<hr class="sep">`;
  return body;
}

export function buildExpenseHTML(data: ExpensePrintPayload): string {
  const { expense, info } = data;
  const paperWidth = info.paperWidth ?? '80';
  let body = expenseHeader(info, 'COMPROBANTE DE GASTO');

  body += `<table class="details">`;
  body += `<tr><td class="lbl">ID:</td><td>${expense.id}</td></tr>`;
  body += `<tr><td class="lbl">Descripci&oacute;n:</td><td>${esc(expense.description)}</td></tr>`;
  if (expense.expenseType) {
    body += `<tr><td class="lbl">Tipo:</td><td>${esc(expense.expenseType)}</td></tr>`;
  }
  if (expense.paymentMethod) {
    body += `<tr><td class="lbl">M&eacute;todo:</td><td>${esc(expense.paymentMethod)}</td></tr>`;
  }
  body += `</table>`;
  body += `<hr class="sep-solid">`;
  body += `<div class="total-right">$ ${Number(expense.value).toLocaleString('es-CO')}</div>`;

  return html(baseCSS(paperWidth), body);
}

export function buildExpensesSummaryHTML(data: ExpensesSummaryPayload): string {
  const { expenses, total, info } = data;
  const paperWidth = info.paperWidth ?? '80';
  const summaryCSS = `
    .exp-table { width: 100%; border-collapse: collapse; font-size: 10px; }
    .exp-table th { text-align: left; border-bottom: 1px solid #000; padding: 1px 0; }
    .exp-table td { padding: 2px 0; vertical-align: top; }
    .exp-table td:last-child { text-align: right; white-space: nowrap; }
  `;

  let body = expenseHeader(info, 'RESUMEN DE GASTOS');

  body += `<table class="exp-table">`;
  body += `<thead><tr><th>Descripci&oacute;n</th><th>M&eacute;todo</th><th>Valor</th></tr></thead><tbody>`;
  for (const e of expenses) {
    body += `<tr>
      <td>${esc(e.description)}</td>
      <td>${e.paymentMethod ? esc(e.paymentMethod) : '—'}</td>
      <td>$ ${Number(e.value).toLocaleString('es-CO')}</td>
    </tr>`;
  }
  body += `</tbody></table>`;
  body += `<hr class="sep-solid">`;
  body += `<div class="total-right" style="font-size:13px">Total $ ${Number(total).toLocaleString('es-CO')}</div>`;

  return html(baseCSS(paperWidth) + summaryCSS, body);
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
