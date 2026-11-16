// ===================== Códigos de verificación de 6 dígitos =====================
// Se guardan en memoria: si se reinicia el servidor hay que pedir otro código.

const crypto = require('crypto');

const EXPIRATION_MS = 10 * 60 * 1000; // 10 minutos
const MAX_ATTEMPTS = 5;

const codes = new Map(); // clave: "proposito:userId" -> { code, expires, attempts }

const createCode = (purpose, userId) => {
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    codes.set(`${purpose}:${userId}`, { code, expires: Date.now() + EXPIRATION_MS, attempts: 0 });
    return code;
};

// Devuelve null si el código es correcto, o un mensaje de error si no
const checkCode = (purpose, userId, code) => {
    const key = `${purpose}:${userId}`;
    const entry = codes.get(key);

    if (!entry) return 'No hay un código pendiente, pedí uno nuevo';
    if (Date.now() > entry.expires) {
        codes.delete(key);
        return 'El código expiró, pedí uno nuevo';
    }
    if (entry.attempts >= MAX_ATTEMPTS) {
        codes.delete(key);
        return 'Demasiados intentos, pedí un código nuevo';
    }
    if (String(code).replace(/\D/g, '') !== entry.code) {
        entry.attempts++;
        return 'El código es incorrecto';
    }

    codes.delete(key); // se usa una sola vez
    return null;
};

module.exports = { createCode, checkCode };
