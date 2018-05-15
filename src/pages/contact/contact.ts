import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartService } from '../../providers/cart-service';
import { ConfigService } from '../../providers/config-service';
import { ContentService } from '../../providers/content-service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from '../../providers/user-service';
/**
 * Generated class for the Contact page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google: any;

 @IonicPage({
   segment: 'contacto'
 })
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class Contact {

  lat1 = 4.666527;
  lng1 = -74.0574349;
  lat2 = 4.6034004;
  lng2 = -74.1929706;
  lat3 = 5.541242;
  lng3 = -73.358189;
  lat4 = 5.068293;
  lng4 = -75.514717;
  lat5 = 6.209683;
  lng5 = -75.569095;

  slidesListMid: Array<{ image: string }>;
  loadingSlidesMid = true;  


  myForm: FormGroup = this.formBuilder.group({
    'name': ['', [Validators.required, Validators.minLength(3), this.configService.nameValidator.bind(this)]],
    'email': ['', [Validators.required, this.configService.emailValidator.bind(this)]],
    'phone': ['', []],
    'text': ['', [Validators.required]],
  });

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cartService: CartService, public configService: ConfigService,
    public contentService: ContentService, public userService: UserService,
    public formBuilder: FormBuilder) {
      this.slidesListMid = [];
      this.loadSlider();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad Contact');
    this.contentService.analyticsPage('#/contacto');
  }

  ionViewWillEnter(){
      this.loadMap();
  }

  loadMap() {

    var smokersLatLng1 = {lat: this.lat1, lng: this.lng1};
    var smokersLatLng2 = {lat: this.lat2, lng: this.lng2};
    var smokersLatLng3 = {lat: this.lat3, lng: this.lng3};
    var smokersLatLng4 = {lat: this.lat4, lng: this.lng4};
    var smokersLatLng5 = {lat: this.lat5, lng: this.lng5};

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: smokersLatLng3
    });
    var marker1 = new google.maps.Marker({
      position: smokersLatLng1,
      map: this.map,
      title: 'SMOKERS',
    });
    var marker2 = new google.maps.Marker({
      position: smokersLatLng2,
      map: this.map,
      title: 'SMOKERS',
    });
    var marker3 = new google.maps.Marker({
      position: smokersLatLng3,
      map: this.map,
      title: 'SMOKERS TUNJA',
    });
    var marker4 = new google.maps.Marker({
      position: smokersLatLng4,
      map: this.map,
      title: 'SMOKERS MANIZALES',
    });

    var marker5 = new google.maps.Marker({
      position: smokersLatLng5,
      map: this.map,
      title: 'SMOKERS MEDELLÍN',
    });

    var info1 = '<div class="contact-info" style="font-family: Roboto, \"Helvetica Neue\", sans-serif;"><strong>Smokers</strong><br/>'+
      '<p>Oficina Principal' +
      '<br>Horario de Atención:' +
      '<br>Lunes a Viernes: 9:00 am - 8:00 pm' +
      '<br>Sabados: 9:00 am - 4:00 pm' +      
      '<br>Domingos y Festivos: No hay servicio</p>' +
      '</div>';

    var info2 = '<div class="contact-info" style="font-family: Roboto, \"Helvetica Neue\", sans-serif;"><strong>Smokers</strong><br/>'+
      '<p>Punto de atención sur' +
      '<br>Horario de Atención:' +
      '<br>Lunes a Viernes: 10:30 am - 7:00 pm' +
      '<br>Sabados: 10:30 am - 7:00 pm' +      
      '<br>Domingos y Festivos: No Hay servicio</p>' +
      '</div>';

    var info3 = '<div class="contact-info" style="font-family: Roboto, \"Helvetica Neue\", sans-serif;"><strong>Smokers</strong><br/>'+
    '<p>Punto de atención Tunja' +
    '<br>Horario de Atención:' +
    '<br>Lunes a Sabado: 10:30 am - 7:00 pm' + 
    '<br>Domingos y Festivos: No Hay servicio</p>' +
    '</div>';

    var info4 = '<div class="contact-info" style="font-family: Roboto, \"Helvetica Neue\", sans-serif;"><strong>Smokers</strong><br/>'+
      '<p>Punto de atención Manizales' +
      '<br>Horario de Atención:' +
      '<br>Lunes a Sabado: 10:30 am - 7:00 pm' + 
      '<br>Domingos y Festivos: No Hay servicio</p>' +
      '</div>';

    var info5 = '<div class="contact-info" style="font-family: Roboto, \"Helvetica Neue\", sans-serif;"><strong>Smokers</strong><br/>'+
    '<p>Punto de atención Medellín' +
    '<br>Horario de Atención:' +
    '<br>Lunes a Miercoles: 12:00 pm - 6:00 pm' + 
    '<br>Jueves a Sábado: 12 pm - 8:00 pm</p>' +
    '<br>Atencion Telefonica y Whats App:' +  
    '<br>Lunes a Sábado: 9:00 am - 8:00 pm' +
    '<br>Domingos y Festivos: No Hay servicio' +             
    '</div>';


    var infoWindow1 = new google.maps.InfoWindow({
      content: info1
    });

    var infoWindow2= new google.maps.InfoWindow({
      content: info2
    });

    var infoWindow3 = new google.maps.InfoWindow({
      content: info3
    });

    var infoWindow4= new google.maps.InfoWindow({
      content: info4
    });

    var infoWindow5= new google.maps.InfoWindow({
      content: info5
    });

    marker1.addListener('click', function() {
      infoWindow1.open(this.map, marker1);
    });

    marker2.addListener('click', function() {
      infoWindow2.open(this.map, marker2);
    });

    marker3.addListener('click', function() {
      infoWindow3.open(this.map, marker3);
    });

    marker4.addListener('click', function() {
      infoWindow4.open(this.map, marker4);
    });

    marker5.addListener('click', function() {
      infoWindow5.open(this.map, marker5);
    });
  }

  goHome(){
    this.navCtrl.setRoot('Home');
  }

  loadSlider(){
    this.contentService.getHomeSlideMid().then((dataSlidesMid) => {
      this.loadingSlidesMid = false;
      if (!dataSlidesMid[0]) {
        this.configService.showToast("Error al obtener elementos", "toast-failed");
      }
      this.slidesListMid = dataSlidesMid;

    }, (err) => {
      this.loadingSlidesMid = false;
      this.configService.showToast(err, "toast-failed");
    });
  }

  contactForm(){
    this.userService.getStoredUser().then((data) => {
      console.log('Usuario nuevo', data);
      if (data) {
        this.myForm.value.name = data.first_name +' '+data.last_name;
        this.myForm.value.email = data.email;
        this.myForm.value.phone = data.person.phone;
      }
      this.sendFormContact();
    }, (error) => {
      if(this.myForm.valid){
        this.sendFormContact();
      } else {
        this.configService.dismissLoader();
        this.configService.showToast("Debes llenar todos los campos requeridos", "toast-failed");
      }
    });

    this.configService.showLoader("Enviando...");
      console.log('Formulario Contacto', this.myForm);
  }

  sendFormContact(){
    this.contentService.contactform(this.myForm.value.name, this.myForm.value.email,
      this.myForm.value.phone, this.myForm.value.text).then((user)=>{

      this.configService.showToast("Te estaremos contactando a la brevedad para darte más detalles.", "toast-success");
      this.configService.dismissLoader();
    }, (err) => {
      this.configService.dismissLoader();
      //console.log(err);
    });
  }

}
