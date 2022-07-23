import { environment } from 'src/environments/environment';

export class ApiUrl {

    public static readonly users: string = environment.apiUrl + '/users'
    public static readonly confirmation: string = ApiUrl.users + '/confirmation';
    public static readonly password: string = ApiUrl.users + '/password'
    public static readonly authentication: string = ApiUrl.users + '/authentication';
    public static readonly refreshAccessToken: string = ApiUrl.users + '/access';

    public static readonly notes: string = environment.apiUrl + '/notes';
    public static readonly search: string = ApiUrl.notes + '/search';
    public static readonly note: string = ApiUrl.notes + '/${id}';
}
