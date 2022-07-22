import { environment } from 'src/environments/environment';

export class ApiUrl {

    public static readonly users: string = environment.apiUrl + 'users'
    public static readonly confirmation: string = environment.apiUrl + 'users/confirmation';
    public static readonly login: string = environment.apiUrl + 'users/authenticate';
    public static readonly resetPassword: string = environment.apiUrl + 'users/password/reset';
    public static readonly updatePassword: string = environment.apiUrl + 'users/password/update';
    public static readonly refreshAccessToken: string = environment.apiUrl + 'users/authenticate/refresh';

    public static readonly notes: string = environment.apiUrl + 'notes';
    public static readonly notesSearch: string = environment.apiUrl + 'notes/search';
    public static readonly note: string = environment.apiUrl + 'notes/${id}';
}
