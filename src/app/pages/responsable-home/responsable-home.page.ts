import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ResponsableService } from 'src/app/services/responsable.service';
import { UserService } from 'src/app/services/user.service';
import { Storage } from '@ionic/storage-angular';
import { ToastService } from 'src/app/toasts/toast.service';

@Component({
  selector: 'app-responsable-home',
  templateUrl: './responsable-home.page.html',
  styleUrls: ['./responsable-home.page.scss'],
})
export class ResponsableHomePage implements OnInit {


  data = {
    jour: "الخميس",
    zone: "حي رحمة 1",
    responsable: "عمر",
    vendeur: "عبد القادر",
    noteJour: 1200,
    nbrTotalConso: 500,
    consoValide: 450,
    consoAttente: 48,
    consoRefuse: 2,
    demande: []
  }

  data2 = []


  // role1 = "V";
  // role2 = "R";
  // user = this.role1 == "V" ? true : false;

  isShow: boolean = false;
  numClickMenu: number = 0;
  detail: boolean = false;
  role: string;

  constructor(private toast:ToastService,private route:Router,private storage:Storage,private userService:UserService,private menu: MenuController, private responsableService:ResponsableService, private router:Router ) {
    this.data.jour= new Date().toLocaleDateString('ar-EG-u-nu-latn',{weekday: 'long'});
    this.getVendeurByResponsable()
    this.storage.get('role').then((role) => {

      if (role) {
        this.role = role
      }
    })
   }
   doRefresh(event) {
    this.getVendeurByResponsable()
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  ngOnInit() {
  }

  getVendeurByResponsable(){
    this.responsableService.getVendeurByReponsableByDay().then((res:any)=>{
      res.subscribe((r)=>{
        this.data2 = r
      })
    }, err=>{ 
      console.log(err);
      
    })
  }
  ionViewWillEnter() {
    this.menu.enable(true, 'responsable-menu')
  }
  ionViewWillLeave() {
    this.menu.enable(false, 'responsable-menu')
  }

  goTo(vendeur) {
    if (this.role =='R') this.userService.login({vendeur}).subscribe(async (res:any)=>{
      await this.storage.set('token', res.token)
      this.route.navigate(["vendeur-home"])
    }, (err)=>{
      this.toast.presentErrorToast('', 3000)
    })
  }

}
