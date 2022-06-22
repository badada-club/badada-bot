import { app } from './app';
import { setWebHook } from './set-web-hook';

const PORT: string | number = process.env.PORT || 3000;

setWebHook().then(ok => {
    if(!ok)
        process.kill(process.pid, 'SIGTERM');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});