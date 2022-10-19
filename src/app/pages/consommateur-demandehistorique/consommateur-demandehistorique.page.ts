import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ParametresService } from 'src/app/services/parametres.service';

@Component({
  selector: 'app-consommateur-demandehistorique',
  templateUrl: './consommateur-demandehistorique.page.html',
  styleUrls: ['./consommateur-demandehistorique.page.scss'],
})
export class ConsommateurDemandehistoriquePage implements OnInit {
  idConsommateur: any;

  constructor(private paramServices: ParametresService, private navCtrl:NavController, private ActiveRoute:ActivatedRoute) {
    this.ActiveRoute.params.subscribe((params)=>{
      
      if (params.id){
        this.idConsommateur = params.id
      }
    })
    this.getMyOrders();
  }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.ActiveRoute.params.subscribe((params)=>{
      if (params.id){
        this.idConsommateur = params.id
      }
    })
  }
  goBack() {
    this.navCtrl.back();
  }
  data: any = [];
  getMyOrders() {
    this.ActiveRoute.params.subscribe((params)=>{
      
        this.idConsommateur = params.id
        this.paramServices.getHistoryOrdersConso({id: params.id}).subscribe(result => {
          this.data = result;
          this.data.forEach(d => {
            d.datecommande = (d.datecommande).slice(0, 10)
          });
        })
      
    })

  }

}
