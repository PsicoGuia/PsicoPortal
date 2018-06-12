import { Component } from '@angular/core';

/**
 * Generated class for the HeaderPiscoguiaComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header-piscoguia',
  templateUrl: 'header-piscoguia.html'
})
export class HeaderPiscoguiaComponent {

  text: string;

  constructor() {
    console.log('Hello HeaderPiscoguiaComponent Component');
    this.text = 'Hello World';
  }

}
