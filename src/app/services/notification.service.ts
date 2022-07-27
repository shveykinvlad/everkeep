import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';

const CLOSE_ACTION: string = 'X';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(public snackBar: MatSnackBar) { }

    showError(message: string): void {
        this.snackBar.open(message, CLOSE_ACTION);
    }
}
