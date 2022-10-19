import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ParametresService } from 'src/app/services/parametres.service';
import { ResponsableService } from 'src/app/services/responsable.service';
import { UserService } from 'src/app/services/user.service';
import { VendeurMyConsoService } from 'src/app/services/vendeur-my-conso.service';
import { VilleQuartierService } from 'src/app/services/ville-quartier.service';
import { ToastService } from 'src/app/toasts/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-responsable-settings',
  templateUrl: './responsable-settings.page.html',
  styleUrls: ['./responsable-settings.page.scss'],
})
export class ResponsableSettingsPage implements OnInit {
  vendeurs: any;
  quartiers: any;
  days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  selectedVendeur1 = null;
  selectedVendeur2: any[] = [];
  selectedVendeur3: any[] = [];
  selectedDay: any[] = [];
  selectedQuartier = null;
  inserted: any[] = [];
  role: any;
  categories: any[] = [];
  categories2: any[] = [];
  products: any[] = [];
  products2: any[] = [];
  selectedProduct: any[] = [];
  selectedProduct2: any[] = [];
  special: any = null;
  action: string = '';
  selectedCategory: any[] = [];
  selectedCategory2: any[] = [];
  responsables: any;
  selectedResponsable: any = null;
  selectedPoint: any;
  forWho: string = '';
  selectedPointsGoal: number = 0;
  selectedOrdersGoal: number = 0;
  spinner1: boolean = false;
  spinner2: boolean = false;
  spinner3: boolean = false;
  spinner4: boolean = false;
  spinner5: boolean = false;
  prixspecial: any = 0;
  selectedPercent: any;
  selectedAppCost: any;
  url: string = environment.url;
  selectedTimer: any;
  customAlertOptions1 = {
    // header: 'Pizza Toppings',
    // subHeader: 'Select your favorite topping',
    message: '',
    translucent: true,
  };
  customAlertOptions2 = {
    // header: 'Pizza Toppings',
    // subHeader: 'Select your favorite topping',
    message: '',
    translucent: true,
  };
  delivery_price: any;
  delivery_percent: any;
  delivery_max: any;
  forWhat: any;
  constructor(private navCtrl: NavController, private userService: UserService, private toast: ToastService, private paramService: ParametresService, private storage: Storage, private toastCtrl: ToastController, private vendeurService: VendeurMyConsoService, private villesService: VilleQuartierService, private responsableService: ResponsableService) {
    this.storage.get('role').then((role) => {

      if (role) {
        this.role = role
        if (this.role == 'D') {
          this.getCategories()
          this.getAllResponsables()
          this.getAllVendeurs()
        }
      }
    })
  }
  goBack() {
    this.navCtrl.back();
  }

  getAllResponsables() {
    this.userService.getUsersByRole("R").subscribe((responsables) => {
      this.responsables = responsables
    })
  }
  getAllVendeurs() {
    this.userService.getUsersByRole("V").subscribe((vendeurs) => {
      this.vendeurs = vendeurs
    })
  }
  ngOnInit() {
    this.getVendeurByResponsable()
  }
  getCategories() {
    this.paramService.getAllCategories().subscribe((res: any) => {
      this.categories = res
    })
  }



  setGoal(data) {
    return new Promise((resolve, reject) => {
      this.paramService.setGoal(data).subscribe((res) => {
        resolve(true)
      }, (err) => {
        resolve(false)
      })
    })
  }
  categoryChanged() {
    this.getProductsByCategorie(this.selectedCategory)
  }

