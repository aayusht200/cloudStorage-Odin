import 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    await import('dotenv/config');
}
import { app } from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
