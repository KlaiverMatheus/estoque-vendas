import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEnvironmentInitializer } from '@angular/core';
import { routes } from './app.routes';

import { Auth } from './services/auth';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // isso permite as requisições http post e get
    provideHttpClient()
  ]
};
