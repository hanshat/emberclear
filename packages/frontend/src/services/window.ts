import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { monitor } from 'ember-computed-promise-monitor';
import { computed } from '@ember/object';

interface UserChoice {
  outcome: 'accepted' | undefined;
}

// why is this not a built in type?
interface FakeBeforeInstallPromptEvent {
  prompt: () => Promise<void>;
  userChoice: Promise<UserChoice>;
}

export default class WindowService extends Service {
  @tracked deferredInstallPrompt?: FakeBeforeInstallPromptEvent;
  constructor(...args: any[]) {
    super(...args);

    let checkForDeferredInstall = setInterval(() => {
      this.deferredInstallPrompt = (window as any).deferredInstallPrompt;

      if (this.deferredInstallPrompt) {
        clearInterval(checkForDeferredInstall);
      }
    }, 100);
  }

  get hasDeferredInstall() {
    console.log(this.deferredInstallPrompt);
    return !!this.deferredInstallPrompt;
  }

  get isInstalled() {
    const result = (this.installStatus as any).result as UserChoice;

    return ((result || {}) as UserChoice).outcome === 'accepted';
  }

  @computed()
  @monitor
  get installStatus() {
    if (!this.deferredInstallPrompt) return;

    return this.deferredInstallPrompt.userChoice;
  }

  async promptInstall() {
    if (!this.deferredInstallPrompt) return;

    await this.deferredInstallPrompt.prompt();
  }
}