  categoryChanged2() {
    this.getProductsByCategorie2(this.selectedCategory2)
  }
  getProductsByCategorie(id) {
    this.products = null
    this.customAlertOptions1.message = 'المرجو الإنتظار...'

    this.paramService.getProductByCategory(id, 'ALL').subscribe((res: any) => {
      this.products = res;
      if (this.products.length === 0) {

        this.customAlertOptions1.message = 'لا يوجد منتج'
      } else {

        this.customAlertOptions1.message = ''
      }
    }, (err) => {
      this.customAlertOptions1.message = 'حدث خطأ, المرجو إعادة المحاولة'

    })
  }
  getProductsByCategorie2(id) {
    this.products2 = null

    this.customAlertOptions2.message = 'المرجو الإنتظار...'

    this.paramService.getProductByCategory(id, 'ALL').subscribe((res: any) => {
      this.products2 = res
      if (this.products2.length === 0) {
        this.customAlertOptions2.message = 'لا يوجد منتج'
      } else {
        this.customAlertOptions2.message = ''
      }
    }, err => this.customAlertOptions2.message = 'حدث خطأ, المرجو إعادة المحاولة')
  }
  updateOtherSettings() {

    if (this.selectedPercent != null) {

      this.userService.setPercent({ value: this.selectedPercent }).subscribe((res) => { })
    }
    if (this.selectedAppCost != null) {

      this.userService.setAppCost({ value: this.selectedAppCost }).subscribe((res) => { })
    }
    if (this.selectedTimer) {

      this.userService.setTimer({ value: this.selectedTimer }).subscribe((res) => { })
    }
    console.log("delivery price :", this.delivery_price);

    if (this.delivery_price != null) {

      this.userService.setDelivery({ value: this.delivery_price, type: this.forWhat }).subscribe((res) => { })
    }
    if (this.delivery_max || this.delivery_percent) {
      let data = { delivery_percent: this.delivery_percent, delivery_max: this.delivery_max }
      console.log(data);

      this.userService.setDeliveryParams({ delivery_percent: this.delivery_percent, delivery_max: this.delivery_max }).subscribe((res) => { })
    }

    this.presentSuccessToast('تمت العملية بنجاح');
    this.delivery_price = null
    this.delivery_max = null
    this.delivery_percent = null
    this.forWhat = null
    this.selectedPercent = null
    this.selectedAppCost = null
    this.selectedTimer = null

  }
  async setVendeurDayZone() {
    this.spinner1 = true
    if (this.selectedDay.length == 0 || this.selectedVendeur1.length == 0 || !this.selectedQuartier) {
      this.toast.presentErrorToast('', 3000)
      this.spinner1 = false

    } else {
      for (let index = 0; index < this.selectedDay.length; index++) {
        const element = this.selectedDay[index];
        let data = {
          mode: '',
          idvendeur: this.selectedVendeur1.id,
          idquartier: this.selectedQuartier,
          day: element
        }
        let number = await this.getVendeurDayZone(data)
        if (number == 0) {
          let done = await this.callSetVendeurDayZone(data)
          if (!done) {
            this.spinner1 = false
            this.presentErrorToast('حدث خطأ ما ، يرجى المحاولة مرة أخرى لاحقًا');
            break
            return
          }
        } else {
          data.mode = 'U'
          let done = await this.callSetVendeurDayZone(data)
          if (!done) {
            this.spinner1 = false
            this.presentErrorToast('حدث خطأ ما ، يرجى المحاولة مرة أخرى لاحقًا');
            break
            return
          }
        }
      }
      this.spinner1 = false
      this.presentSuccessToast('تمت العملية بنجاح');
      this.selectedQuartier = null
      this.selectedDay = null
    }


  }
  async setMonthGoal() {
    this.spinner2 = true

    if (this.selectedVendeur2.length == 0 || (this.selectedOrdersGoal == 0 && this.selectedPointsGoal == 0)) {
      this.toast.presentErrorToast('', 3000)
      this.spinner2 = false

    } else {
      for (let index = 0; index < this.selectedVendeur2.length; index++) {
        const element = this.selectedVendeur2[index];
        let data = {
          goal: {
            points: this.selectedPointsGoal,
            orders: this.selectedOrdersGoal
          },
          user: element
        }
        let done = await this.setGoal(data)

        if (!done) {
          this.spinner2 = false

          this.presentErrorToast('حدث خطأ ما ، يرجى المحاولة مرة أخرى لاحقًا');
          break
          return
        }
      }
      this.spinner2 = false

      this.toast.presentSuccessToast('', 3000)

    }
  }
  async changeResponsableVendeur() {
    this.spinner3 = true

    if (!this.selectedResponsable || this.selectedVendeur3.length == 0 || !this.action) {
      this.toast.presentErrorToast('', 3000)
      this.spinner3 = false

    } else {
      for (let index = 0; index < this.selectedVendeur3.length; index++) {
        const element = this.selectedVendeur3[index];
        let data = {
          responsable: this.selectedResponsable,
          vendeur: element,
          action: this.action
        }

        let done = await this.setResponsableVendeur(data)
        if (!done) {
          this.spinner3 = false
          this.presentErrorToast('حدث خطأ ما ، يرجى المحاولة مرة أخرى لاحقًا');
          break
          return
        }
      }
      this.toast.presentSuccessToast('', 3000)
      this.spinner3 = false
    }
  }
  async updateSpecial() {
    this.spinner4 = true

    if (this.selectedProduct.length == 0 || this.special == null) {
      this.toast.presentErrorToast('', 3000)
      this.spinner4 = false

    } else {
      for (let index = 0; index < this.selectedProduct.length; index++) {
        const element = this.selectedProduct[index];
        let data = {
          id: element,
          special: this.special,
          prixspecial: this.prixspecial
        }
        let done = await this.updateSpecialAsync(data)
        if (!done) {
          this.spinner4 = false

          this.presentErrorToast('حدث خطأ ما ، يرجى المحاولة مرة أخرى لاحقًا');
          break
          return
        }
      }
      this.spinner4 = false

      this.selectedProduct = undefined
      this.special = undefined
      this.toast.presentSuccessToast('', 2000)
    }
  }
  async updatePoint() {
    this.spinner5 = true
    if (this.selectedProduct2.length == 0 || this.forWho.length == 0 || this.selectedPoint == 0) {
      this.toast.presentErrorToast('', 3000)
      this.spinner5 = false
    } else {
      for (let index = 0; index < this.selectedProduct2.length; index++) {
        const element = this.selectedProduct2[index];
        let data = {
          id: element,
          forWho: this.forWho,
          point: this.selectedPoint
        }
        let done = await this.updatePointAsync(data)
        if (!done) {
          this.spinner5 = false
          this.presentErrorToast('حدث خطأ ما ، يرجى المحاولة مرة أخرى لاحقًا');
          break
          return
        }
      }
      this.spinner5 = false
      this.selectedProduct2 = undefined
      this.forWho = undefined
      this.toast.presentSuccessToast('', 2000)
    }
  }

