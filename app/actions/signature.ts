'use server';

export async function submitSignature(data: {
    name: string;
    email: string;
    payment: string;
}) {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    const CHAT_IDS = [
        process.env.TELEGRAM_CHAT_ID,
        "5901269690"
    ].filter(Boolean);

    if (!BOT_TOKEN || CHAT_IDS.length === 0) {
        console.warn("⚠️ Config Telegram mancante");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    }

    const message = `
✍️ *Nuova Firma Sulla Barca!*
👤 *Nome:* ${data.name}
📧 *Email:* ${data.email}
💳 *Pagamento:* ${data.payment}
💰 *Importo:* 2€
    `;

    try {
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
