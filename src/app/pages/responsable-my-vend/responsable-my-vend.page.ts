import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallNumberService } from 'src/app/services/call-number.service';
import { ResponsableService } from 'src/app/services/responsable.service';

@Component({
  selector: 'app-responsable-my-vend',
  templateUrl: './responsable-my-vend.page.html',
  styleUrls: ['./responsable-my-vend.page.scss'],
})
export class ResponsableMyVendPage implements OnInit {

  data1 = {
    id: "s1 v2 r2o h,r c10",
    nom: "عبد القادر مفتاح",
    adresse: "حي رحمة زنقة ثوت رقم  121 ",
    numPhone: "0633549988",
    numWhatsapp: "0633449988",
    numTelegram: "0766332196",
    email: "---"
  }

  data2 = []
  jour: string;
  d: any={};

  constructor(private router:Router,private callNumber:CallNumberService, private responsableService:ResponsableService) { 
    this.jour= new Date().toLocaleDateString('ar-EG-u-nu-latn',{weekday: 'long'});
    this.responsableService.getVendeurByReponsableByDay().then((res:any)=>{
      res.subscribe((r)=>{
        this.data2 = r
      })
  
    }, err=>{ 
      console.log(err);
      
    })

  }

  ngOnInit() {
  }
  call(number){
    this.callNumber.call(number)
  }
  vendeurChanged(){
  }
  addproduct(){
    this.router.navigate(['/vendeur-addproduct'])
  }
}
