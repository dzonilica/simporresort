// ══════════════════════════════════════
// SIMPOR — Supabase client (browser, no build step)
// Loaded via <script type="module"> on booking + admin pages.
// ══════════════════════════════════════
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = 'https://djhrxrhucwfygnjvkqyl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Y_gyYHSpSc8tE1fbsC2SUA_aGXgZD8E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }
});

export const RESERVATIONS_TABLE = 'simpor_reservations';

// Pricing model used by booking + admin estimate.
// Prices are quoted on request; rooms/services kept here only as labels.
export const PRICING = {
  rooms: {
    suite: { label: 'Simpor Suite', perNight: 0 }
  },
  services: {
    training:     { label: 'Training Maintenance',  perNight: 0 },
    grooming:     { label: 'Grooming & Spa',        flat: 0 },
    play:         { label: 'Play & Enjoyment',      perNight: 0 },
    pickup:       { label: 'Pickup / Drop-off',     flat: 0 },
    vet_checkup:  { label: 'Veterinary Check-in',   flat: 0 },
    photos:       { label: 'Daily Photo Updates',   flat: 0 }
  },
  currency: '€'
};

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn), b = new Date(checkOut);
  const ms = b - a;
  return Math.max(0, Math.round(ms / 86400000));
}

export function calcEstimate(roomType, services, nights) {
  if (!nights) return 0;
  const room = PRICING.rooms[roomType] || PRICING.rooms.suite;
  let total = (room.perNight || 0) * nights;
  (services || []).forEach(s => {
    const svc = PRICING.services[s];
    if (!svc) return;
    if (svc.perNight) total += svc.perNight * nights;
    if (svc.flat) total += svc.flat;
  });
  return total;
}

export function fmtMoney(n) {
  return PRICING.currency + Number(n || 0).toFixed(0);
}

export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

export function shortRef(id) {
  if (!id) return '—';
  return id.replace(/-/g,'').slice(0,8).toUpperCase();
}
