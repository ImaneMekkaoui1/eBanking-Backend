import { renderApplication } from '@angular/platform-server';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

export default function render(params: { document: string; url: string }): Promise<string> {
  return renderApplication(
    (context: BootstrapContext) => bootstrapApplication(AppComponent, config),
    {
      document: params.document,
      url: params.url,
    }
  );
}
