import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _messages = new BehaviorSubject<string[]>([]);
  public messages$ = this._messages.asObservable();

  show(message: string) {
    const current = this._messages.value;
    this._messages.next([...current, message]);
    setTimeout(() => {
      this.remove(message);
    }, 3000); // Toast автоматично зникне через 3 секунди
  }

  private remove(message: string) {
    const current = this._messages.value.filter(m => m !== message);
    this._messages.next(current);
  }
}
