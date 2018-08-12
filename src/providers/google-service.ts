import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GoogleServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleService {

  public apikey: string = "AIzaSyCQccce99Xzt23VYwc4GShNc2QC6Zq3dOI"; //FIXME
  public autocomplete: any;
  public options: any = {
    types: ['address']
    // ,componentRestrictions: {country: 'co'}
  };
  constructor(public http: HttpClient) {
    console.log('Hello GoogleService');
  }


  fillInAddress() {

  }


  searchAddress(address: string): Promise<any> {
    let encodedAdd = encodeURIComponent(address);
    return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodedAdd + "&region=co&key=" + this.apikey)
      .toPromise()
      .then(response => {
        console.log("GoogleService:searchAddress", response);
        let rs: any = response;
        if (rs.results.length === 0) {
          throw 'No se encontro direccion';
        }
        return rs.results[0].geometry.location;
      })
      .catch(this.handleError);
  }


  isPointInsidePolygon(point, poly) {
    var x = point.latitude, y = point.longitude;

    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i].latitude, yi = poly[i].longitude;
      var xj = poly[j].latitude, yj = poly[j].longitude;

      var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  };

  private handleError(error: any): Promise<any> {
    let errorMessage = 'Error al iniciar';
    if (typeof error === "string") {
      errorMessage = error;
    }
    return Promise.reject(errorMessage);
  }
}
