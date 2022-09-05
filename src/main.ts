import App from './app';
import { TYPES } from './types';
import { appContainer } from './inversify.config';

const app = appContainer.get<App>(TYPES.Application);
app.init();

export { app };
