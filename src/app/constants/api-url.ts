import { environment } from 'src/environments/environment';

export class ApiUrl {

    public static readonly register: string = environment.apiUrl + 'users/register';
    public static readonly confirm: string = environment.apiUrl + 'users/confirm';
    public static readonly resendToken: string = environment.apiUrl + 'users/confirm/resend';
    public static readonly login: string = environment.apiUrl + 'users/authenticate';
    public static readonly resetPassword: string = environment.apiUrl + 'users/password/reset';
    public static readonly updatePassword: string = environment.apiUrl + 'users/password/update';
    public static readonly refreshAccessToken: string = environment.apiUrl + 'users/authenticate/refresh';

    public static readonly notes: string = environment.apiUrl + 'notes';
    public static readonly notesSearch: string = environment.apiUrl + 'notes/search';
    public static readonly note: string = environment.apiUrl + 'notes/${id}';
}
