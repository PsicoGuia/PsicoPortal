import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams, Content, IonicPage, Platform } from 'ionic-angular';
import { ProductService } from '../../providers/product-service';
import { ConfigService } from '../../providers/config-service';
import { CartService } from '../../providers/cart-service';
import { ContentService } from '../../providers/content-service';
import { AlertController, Modal, ModalController} from 'ionic-angular';

@IonicPage({
  segment: 'producto/:name/:id'
})
@Component({
  selector: 'page-product',
  templateUrl: 'product.html'
})
export class Product {

  //--------------------------------------
  //CONSTANTS
  //--------------------------------------s

  ID_LIQUIDS: Array<number> = [4,11,12];
  ml_10: number = 1;
  IDS_KITS: Array<number> = [3];

  //--------------------------------------
  //ATTRIBUTES
  //--------------------------------------

  product: { id: number, odoo_id: number, name: string, categ_id:Array<any>, photos: Array<any>, price: number, description: string, qty_available: number, variants: Array<any>, price_discount: number, discount: string};
  mainImage: string;
  loadingProduct = true;
  suggestproducts: any;
  loadingSuggests = true;
  quantity: number = 1;
  currentProduct: { id: number, odoo_id: number, name: string, categ_id:Array<any>, photos: Array<any>, price: number, description: string, qty_available: number, kit_id: any  , price_discount: number, discount: string};
  liquids: Array<{ id: number, odoo_id: number, name: string, price: number, photos: Array<any>, levelNicotine: Array<any>, variants: Array<any>, kit_id: any }>;
  preSelect = {
    batteryCapacity: [],
    mlCapacity: [],
    case: [],
    color: [],
    levelNicotine: [],
    oHm: [],
    electricResistance: [],
    flavor: [],
    reference: [],
    GA: []
  };

  att = {
    batteryCapacity: [],
    mlCapacity: [],
    case: [],
    color: [],
    levelNicotine: [],
    oHm: [],
    electricResistance: [],
    flavor: [],
    reference: [],
    GA: []
  };
  idVariant: number;

  //--------------------------------------
  //SELECTS COMPONENTS
  //--------------------------------------

  batteryCapacity: any;
  mlCapacity: any;
  case: any;
  color: any;
  levelNicotine: any;
  oHm: any;
  electricResistance: any;
  flavor: any;
  reference: any;
  GA:any;

  pName: string;
  pId: number;

  shoppingModal: Modal;

  @ViewChild(Content) content: Content;

  //--------------------------------------
  //CONSTRUCTOR
  //--------------------------------------

  constructor(public navCtrl: NavController, public navParams: NavParams, public productService: ProductService,
    public configService: ConfigService, public cartService: CartService, public contentService: ContentService,
    public platform: Platform, public alertCtrl: AlertController, private modal: ModalController) {
    //console.log('constructor ShopPage');
    this.quantity = 1;
    this.liquids = [];

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ShopPage');
    if(this.pName && this.pId){
      this.contentService.analyticsPage('#/producto/'+this.pName+'/'+this.pId);
    }
  }


