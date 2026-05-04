'use server';

export async function submitRegistration(data: {
    name: string;
    email: string;
    payment: string;
    dietary: string;
    dietaryOther?: string;
}) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    // 👇 aggiungi qui tutti i destinatari
    const CHAT_IDS = [
        process.env.TELEGRAM_CHAT_ID, // quello che hai già
        "5901269690"                  // nuovo utente
    ].filter(Boolean); // rimuove eventuali undefined

    if (!BOT_TOKEN || CHAT_IDS.length === 0) {
        console.warn("⚠️ Config Telegram mancante");
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
        // 👇 invio a tutti
        await Promise.all(
            CHAT_IDS.map(chatId =>
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'Markdown',
                    }),
                })
            )
        );

        return { success: true };
    } catch (error) {
        console.error('Errore invio Telegram:', error);
        return { success: false, error: 'Internal server error' };
    }
}