import { Component, ViewChild } from '@angular/core';
import { Slides, AlertController, Content, NavController, IonicPage, Modal,
  ModalController, Platform, NavParams, Events } from 'ionic-angular';
import { CartService } from '../../providers/cart-service';
import { ContentService } from '../../providers/content-service';
import { ConfigService } from '../../providers/config-service';
import { ProductService } from '../../providers/product-service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UserService } from '../../providers/user-service';
import { MyApp } from '../../app/app.component';
//import { SendModal } from '../send-modal/send-modal';
//import { WarrantyModal } from '../warranty-modal/warranty-modal';
//import { GuideModal } from '../guide-modal/guide-modal';
@IonicPage({
  segment: 'tienda',
  priority: 'high'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;
  //--------------------------------------
  //CONSTANTS
  //--------------------------------------

  // TODO Defines the number of products to be loaded
  NUMBER_LOAD_PRODUCTS: any = 8;

  odoo_allId: any = 1;
  odoo_kitId: any = 3;
  odoo_Liquids: any = 4;

  //--------------------------------------
  //ATTRIBUTES
  //--------------------------------------

  slidesList: Array<{ image: string }>;
  loadingSlides = true;
  slidesList2: Array<{ image: string }>;
  loadingSlides2 = true;
  loadingCategories = true;
  products: Array<{ id: number, title: string, images: Array<string>, price: number, description: string, categ_id: Array<any>, variants: Array<any>, price_discount: number, discount: string}>;
  subcategories: Array<{ odoo_id: number, name: string, image: string, state: boolean, parent_id: number, subcategories: Array<any> }>;
  categories: Array<{ odoo_id: number, name: string, image: string, state: boolean, subcategories: Array<any>, subcategoriesstyle: string }>;
  subSubcategories: Array<{ odoo_id: number, id: number, name: string, image: string, state: boolean, parent_id: number, subcategories: Array<any> }>;
  loadingProducts = false;
  loadingProducts2 = false;
  sendModal: Modal;
  wModal: Modal;
  guideModal: Modal;
  selectedCategory: { odoo_id: number, name: string, image: string, state: boolean, subcategories: Array<any>, subcategoriesstyle: string };
  slectedSubCategory: {id:number, odoo_id: number, name: string, image: string, state: boolean, subcategories: Array<any>, subcategoriesstyle: string };
  slectedSubSubCategory: { odoo_id: number, name: string, image: string, state: boolean, subcategories: Array<any>, subcategoriesstyle: string };
  scrollCount: any;
  flag_add: boolean;
  kits_subCategoriesId: Array<{ nCigarrets: number, nExperts: number }>;
  loadingHighlightProducts = true;
  highlightProducts: any;

  stringProducts: string;
  stringCategories: string;
  stringSubCategories: string;
  stringSubSubCategories: string;

  infiniteScroll: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cartService: CartService,
    public contentService: ContentService, public configService: ConfigService,
    public productService: ProductService, public alertCtrl: AlertController,
    private modal: ModalController, private inAppBrowser: InAppBrowser, public platform: Platform,
    public userService: UserService, public appComponent: MyApp,
    public events:Events) {

      this.stringProducts = '';
      this.stringCategories = '';
      this.stringSubCategories = '';
      this.stringSubSubCategories = '';
      this.scrollCount = 0;
      this.slidesList = [];
      this.slidesList2 = [];
      this.products = [];
      this.subcategories = [];
      this.categories = [];
      this.flag_add = false;
      this.kits_subCategoriesId = [];
      this.highlightProducts = [];

  }

  ionViewWillEnter(){
    this.events.publish('enableHeader');
  }

  ionViewDidLoad() {    
    this.contentService.analyticsPage('#/tienda');
    console.log('this.categories.length == 0 && this.subcategories.length == 0', this.categories.length == 0 && this.subcategories.length == 0);
    
    if(this.categories.length == 0 && this.subcategories.length == 0){
      this.loadCategories();
    }
    this.loadHome();


    if(this.navParams.get('TIENDA')){
      setTimeout(() => {
        this.goToShop();
      }, 500);
    }else{
      this.appComponent.clearActive('');
    }
  }



  loadHome() {
    
    this.loadingSlides = true;
      
      this.contentService.getHome().then((dataSlides) => {
        this.loadingSlides = false;
        if (!dataSlides[0]) {
          this.configService.showToast("Error al obtener elementos", "toast-failed");
        }
        this.slidesList = dataSlides;
      }, (err) => {
        this.loadingSlides = false;
        this.configService.showToast(err, "toast-failed");
      });

      this.contentService.getHomeSlideFooter().then((dataSlides2) => {
        this.loadingSlides2 = false;
        if (!dataSlides2[0]) {
          this.configService.showToast("Error al obtener elementos", "toast-failed");
        }
        this.slidesList2 = dataSlides2;
  
      }, (err) => {
        this.loadingSlides2 = false;
        this.configService.showToast(err, "toast-failed");
      });

    this.contentService.getHomeHighLightProducts(this.productService.warehause).then((data) => {
      this.productService.getDiscounts().then((ex) => {
        this.highlightProducts = []
        for (let variable of data) {
          let pr = this.productService.getDiscountsByProduct(variable);
          this.highlightProducts.push(pr);
        }
        this.loadingHighlightProducts = false;
        console.log('highlightProducts', data, this.highlightProducts);
        
      }, (err) => {
        this.loadingHighlightProducts = false;
        this.configService.showToast(err, "toast-failed");
      });
    }, (err) => {
      this.loadingHighlightProducts = false;
      this.configService.showToast(err, "toast-failed");
    });
  }


  loadCategories(){
    this.loadingCategories = true;
    let kidCategorias: Array<any> = [];

    this.productService.getCategories().then((pData) => {
      this.loadingCategories = false;
      if (this.categories.length == 0) {
        for (let variable of pData) {
          if (variable.parent_id) {
            if (variable.parent_id[0] != 1) {
              if (this.subcategories.indexOf(variable) == -1) {
                  this.subcategories.push(variable);                 
              }
            } else {
              if(variable.odoo_id != this.odoo_allId){
                if(variable.odoo_id == this.odoo_kitId){
                  if(kidCategorias.length != 0){
                    var ax = [variable];
                    kidCategorias = ax.concat(kidCategorias);
                  }else{
                    kidCategorias.push(variable);
                  }
                }else{
                  if (variable.odoo_id == this.odoo_Liquids) {
                    kidCategorias.push(variable);
                  } else {
                    this.categories.push(variable);
                  }
                }
              }
            }
          } else {
            if(variable.odoo_id != this.odoo_allId){
                this.categories.push(variable);
            }
          }
        }

        var aux = kidCategorias.concat(this.categories);
        this.categories = aux;

        for (let variable1 of this.subcategories) {
         for (let variable2 of this.categories) {
           if (variable1.parent_id[0] == variable2.odoo_id) {
             if (variable2.subcategories) {
              if (variable2.subcategories.indexOf(variable1) == -1) {
                  variable2.subcategories.push(variable1);                 
              }
             } else {
               variable2.subcategories = [variable1];
             }
           }
         }
       }
       for (let variable1 of this.subcategories) {
         for (let variable2 of this.subcategories) {
           if (variable1.parent_id[0] == variable2.odoo_id) {
             if (variable2.subcategories) {
               if (variable2.subcategories.indexOf(variable1) == -1) {
                  variable2.subcategories.push(variable1);                 
               }
             } else {
               variable2.subcategories = [variable1];
             }
           }
         }
       }
     }


      for (let variable of this.categories) {
        if (variable.subcategories) {
          if (variable.subcategories.length > 0 && this.flag_add == false) {
            for (let variable2 of variable.subcategories) {
              let vAdd: {
                nCigarrets: number,
                nExperts: number
              };
              if(variable2.subcategories){
                vAdd = { nCigarrets: variable2.odoo_id, nExperts: variable2.subcategories[0].odoo_id }
                this.kits_subCategoriesId.push(vAdd);
              }
            }
            // let add = {
            //   id: -1,
            //   name: "TODOS LOS EQUIPOS",
            //   image: "",
            //   state: false
            // };
            // let add2 = {
            //   id: -2,
            //   name: "EQUIPOS PARA EXPERTOS",
            //   image: "",
            //   state: false
            // };
            // this.flag_add = true;
            // if(variable.subcategories.length < 3){
            //   variable.subcategories.push(add2);
            //   variable.subcategories.push(add);
            //   break;
            // }
          }
        }
      }

      this.clearCategoriesSelect(this.categories);
      this.clearCategoriesSelect(this.subcategories);
    });
  }



  loadProducts(infiniteScroll: any, isScroll: boolean) {
    if(!this.infiniteScroll){
        this.infiniteScroll = infiniteScroll;
    }
    let offset = this.NUMBER_LOAD_PRODUCTS * this.scrollCount;
    let infCategories = [];
    if (this.slectedSubSubCategory) {
      infCategories.push(this.slectedSubSubCategory.odoo_id);
    } else {
      if (this.slectedSubCategory) {
        if (this.slectedSubCategory.odoo_id) {
          infCategories.push(this.slectedSubCategory.odoo_id);
          if (this.slectedSubCategory.subcategories) {
            for (let variable of this.slectedSubCategory.subcategories) {
              infCategories.push(variable.odoo_id);
            }
          }
        } else {
          if (this.slectedSubCategory.id) {
            if (this.slectedSubCategory.id == -1) {
                for (let idSub of this.kits_subCategoriesId) {
                    infCategories.push(idSub.nExperts);
                    infCategories.push(idSub.nCigarrets);
                }
            } else {
              if (this.slectedSubCategory.id == -2) {
                for (let idSub of this.kits_subCategoriesId) {
                    infCategories.push(idSub.nExperts);
                }
              }
            }
          }
        }
      } else {
        if (this.selectedCategory) {
          infCategories.push(this.selectedCategory.odoo_id);
          if (this.selectedCategory.subcategories) {
            for (let variable1 of this.selectedCategory.subcategories) {
              if (variable1.odoo_id) {
                infCategories.push(variable1.odoo_id);
              }
              if (variable1.subcategories) {
                for (let variable2 of variable1.subcategories) {
                  infCategories.push(variable2.odoo_id);
                }
              }
            }
          }
        }
      }
    }


    this.loadingProducts = true;
    if(this.products.length == 0){
      this.loadingProducts2 = true;
    }
    this.productService.getProducts(infCategories, this.NUMBER_LOAD_PRODUCTS, offset, isScroll).then((data) => {
      this.productService.getDiscounts().then((ex) => {
        if(!isScroll){
          this.products = [];
        }
        this.loadingProducts = false;
        this.loadingProducts2 = false;
        //if (data.length < this.NUMBER_LOAD_PRODUCTS) {
        if (data.length == 0) {
          if (infiniteScroll) {
            infiniteScroll.enable(false);
          }
            for (let variable of data) {
              let pr = this.productService.getDiscountsByProduct(variable);
              this.products.push(pr);
            }
            if (infiniteScroll) {
              infiniteScroll.complete();
            }
        } else {
            for (let variable of data) {
              let pr = this.productService.getDiscountsByProduct(variable);
              this.products.push(pr);
            }
            if (infiniteScroll) {
              infiniteScroll.complete();
            }
        }
      }, (err) => {
        this.loadingProducts = false;
        this.loadingProducts2 = false;
        this.configService.showToast(err, "toast-failed");
      });
    }, (err) => {
      this.loadingProducts = false;
      this.loadingProducts2 = false;
      this.configService.showToast(err, "toast-failed");
    });
    this.scrollCount++;
  }


  modalSend() {
    this.sendModal = this.modal.create('SendModal');
    this.sendModal.present();
  }

  modalWarranty() {
    this.wModal = this.modal.create('WarrantyModal');
    this.wModal.present();
  }

  modalGuide() {
    this.guideModal = this.modal.create('GuideModal');
    this.guideModal.present();
  }

  goToShop() {
    try{
      let size = (document.getElementsByName("categorys-main")).length - 1;
      let yOffset = (document.getElementsByName("categorys-main")[size]).offsetTop;
      //console.log("offset", yOffset);
      this.content.scrollTo(0, yOffset, 1000);
    }
    catch(e){

    }
  }


  categoryClicked(category: any) {
    //console.log("category clicked ", category);
    if (!category) return;
    this.clearCategoriesSelect(this.categories);
    category.state = true;
    this.stringCategories = category.name
    this.stringProducts = this.stringCategories;
    this.subcategories = category.subcategories;
    this.scrollCount = 0;
    this.slectedSubCategory = null;
    this.slectedSubSubCategory = null;
    this.selectedCategory = category;
    this.clearCategoriesSelect(this.subSubcategories);
    this.clearCategoriesSelect(this.subcategories);
    this.products = [];
    this.loadingProducts2 = true;
    if(this.infiniteScroll){
      this.infiniteScroll.enable(true);
    }


    //this.loadProducts('', true);

    setTimeout(() => {
      let size;
      let yOffset
      if (this.selectedCategory.subcategories) {
        //console.log("SUB CATEGORIAS");
        size = (document.getElementsByName("How-cigarretes")).length - 1;
        yOffset = (document.getElementsByName("How-cigarretes")[size]).offsetTop;
        //console.log("offset", yOffset);
      } else {
        //console.log("SIN CATEGORIAS");
        size = (document.getElementsByName("product-container")).length - 1;
        yOffset = (document.getElementsByName("product-container")[size]).offsetTop;
        //console.log("offset", yOffset);
      }
      this.content.scrollTo(0, yOffset+20, 2000);
    }, 500);
  }

  subCategoryClicked(subCategory: any) {
    //console.log("subCategory clicked ", subCategory);
    if (!subCategory) return;
    this.clearCategoriesSelect(this.subcategories);
    subCategory.state = true;
    this.stringSubCategories = subCategory.name;
    this.stringProducts = this.stringCategories +" "+ this.stringSubCategories;
    this.subSubcategories = subCategory.subcategories;
    this.scrollCount = 0;
    this.slectedSubCategory = subCategory;
    this.slectedSubSubCategory = null;
    this.clearCategoriesSelect(this.subSubcategories);
    this.products = [];
    let size = (document.getElementsByName("product-container")).length - 1;
    let yOffset = (document.getElementsByName("product-container")[size]).offsetTop;
    //console.log("offset", yOffset);
    //console.log(this.infiniteScroll);
    if(this.infiniteScroll){
      this.infiniteScroll.enable(true);
    }
    this.loadingProducts2 = true;
    //this.loadProducts('', true);
    setTimeout(() => {
      this.content.scrollTo(0, yOffset, 2000);
    }, 700);
  }

  clearCategoriesSelect(element: any) {
    if (element) {
      for (let t of element) {
        t.state = false;
      }
    }

  }


  openProduct(product: any) {
    let name = (product.name+'').trim().toLowerCase().replace(/ /g,'-');
    this.navCtrl.push('Product', { 'id': product.id, 'product': product, 'name':name });
  }


  goToExternalUrl(url){
      this.platform.ready().then(() => {
        this.inAppBrowser.create(url, "_blank");
      });
  }

  getBestPrice(product){
    let ax = product.variants[0].price;
    for (let vr of product.variants) {
        if(vr.price < ax){
          ax = vr.price;
        }
    }
    return ax;
  }

}
