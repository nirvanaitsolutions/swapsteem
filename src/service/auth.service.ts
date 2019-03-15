import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

export interface MongoUserData {
    createdAt?: string;
    updatedAt?: string;
    username?: string;
    tos_accepted?: boolean;
    whitelisted?: boolean;
    __v?: number;
    _id?: string;
    password?: string;
    email?: string;
    email_valid?: boolean;
    reset_password_flag?: boolean;
    referredby?: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public userData: MongoUserData;

    constructor(private cookieService: CookieService) { }

    private authStateSubject = new BehaviorSubject<boolean>(
        this.cookieService.get('user_token') ? true : false
    );
    public get authState(): Observable<boolean> {
        return this.authStateSubject.asObservable();
    }

    token() {
        return this.cookieService.get('user_token')
    }

}
