import { environment } from 'src/environments/environment';

export class ApiUrl {

    public static readonly id: string = '/${id}'

    public static readonly users: string = environment.apiUrl + '/users'
    public static readonly confirmation: string = this.users + '/confirmation';
    public static readonly password: string = this.users + '/password'
    public static readonly authentication: string = this.users + '/authentication';
    public static readonly refreshAccessToken: string = this.users + '/access';

    public static readonly notes: string = environment.apiUrl + '/notes';
    public static readonly search: string = this.notes + '/search';
    public static readonly note: string = this.notes + this.id;
}
