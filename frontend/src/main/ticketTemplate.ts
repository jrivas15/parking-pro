import dayjs from 'dayjs';

const fmt = (dateStr: string) => dayjs(dateStr).format('DD/MM/YY HH:mm');
const money = (n: number) =>
  '$' + Number(n).toLocaleString('es-CO', { minimumFractionDigits: 0 });

const baseCSS = (paperWidth: string) => `
  @page { size: ${paperWidth === '58' ? '58mm' : '80mm'} auto; margin: 0; }
  * { box-sizing: border-box; }
  body {
    width: ${paperWidth === '58' ? '50mm' : '72mm'};
    font-family: 'Courier New', monospace;
    font-size: 11px;
    margin: 0;
    padding: 2mm;
  }
  .center { text-align: center; }
  .bold { font-weight: 700; }
  .sep { border: none; border-top: 1px dashed #000; margin: 3px 0; }
  .plate { font-size: 22px; font-weight: 700; text-align: center; letter-spacing: 2px; }
  .receipt { font-size: 18px; font-weight: 700; text-align: center; }
  .datetime { font-size: 13px; font-weight: 700; text-align: center; }
  .big-name { font-size: 22px; font-weight: 700; text-align: center; }
  .row { display: flex; justify-content: space-between; }
  .total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; }
  .rules { text-align: justify; font-size: 10px; }
  qr img { display: block; margin: 0 auto; }
`;

const html = (css: string, body: string) => `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>${css}</style>
</head><body>${body}</body></html>`;

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
  body += `<p class="datetime">FECHA: ${entryDate.format('DD-MM-YYYY')} &nbsp; HORA: ${entryDate.format('HH:mm:ss')}</p>`;
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

export function buildExitHTML(data: ExitPrintPayload): string {
  const { sale, info } = data;
  const paperWidth = info.paperWidth ?? '80';
  const mov = sale.movement;
  const cashBack = Number(sale.amountPaid) - Number(sale.total);
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

  body += `<div class="row"><span>Ticket #</span><span>${mov.nTicket}</span></div>`;
  body += `<div class="row"><span>Placa</span><span class="bold">${esc(mov.plate)}</span></div>`;
  body += `<div class="row"><span>Entrada</span><span>${fmt(mov.entryTime)}</span></div>`;
  body += `<div class="row"><span>Salida</span><span>${fmt(mov.exitTime)}</span></div>`;
  body += `<div class="row"><span>Tiempo</span><span>${esc(mov.parkingTime)}</span></div>`;
  if (mov.tariff?.name) {
    body += `<div class="row"><span>Tarifa</span><span>${esc(mov.tariff.name)}</span></div>`;
  }

  body += `<hr class="sep">`;

  body += `<div class="row"><span>M&eacute;todo</span><span>${esc(sale.paymentMethod?.name ?? '—')}</span></div>`;
  if (Number(sale.discount) > 0) {
    body += `<div class="row"><span>Descuento</span><span>${money(Number(sale.discount))}</span></div>`;
  }
  body += `<div class="total-row"><span>TOTAL</span><span>${money(Number(sale.total))}</span></div>`;
  if (cashBack > 0) {
    body += `<div class="row"><span>Vuelto</span><span>${money(cashBack)}</span></div>`;
  }

  body += `<hr class="sep">`;

  if (info.ticketFooter) {
    body += `<p class="center">${esc(info.ticketFooter)}</p>`;
  }
  body += `<p class="center">¡Gracias!</p>`;

  return html(baseCSS(paperWidth), body);
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