  ionViewWillEnter() {
    this.productService.getAttributes().then((dataAtt) => {
      //console.log("shop ionViewWillEnterresp.flavor.push(pIdAtt2.id, pIdAtt2.name);");
      this.idVariant = 0;
      let id = this.navParams.get('id');
      if (this.navParams.get('product')) {
        this.pName = this.navParams.get('name');
        this.pId = this.navParams.get('id');
        this.ionViewDidLoad();
        let pAdd: any;
        pAdd = this.productService.getDiscountsByProduct(this.navParams.get('product'));
        this.product = pAdd;
        if(this.product.qty_available > 0){
          for (let pv of this.product.variants) {
              if(pv.qty_available > 0){
                break;
              }
              this.idVariant++;
          }
        }
        let pCurPro: any
        pCurPro = this.productService.getDiscountsByProduct(this.product.variants[this.idVariant]);
        this.currentProduct = pCurPro;

        if(!this.currentProduct.discount){
          if(this.product.discount){
            this.currentProduct.discount = this.product.discount;
            this.currentProduct.price_discount = this.product.price_discount;
          }
        }

        //get attributes of product
        // IDEA:
        this.att = this.getAttributes(this.product);
        for (let i = 0; i < this.att.levelNicotine.length; i++) {
          for (let j = 0; j < this.att.levelNicotine.length-1; j++) {
            if(this.att.levelNicotine[j][1]>this.att.levelNicotine[j+1][1]){
              let aux = this.att.levelNicotine[j+1];
              this.att.levelNicotine[j+1] = this.att.levelNicotine[j];
              this.att.levelNicotine[j] = aux;
            }
          }
        }
        this.att.mlCapacity = this.att.mlCapacity.sort();
        this.changeSelects(this.currentProduct);
        if (this.product.categ_id.indexOf(this.IDS_KITS[0]) != -1) {
          this.productService.getProducts(this.ID_LIQUIDS, 2000, '', true).then((liq) => {
            if (this.liquids.length == 0) {
              for (let variable1 of liq) {
                if (variable1.qty_available > 0) {
                  let ax = {...variable1, variants: []};
                  for (let lvr of variable1.variants) {
                    if(lvr.qty_available > 0){
                      if(lvr.attribute_value_ids.indexOf(this.ml_10) != -1){
                        ax.variants.push(lvr);
                      }
                    }
                  }
                  if(ax.variants.length > 0){
                      this.liquids.push(ax);
                  }
                }
              }
              for (let pLi of this.liquids) {
                pLi.levelNicotine = this.getAttributes(pLi).levelNicotine;
                for (let i = 0; i < pLi.levelNicotine.length; i++) {
                  for (let j = 0; j < pLi.levelNicotine.length-1; j++) {
                    if(pLi.levelNicotine[j][1] > pLi.levelNicotine[j+1][1]){
                      var aux = pLi.levelNicotine[j+1];
                      pLi.levelNicotine[j+1] = pLi.levelNicotine[j];
                      pLi.levelNicotine[j] = aux;
                    }
                  }
                }
                pLi.price = 0;
              }
            }
            this.loadingProduct = false;
          }, (err) => {
            this.loadingProduct = false;
            this.configService.showToast(err, "toast-failed");
          });
        }else{
          this.loadingProduct = false;
        }
        //this.selectItems(this.currentProduct, "");
        if (this.currentProduct.photos && this.currentProduct.photos[0]) {
          this.mainImage = this.currentProduct.photos[0].image;
        } else {
          this.mainImage = "assets/img/no-imagen.jpg";
        }
      } else {
        //  load it
        //console.log("loading product odoo_id: " + id);
        this.loadProductById(id);
      }
    }, (err) => {
      this.loadingProduct = false;
      this.configService.showToast(err, "toast-failed");
    });
  }


  loadProductById(id) {
    // TODO TEST
    this.idVariant = 0;
    this.loadingProduct = true;
    this.productService.getProductById(id).then((data) => {
      this.productService.getDiscounts().then((ds) => {
        if (data && data.id) {

          let pAdd: any;
          pAdd = this.productService.getDiscountsByProduct(data);
          this.product = pAdd;
          let pCurPro: any
          if(this.product.qty_available > 0){
            for (let pv of this.product.variants) {
                if(pv.qty_available > 0){
                  break;
                }
                this.idVariant++;
            }
          }
          pCurPro = this.productService.getDiscountsByProduct(this.product.variants[this.idVariant]);
          this.currentProduct = pCurPro;
          if(!this.currentProduct.discount){
            if(this.product.discount){
              this.currentProduct.discount = this.product.discount;
              this.currentProduct.price_discount = this.product.price_discount;
            }
          }

          if (this.currentProduct.photos && this.currentProduct.photos[0]) {
            this.mainImage = this.currentProduct.photos[0].image;
            //this.selectItems(this.currentProduct, "");
          } else {
            this.mainImage = "assets/img/no-imagen.jpg";
          }
        } else {
          this.configService.showToast("No se encontró el producto deseado", "toast-failed");
        }

        //get attributes of product
        // IDEA:
        this.att = this.getAttributes(data);
        // console.log('que pasa aqui', this.att);
        
        for (let i = 0; i < this.att.levelNicotine.length; i++) {
          for (let j = 0; j < this.att.levelNicotine.length-1; j++) {
            if(this.att.levelNicotine[j][1] > this.att.levelNicotine[j+1][1]){
              var aux = this.att.levelNicotine[j+1];
              this.att.levelNicotine[j+1] = this.att.levelNicotine[j];
              this.att.levelNicotine[j] = aux;
            }
          }
        }
        this.att.mlCapacity = this.att.mlCapacity.sort();
        this.changeSelects(this.currentProduct);
      });
      if (data.categ_id.indexOf(this.IDS_KITS[0])  != -1) {
        this.productService.getProducts(this.ID_LIQUIDS, 2000, '', false).then((liq) => {
          this.loadingProduct = false;
          if (this.liquids.length == 0) {
            for (let variable1 of liq) {
              if (variable1.qty_available > 0) {
                let ax = {...variable1, variants: []};
                for (let lvr of variable1.variants) {
                  if(lvr.qty_available > 0){
                    if(lvr.attribute_value_ids.indexOf(this.ml_10) != -1){
                      ax.variants.push(lvr);
                    }
                  }
                }
                if(ax.variants.length > 0){
                    this.liquids.push(ax);
                }
              }
            }
            for (let pLi of this.liquids) {
              pLi.levelNicotine = this.getAttributes(pLi).levelNicotine;
              for (let i = 0; i < pLi.levelNicotine.length; i++) {
                for (let j = 0; j < pLi.levelNicotine.length-1; j++) {
                  if(pLi.levelNicotine[j][1] > pLi.levelNicotine[j+1][1]){
                    var aux = pLi.levelNicotine[j+1];
                    pLi.levelNicotine[j+1] = pLi.levelNicotine[j];
                    pLi.levelNicotine[j] = aux;
                  }
                }
              }
              pLi.price = 0;
            }
          }
        });
      }else{
        this.loadingProduct = false;
      }
    }, (err) => {
      this.loadingProduct = false;
      this.configService.showToast(err, "toast-failed");
    });
  }

