import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class JwtService {

    jwt: string;
    decodedJwt: { [key: string]: string };

    constructor() { }

    setToken(token: string): void {
        if (token) {
            this.jwt = token;
        }
    }

    decodeToken(): void {
        if (this.jwt) {
            this.decodedJwt = jwt_decode(this.jwt);
        }
    }

    getDecodeToken(): string {
        return jwt_decode(this.jwt);
    }

    getUser(): string {
        this.decodeToken();
        return this.decodedJwt ? this.decodedJwt.displayname : null;
    }

    getEmailId(): string {
        this.decodeToken();
        return this.decodedJwt ? this.decodedJwt.email : null;
    }

    getExpiryTime(): string {
        this.decodeToken();
        return this.decodedJwt ? this.decodedJwt.exp : null;
    }
}
