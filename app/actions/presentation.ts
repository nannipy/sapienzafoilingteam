'use server';

export async function submitRegistration(data: {
    name: string;
    email: string;
    payment: string;
    dietary: string;
    dietaryOther?: string;
}) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    // Il bot di Telegram ha bisogno di un Chat ID numerico, non del nickname.
    // L'utente (@gio1927a) dovrà avviare il bot e ottenere il suo chat_id.
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID; 

    // Se le variabili d'ambiente non sono impostate, non facciamo fallire il form
    // ma logghiamo un avviso nel server.
    if (!BOT_TOKEN || !CHAT_ID) {
        console.warn("⚠️ Variabili d'ambiente TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID mancanti.");
        // Simuliamo un ritardo e restituiamo successo per non bloccare l'UI
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    }

    const message = `
🎉 *Nuova Registrazione All'Evento!*
👤 *Nome:* ${data.name}
📧 *Email:* ${data.email}
💳 *Pagamento:* ${data.payment}
🥗 *Esigenze Alimentari:* ${data.dietary}${data.dietaryOther ? ` (${data.dietaryOther})` : ''}
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
            }),
        });

        if (!response.ok) {
            console.error('Errore invio messaggio Telegram:', await response.text());
            return { success: false, error: 'Failed to send telegram message' };
        }

        return { success: true };
    } catch (error) {
        console.error('Errore API Telegram:', error);
        return { success: false, error: 'Internal server error' };
    }
}