  getAttributes(id) {
    ////console.log('listo', this.productService.getAttributeById(id, this.product));
    return this.productService.getAttributeById(id);
  }

  changeMainImage(photo) {
    this.mainImage = photo.image;
  }


  addToCart(product: any, quantity: number, ids: Array<any>) {
    //console.log('ESTE SON LOS PRODUCTOS AGREGADOS', product);
    if(this.att.batteryCapacity.length != 0){
        if(!this.batteryCapacity){
          this.configService.showToast('Seleccione una capacidad para la bateria', "toast-failed");
          return;
        }
    }

    if(this.att.case.length != 0){
        if(!this.case){
          this.configService.showToast('Seleccione el tamaño del case', "toast-failed");
        }
    }

    if(this.att.color.length != 0){
        if(!this.color){
          this.configService.showToast('Seleccione un color', "toast-failed");
          return;
        }
    }

    if(this.att.electricResistance.length != 0){
        if(!this.electricResistance){
          this.configService.showToast('Seleccione una resistencia electrica', "toast-failed");
          return;
        }
    }

    if(this.att.flavor.length != 0){
        if(!this.flavor){
          this.configService.showToast('Seleccione un sabor', "toast-failed");
          return;
        }
    }

    if(this.att.levelNicotine.length != 0){
        if(!this.levelNicotine){
          this.configService.showToast('Seleccione un nivel de nicotina', "toast-failed");
          return;
        }
    }

    if(this.att.mlCapacity.length != 0){
        if(!this.mlCapacity){
          this.configService.showToast('Seleccione una capacidad en ml', "toast-failed");
          return;
        }
    }

    if(this.att.oHm.length != 0){
        if(!this.oHm){
          this.configService.showToast('Seleccione un oHm', "toast-failed");
          return;
        }
    }

    if(this.att.reference.length != 0){
      if(!this.reference){
        this.configService.showToast('Seleccione una referencia', "toast-failed");
        return;
      }
    }

    if(this.att.GA.length != 0){
        if(!this.GA){
          this.configService.showToast('Seleccione un GA', "toast-failed");
          return;
        }
    }

    if ((product[0].qty_available - quantity) >= 0) {
      this.cartService.addToCart(product[0], quantity);
      let mProduct = product[0];
      let mliquids = [];
      if(product.length == 3){
        if(product[1] != product[2]){
          product[1].kit_id = product[0].id;
          product[2].kit_id = product[0].id;
          this.cartService.addToCart(product[1], quantity);
          this.cartService.addToCart(product[2], quantity);
        }else{
          product[1].kit_id = product[0].id;
          this.cartService.addToCart(product[1], quantity*2);
        }
        mliquids  = [product[1], product[2]];
      }
      this.shoppingModal = this.modal.create('ShoppingModal', {'product': mProduct, "quantity": quantity, "liquids": mliquids, 'nav':this.navCtrl});
      this.shoppingModal.present();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Lo sentimos!',
        subTitle: 'No hay inventario disponible',
        buttons: ['OK']
      });
      alert.present();
    }

  }

  onChangeVariant(idPre: string) {
    let counter;
    let hypotheticalVariant;
    let ids = [];
    let idN = [];
    if (this.batteryCapacity) {
      if (idPre == 'batteryCapacity') {
        idN = [this.batteryCapacity];
      } else {
        ids.push(this.batteryCapacity);
      }
    }
    if (this.mlCapacity) {
      if (idPre == 'mlCapacity') {
        idN = [this.mlCapacity];
      } else {
        ids.push(this.mlCapacity);
      }
    }
    if (this.case) {
      if (idPre == 'case') {
        idN = [this.case];
      } else {
        ids.push(this.case);
      }
    }
    if (this.color) {
      if (idPre == 'color') {
        idN = [this.color];
      } else {
        ids.push(this.color);
      }
    }
    if (this.levelNicotine) {
      if (idPre == 'levelNicotine') {
        idN = [this.levelNicotine];
      } else {
        ids.push(this.levelNicotine);
      }
    }
    if (this.oHm) {
      if (idPre == 'oHm') {
        idN = [this.oHm];
      } else {
        ids.push(this.oHm);
      }
    }
    if (this.electricResistance) {
      if (idPre == 'electricResistance') {
        idN = [this.electricResistance];
      } else {
        ids.push(this.electricResistance);
      }
    }
    if (this.flavor) {
      if (idPre == 'flavor') {
        idN = [this.flavor];
      } else {
        ids.push(this.flavor);
      }
    }

    if (this.reference) {
      if (idPre == 'reference') {
        idN = [this.reference];
      } else {
        ids.push(this.reference);
      }
    }

    if (this.GA) {
      if (idPre == 'GA') {
        idN = [this.GA];
      } else {
        ids.push(this.GA);
      }
    }

    idN = idN.concat(ids);

    for (let variant of this.product.variants) {
      counter = 0;
      for (let pId of variant.attribute_value_ids) {
        for (let id of idN) {
          if (pId == id) {
            counter++;
          }
          if (idN[0] == pId) {
            hypotheticalVariant = variant;
          }
        }
      }
      if (counter == idN.length) {

        let pCurPro: any
        pCurPro = this.productService.getDiscountsByProduct(variant);
        this.currentProduct = pCurPro;
        this.changeSelects(this.currentProduct);
        if(!this.currentProduct.discount){
          if(this.product.discount){
            this.currentProduct.discount = this.product.discount;
            this.currentProduct.price_discount = this.product.price_discount;
          }
        }

        if (this.currentProduct.photos && this.currentProduct.photos[0]) {
          this.mainImage = this.currentProduct.photos[0].image;
        } else {
          this.mainImage = "assets/img/no-imagen.jpg";
        }
        return;
      }
    }

    if (hypotheticalVariant) {
      let pCurPro: any
      pCurPro = this.productService.getDiscountsByProduct(hypotheticalVariant);
      this.currentProduct = pCurPro;
      this.changeSelects(this.currentProduct);
      if(!this.currentProduct.discount){
        if(this.product.discount){
          this.currentProduct.discount = this.product.discount;
          this.currentProduct.price_discount = this.product.price_discount;
        }
      }
      if (this.currentProduct.photos && this.currentProduct.photos[0]) {
        this.mainImage = this.currentProduct.photos[0].image;
      } else {
        this.mainImage = "assets/img/no-imagen.jpg";
      }
    }
  }

  changeSelects(variant: any){
    let attributes = variant.attribute_value_ids

    if(attributes){
      for (let variable1 of this.att.batteryCapacity) {
          for (let variable2 of attributes) {
              if(variable1[0] == variable2){
                this.batteryCapacity = variable2;
                break;
              }
          }
      }

      for (let variable1 of this.att.case) {
          for (let variable2 of attributes) {
              if(variable1[0] == variable2){
                this.case = variable2;
                break;
              }
          }
      }

      for (let variable1 of this.att.color) {
          for (let variable2 of attributes) {
              if(variable1[0] == variable2){
                this.color = variable2;
                break;
              }
          }
      }

      for (let variable1 of this.att.electricResistance) {
          for (let variable2 of attributes) {
              if(variable1[0] == variable2){
                this.electricResistance = variable2;
                break;
              }
          }
      }

      for (let variable1 of this.att.flavor) {
          for (let variable2 of attributes) {
              if(variable1[0] == variable2){
                this.flavor = variable2;
                break;
              }
          }
      }

      for (let variable1 of this.att.levelNicotine) {
          for (let variable2 of attributes) {
              if(variable1[0] == variable2){
                this.levelNicotine = variable2;
                break;
              }
          }
      }

      for (let variable1 of this.att.mlCapacity) {
          for (let variable2 of attributes) {
              if(variable1[0] == variable2){
                this.mlCapacity = variable2;
                break;
              }
          }
      }

      for (let variable1 of this.att.reference) {
          for (let variable2 of attributes) {
              if(variable1[0] == variable2){
                this.reference = variable2;
                break;
              }
          }
      }

      for (let variable1 of this.att.GA) {
        for (let variable2 of attributes) {
            if(variable1[0] == variable2){
              this.GA = variable2;
              break;
            }
        }
      }

      for (let variable1 of this.att.oHm) {
        for (let variable2 of attributes) {
            if(variable1[0] == variable2){
              this.oHm = variable2;
              break;
            }
        }
      }
    }
  }

  ckeckLiquidKit() {
    let alert = this.alertCtrl.create({
      title: 'Por favor seleccione los líquidos del kit!',
      subTitle: 'Estos no tienen costo extra',
      buttons: ['OK']
    });
    alert.present();
  }

  getStoredWarehouse(){

  }
}
