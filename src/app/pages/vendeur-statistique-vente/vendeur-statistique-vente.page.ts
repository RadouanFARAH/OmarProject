import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UserService } from 'src/app/services/user.service';
import { VendeurStatisticsService } from 'src/app/services/vendeur-statistics.service';

@Component({
  selector: 'app-vendeur-statistique-vente',
  templateUrl: './vendeur-statistique-vente.page.html',
  styleUrls: ['./vendeur-statistique-vente.page.scss'],
})
export class VendeurStatistiqueVentePage implements OnInit {

  dataDay = []
  selectedSegment = "today";
  orders: any;
  prixtotal: number;
  pointtotal: number;
  dataDays: any[];
  role: any;
  arrmonths:any = []
  arrmonths2 = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
  arrdays: any = [];
  productIDs: any[] = [];
  spinner: boolean;
  points_goal: any;
  orders_goal: any;
  constructor(private userService: UserService, private stats: VendeurStatisticsService, private storage: Storage, private navCtrl: NavController) {
    this.storage.get('role').then((role) => {
      console.log(role);

      if (role) {
        this.role = role
        if (this.role =='V'){
          this.getGoal()
        }
      }
    })
    
  }
  getGoal() {
    this.userService.getGoal().subscribe((goal: any) => {
      this.points_goal = goal.points
      this.orders_goal = goal.orders
    })
  }
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.segmentChanged()
  }
  segmentChanged() {
    let orders = [];
    let products = [];
    let productIDs = [];
    let prixtotal = 0
    let pointtotal = 0
    this.dataDay = []
    this.dataDays = []
    this.orders = 0
    this.prixtotal = 0
    this.pointtotal = 0
    this.spinner = true
    this.stats.getOrdersByDay({ today: this.selectedSegment == "today", yesterday: this.selectedSegment == "yesterday", role: this.role }).subscribe((res: any) => {
      this.arrdays = res["arrayofday"]
      this.arrmonths = res["arrayofmonths"]
      this.spinner = false
      for (let i = 0; i < res.result.length; i++) {
        if (!orders.includes(res.result[i].codecommande)) {
          orders.push(res.result[i].codecommande)
        }
        if (this.selectedSegment == "today") {

          if (!productIDs.includes(res.result[i].idproduct)) {
            productIDs.push(res.result[i].idproduct)
            products.push(res.result[i])
          } else {
            let index = productIDs.indexOf(res.result[i].idproduct)
            products[index].quantite += res.result[i].quantite
          }
        } else if (this.selectedSegment == "yesterday") {

          if (!productIDs.includes(res.result[i].datecommande)) {
            productIDs.push(res.result[i].datecommande)
            res.result[i].point_v = res.result[i].point_v * res.result[i].quantite
            res.result[i].prixfinal = parseFloat((res.result[i].quantite * parseFloat(res.result[i].prixfinal)).toFixed(2))
            products.push(res.result[i])
          } else {
            let index = productIDs.indexOf(res.result[i].datecommande)
            products[index].point_v += res.result[i].point_v * res.result[i].quantite
            products[index].prixfinal += parseFloat((res.result[i].quantite * parseFloat(res.result[i].prixfinal)).toFixed(2))
          }
        } else {
          
          if ( !productIDs.includes( new Date(res.result[i].datecommande).getMonth() )) {

            productIDs.push(new Date(res.result[i].datecommande).getMonth())
            res.result[i].point_v = res.result[i].point_v * res.result[i].quantite
            res.result[i].prixfinal = parseFloat((res.result[i].quantite * parseFloat(res.result[i].prixfinal)).toFixed(2))

            products.push(res.result[i])

          } else {

            let index = productIDs.indexOf(new Date(res.result[i].datecommande).getMonth())
            products[index].point_v += res.result[i].point_v * res.result[i].quantite
            products[index].prixfinal = parseFloat((products[index].prixfinal + (res.result[i].quantite * parseFloat(res.result[i].prixfinal))).toFixed(2))


          }
          
        }
      }
      for (let i = 0; i < products.length; i++) {
        if (this.selectedSegment == "today") {
          prixtotal += products[i].quantite * parseFloat(products[i].prixfinal)
          pointtotal += products[i].quantite * products[i].point_v
        } else {
          prixtotal += products[i].prixfinal
          pointtotal += products[i].point_v
        }
      }
      this.dataDay = products
      this.dataDays = productIDs
      this.productIDs = productIDs
      if (this.selectedSegment == "yesterday") {
        let dataDay = new Array(this.arrdays.length)
        dataDay.fill({ point_v: 0, prixfinal: 0 })
        for (let i = 0; i < productIDs.length; i++) {
          let index = this.arrdays.indexOf(productIDs[i])
          dataDay[index] = products[i]
        }
        this.dataDay = dataDay
      }
      if (this.selectedSegment == "monthsbefore") {
        let dataDay = new Array(this.arrmonths.length)
        dataDay.fill({ point_v: 0, prixfinal: 0 })
        for (let i = 0; i < productIDs.length; i++) {

          let index = this.arrmonths.indexOf(productIDs[i])
          dataDay[index] = products[i]
        }
        
        this.dataDay = dataDay
      }
      this.orders = orders.length
      this.prixtotal = parseFloat(prixtotal.toFixed(2))
      this.pointtotal = parseFloat(pointtotal.toFixed(2))
    })
  }

  goBack() {
    this.navCtrl.back();
  }

}
