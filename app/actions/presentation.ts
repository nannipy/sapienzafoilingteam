'use server';
import { contactInput, consumePublicLimit, publicSourceHash, sendStaffNotification } from '../lib/public-action-security';

export async function submitRegistration(input: unknown) {
  const data = contactInput(input, true);
  if (!data) return { success: false, error: 'Dati non validi' };
  try {
    if (!await consumePublicLimit('contact', await publicSourceHash(), 5)) return { success: false, error: 'Troppi tentativi' };
    await sendStaffNotification(`Nuova registrazione evento\nNome: ${data.name}\nEmail: ${data.email}\nPagamento: ${data.payment}\nEsigenze alimentari: ${data.dietary}${data.dietaryOther ? ` (${data.dietaryOther})` : ''}`);
    return { success: true };
  } catch { return { success: false, error: 'Invio non disponibile' }; }
}
