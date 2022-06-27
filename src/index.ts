import { app, bot } from './app';
import { HEROKU_APP_NAME } from './config';
import { getAppUri } from './heroku-utils';

bot.setWebHook(getAppUri(HEROKU_APP_NAME)).then(ok => {
    if(!ok)
        process.kill(process.pid, 'SIGTERM');
});

const PORT: string | number = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});

async function cleanup(): Promise<void> {
    console.log('Cleaning up...');
    await bot.terminate();
    await new Promise<void>((resolve, reject) => {
        if(server.listening)
            server.close((err) => err ? reject() : resolve());
    });
    console.log('Done.');
}

process.on('uncaughtExceptionMonitor', async (e) => {
    console.error('Process terminated due an uncaught exception...');
    if(e) {
        console.error(e.toString());
        console.error(e.stack);
    }
    await cleanup();
});
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((eventType) => {
    process.on(eventType, async (e) => {
        console.error(`Process terminated due to ${eventType} signal.`);
        try {
            await cleanup();
        } finally {
            process.exit();
        }
    });
});