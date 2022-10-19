import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, IonSlides, NavController } from '@ionic/angular';
import { ParametresService } from 'src/app/services/parametres.service';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { MyOrdersService } from 'src/app/services/my-orders.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  timer:number=0;
  // -- clock
  seconds: number;
  minutes: number;
  hours: number;
  stillOffred: boolean = true;

  countdowm = setInterval(() => {
    let timeLimit = new Date().setHours(this.timer, 0, 0);
    let now = new Date().getTime();
    let distance = timeLimit - now;

    this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    this.stillOffred = true;

    if (distance < 0) {
      clearInterval(this.countdowm);
      this.stillOffred = false;
    }
  }, 1000);
  isShow: boolean = false;
  numClickMenu: number = 0;
  showCat: boolean = false;
  user = "";

  catData = ["المياه والمشروبات", "السوق", "محل بقالة"]
  data = [
    { category: "الخضر", ref: environment.url+"/upload/images/cat1.png" },
    { category: "الفواكه", ref: environment.url+"/upload/images/cat2.png" },
    { category: "الدقيق", ref: environment.url+"/upload/images/cat3.png" },
    //  { category: "اللحوم", ref: environment.url+"/upload/images/cat4.png" },
    { category: "الشاي", ref: environment.url+"/upload/images/cat5.png" },
  ]

  imgsSlider = [
    environment.url+"/images/categories/cat001.jpg",
    environment.url+"/images/categories/cat002.jpg",
    environment.url+"/images/categories/cat003.jpg",
    environment.url+"/images/categories/cat004.jpg",
    environment.url+"/images/categories/cat005.jpg",
    environment.url+"/images/categories/cat006.jpg",
    environment.url+"/images/categories/cat007.jpg",
    environment.url+"/images/categories/cat008.jpg",
    environment.url+"/images/categories/cat009.jpg",
  ].reverse();

  slideOpts = {
    initialSlide: this.imgsSlider.length - 1,
    speed: 400,
    autoplay: true
  };

  imgsSlider2 = [
    "../../../assets/images/product/prod5.jpg",
    "../../../assets/images/product/prod6.jpg",
    "../../../assets/images/product/prod7.jpg",
  ].reverse();

  slideOpts2 = {
    // grabCursor: true,
    // initialSlide: this.imgsSlider2.length - 1,
    // speed: 400,
    // autoplay: false
    slidesPerView: 1,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
    // autoplay:true,
  };

  @ViewChild('mySlider2') slides: IonSlides;
  commandeNum: any;
  next() {
    this.slides.slideNext();
  }
  prev() {
    this.slides.slidePrev();
  }

  passingOrder: boolean = false;
  idconsumer: any;
  url: string = environment.url
  constructor(private http: HttpClient,
    private paramServices: ParametresService,
    private orderService: MyOrdersService, private navCtrl: NavController, private storage: Storage, private router: ActivatedRoute, private menu: MenuController, private route: Router, private paramService: ParametresService) {
    this.orderService.calculate_quantity()
    this.commandeNum = this.orderService.cart_quantity.value
    this.orderService.cart_quantity.subscribe((qte) => {
      this.commandeNum = qte
    })
    this.getCategory();
    this.specialOrders();
    this.getTimer();
  }
  getTimer(){
    this.http.get(this.url+'/user/getTimer').subscribe((res:any)=>{
      this.timer =res
      this.countdowm = setInterval(() => {
        let timeLimit = new Date().setHours(this.timer, 0, 0);
        let now = new Date().getTime();
        let distance = timeLimit - now;
        this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (distance < 0) {
          clearInterval(this.countdowm);
          this.stillOffred = false;
        }
      }, 1000);
    })
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.menu.enable(true, 'consommateur-menu')
    this.orderService.calculate_quantity()
    this.commandeNum = this.orderService.cart_quantity.value
    this.orderService.cart_quantity.subscribe((qte) => {
      this.commandeNum = qte
    })
  }
  ionViewWillLeave() {
    this.menu.enable(false, 'consommateur-menu')
    this.orderService.calculate_quantity()
    this.commandeNum = this.orderService.cart_quantity.value
    this.orderService.cart_quantity.subscribe((qte) => {
      this.commandeNum = qte
    })
  }

  showMenu() {
    this.numClickMenu++;
    this.isShow = this.numClickMenu % 2 == 0 ? false : true;
  }

  showCategory() {
    this.numClickMenu++;
    this.showCat = this.numClickMenu % 2 == 0 ? false : true;
  }

  async logOut() {
    // this.route.navigate(['login']);
    // localStorage.clear();
    await this.storage.clear()
    this.route.navigate(['/login'])
  }

  categories: any = []
  getCategory() {
    this.paramService.getCategories().subscribe((res) => {
      this.categories = res;
    })
  }

  goBack() {
    this.navCtrl.back();
  }

  specialorders: any = []
  specialOrders() {
    this.getProductByCategory('special', true)
  }
  getProductByCategory(id, special) {
    this.paramServices.getProductByCategory(id, special).subscribe((result:any) => {
      this.specialorders = result;
      
      if (result.length == 0){
        this.stillOffred = false
      }else{
        this.stillOffred = true
      }
    })
  }



}
