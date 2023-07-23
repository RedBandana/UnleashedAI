import { Agenda } from 'agenda';
import { removeExpiredTokens } from "./controllers/authentication";

const mongoConnectionString = process.env.DB_CONN_STRING || '';
const agenda = new Agenda({
    db: { address: mongoConnectionString },
});

async function removeExpiredTokensJob() {
    removeExpiredTokens();
}

export async function startAgenda() {
    await agenda.start();

    agenda.define('removeExpiredTokens', removeExpiredTokensJob);
    agenda.every('0 1 * * *', 'removeExpiredTokens'); // Run removeExpiredAccessToken once a day at 1:00 AM
    
    console.log('Agenda started');
}