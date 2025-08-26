import cors from 'cors';

const corsMiddleware = cors ({
    origin: 'http://localhost:8081',
    credentials: true,
});