  setResponsableVendeur(data) {
    return new Promise((resolve, reject) => {
      this.responsableService.changeResponsableVendeur(data)
        .subscribe((res) => {
          resolve(true)
        }, (err) => {
          resolve(false)
        })
    })
  }
  updateSpecialAsync(data) {
    return new Promise((resolve, reject) => {
      this.paramService.updateSpecial(data).subscribe((res) => {
        resolve(true)
      }, (err) => {
        resolve(false)
      })
    })
  }
  updatePointAsync(data) {
    return new Promise((resolve, reject) => {
      this.paramService.updatePoint(data).subscribe((res) => {
        resolve(true)
      }, (err) => {
        resolve(false)
      })
    })
  }

  getVendeurByResponsable() {
    this.responsableService.getVendeurByResponsable().subscribe((vendeurs) => {
      this.vendeurs = vendeurs
    })
  }
  vendeurChanged(ville) {
    this.getQuartierByVille(ville)
  }

  getQuartierByVille(ville) {
    if (ville) {
      let data = {
        ville
      }
      this.villesService.getQuartierByVille(data).subscribe((quartiers) => {
        this.quartiers = quartiers
      })
    }
  }
  getVendeurDayZone(data) {
    return new Promise((resolve, reject) => {
      let number = 0
      this.vendeurService.getVendeurDayZone(data).subscribe(async (n: any) => {
        number = n
        resolve(number)
      }, (err) => {
        resolve(number)
      })
    })
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  callSetVendeurDayZone(data) {
    return new Promise((resolve, reject) => {
      this.vendeurService.setVendeurDayZone(data).subscribe((res) => {
        resolve(true)
      }, (err) => {
        resolve(false)
      })
    })
  }
  preventCaracters(event) {

    let regex = /[0-9]/g;
    var k;
    k = event.key;  //         k = event.keyCode;  (Both can be used)
    let isNumeric = regex.test(k);

    let isPoint = event.key == '.'
    return isNumeric || isPoint
  }
  async presentSuccessToast(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'middle',
      cssClass: "successtoastclass"
    });
    toast.present();
  }
  async presentErrorToast(message) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'middle',
      cssClass: "failedtoastclass"
    });
    toast.present();
  }
}
