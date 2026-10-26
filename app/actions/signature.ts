'use server';
import { contactInput, consumePublicLimit, publicSourceHash, sendStaffNotification } from '../lib/public-action-security';

export async function submitSignature(input: unknown) {
  const data = contactInput(input);
  if (!data) return { success: false, error: 'Dati non validi' };
  try {
    if (!await consumePublicLimit('contact', await publicSourceHash(), 5)) return { success: false, error: 'Troppi tentativi' };
    await sendStaffNotification(`Nuova firma sulla barca\nNome: ${data.name}\nEmail: ${data.email}\nPagamento: ${data.payment}\nImporto: 2€`);
    return { success: true };
  } catch { return { success: false, error: 'Invio non disponibile' }; }
}
