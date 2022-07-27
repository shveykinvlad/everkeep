import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private static readonly closeAction: string = 'X';

    constructor(public snackBar: MatSnackBar) { }

    showError(message: string): void {
        this.snackBar.open(message, NotificationService.closeAction);
    }
}
