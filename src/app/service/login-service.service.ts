import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginServiceService {

    authenticated = false;
    private usersUrl = 'http://localhost:8080/users';  // URL to web api

    constructor(private http: HttpClient) {
    }

    authenticate(credentials, callback) {
        const headers = new HttpHeaders(credentials ? {
            authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        } : {});

        this.http.get(`${this.usersUrl}/login`, { headers: headers }).subscribe(response => {
            if (response['name']) {
                this.authenticated = true;
            } else {
                this.authenticated = false;
            }
            return callback && callback();
        });
    }

    logout() : Observable<string>{
        return this.http.post<string>('http://localhost:8080/logout', {});
    }
}
