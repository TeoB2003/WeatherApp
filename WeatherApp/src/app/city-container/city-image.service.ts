import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class CityImageService {
  private readonly URL = 'https://images.unsplash.com/photo-1507961455425-0caef37ef6fe?q=80&w=2408&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  constructor(private http: HttpClient) {}

  getCityImage(): string {
    return this.URL;
  }
}
