import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState, 
  fetchLatestBaileysVersion,
  WASocket
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import pino from 'pino';

let sock: WASocket | null = null;

export async function connectToWhatsApp() {
  if (sock) return sock;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logger: pino({ level: 'silent' }) as any
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        sock = null;
        connectToWhatsApp();
      }
    }
  });

  return sock;
}

// Ensure startup
connectToWhatsApp();

export async function sendWhatsAppMessage(number: string, message: string) {
  try {
    const s = await connectToWhatsApp();
    const formattedNumber = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
    await s.sendMessage(formattedNumber, { text: message });
  } catch (error) {
    console.error('Failed to send WA message:', error);
  }
}
