import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ParametresService } from 'src/app/services/parametres.service';
import { environment } from 'src/environments/environment';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';

@Component({
  selector: 'app-vendeur-demandedetail',
  templateUrl: './vendeur-demandedetail.page.html',
  styleUrls: ['./vendeur-demandedetail.page.scss'],
})
export class VendeurDemandedetailPage implements OnInit {
  apiKey = environment.APIkey;
  @ViewChild("maps") mapRef: ElementRef;
  map: GoogleMap;
  order_details = [];
  url = environment.url
  link = 'https://www.google.com/maps/dir/lat,lng/lat,lng'
  currentlng: number;
  currentlat: number;
  coordinate: { lat: any; lng: any; };
  code: any;
  constructor(private printer: Printer, private goelocal: Geolocation, private navCtrl: NavController, private activeRoute: ActivatedRoute, private paramService: ParametresService) {
    this.activeRoute.params.subscribe((params) => {
      // console.log(params.link, "\n", JSON.parse(params.order_details));
      this.code = params.code;
      this.link = params.link
    })
    console.log("mapRef 0 :", this.mapRef);

    // this.goelocal.getCurrentPosition().then((result)=>{
    //   this.currentlat = result.coords.latitude
    //   this.currentlng = result.coords.longitude
    //   this.link = `https://www.google.com/maps/dir/${this.currentlat},${this.currentlng}/34.0005,-6.52325/`
    //   console.log(this.link);

    // })
  }
  print(code) {
    this.printer.isAvailable().then(() => {
      console.log("printer.isAvailable()");
      let options: PrintOptions = {
        name: `${code} الفاتورة`,
        duplex: true,
        orientation: 'portrait',
        monochrome: true
      }
      let css = `.cssHeight{
        width: 100%;
        // height: calc(100% - 200px) !important;
        // height:400px;
        // position: fixed;
        // top: 55px !important;
        // overflow-y: scroll;
    }
    // row 1
    .cssProduct{
        display: grid;
        grid-template-columns: 40% 60%;
        // height: 130px !important;
        // width: 100%;
        // border-bottom: 1px solid #F0344C;
        // display: flex;
        // align-items: center;
        
        // animation: fadeInTopLeft; 
        // animation-duration: 2s; 
    }
    .cssProduct .cssImg{
        width: 110px;
        height: 110px;
        background: #FFEDE7;
        border-radius: 4px;
        // margin-right: 20px;
        overflow: overlay;
    
    }
    .cssProduct .cssImg img{
        width: 100%;
        height: 130px;
    }
    // .cssInfos {
    //     // margin-right: 20px;
    // }
    .cssInfos p{
        // margin: 5px 0px;
        /* height: 22px; */
        color: #964A4A;
        /* position: relative; */
        /* top: -3px; */
    }
    .cssInfos .cssLibel{
        font-size: 16px;
        margin-left: 10px;
    }
    .cssInfos .cssValue{
        font-size: 15px;
    }
    
    @media only screen and (max-width: 362px) {
        .cssProduct{
            height: 100px !important;
        }
    
        .cssProduct .cssImg{
            width: 90px;
            height: 90px;
            margin-right: 16px;
        }
    
        .cssInfos {
            margin-right: 12px;
        }
        .cssInfos p{
            margin: 0px;
            height: 20px;
        }
        .cssInfos .cssLibel{
            font-size: 13px;
            margin-left: 10px;
        }
        .cssInfos .cssValue{
            font-size: 14px;
        }
    }
    
    .cssCard1, .cssCard2{
        width: 94%;
        margin: 10px auto;
        margin-top: 24px;
        padding: 10px 15px;
        color: #fff;
        border-radius: 10px;
        box-shadow: 0 5px 10px rgba(0,0,0,0.15);
    }
    
    .cssTitleCard{
        display: inline;
        padding: 6px 14px;
        border: 2px solid #FAFAFA;
        border-radius: 18px;
        font-size: 15px;
        position: relative;
        top: -20px; left: 14px;
    }
    .cssCard1{
        background: #F1F2F6; 
        // background: #EADEDE;
        color: #444;}
    .cssCard2{background: #0DAFAF;}
    .cssCard1 .cssTitleCard{background: #EADEDE;color: #444;}
    .cssCard2 .cssTitleCard{background: #0DAFAF;}
    .cssContentCard2{
        margin-bottom: -200px;
    }
    
    .cssContentCard div{margin-top: 4px;}
    .cssContentCard .cssLibel{
        font-size: 15px;
        margin-left: 10px;
        margin-top: 8px;
    }
    .cssContentCard .cssValue{
        font-size: 17px;
    }
    
    .cssContentCard .cssNum{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .cssContentCard .cssNum .cssValue{
        direction: rtl;
        font-size: 19px;
    }
    
    .cssContentCard .cssNum .cssBtn{
        margin-top: 8px !important;
        height: 42px !important; 
        width: 100%;
        font-size: 13px;
        --background: #fff !important;
        color: #ffffff;
        --border-radius: 21px !important;
        border: none;
    }
    .cssContentCard .cssNum .cssBtn img{
        width: 22px; height: 22px;
        margin-right: 8px;
    }
    
    
    // row 2
    .cssCard2Infos{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .cssDate{
        position: absolute;
        left: 20px;
        top: 30px;
        font-size: 14px;
        color: #fafafa;
    }
    .cssCard2Infos .cssLibel{
        text-align: center;
        font-size: 15px !important;
        margin: 2px 0px !important;
    }
    .cssCard2Infos .cssValue{
        font-size: 18px !important;
        font-weight: 600;
        margin: 2px 0px;
        text-align: center;
    }
    
    // row 3
    .cssBtns{
        width: 94%;
        margin: 0px auto;
        margin-top: 8px;
    }
    .cssBtn2{
        height: 50px !important;
        width: 100%;
        font-size: 20px;
        --background: #F1F2F6 !important;
        // --background: #D3D3D3 !important;
        color: #444;
        border-radius: 6px;
        border: none;
        padding: 0px 5px !important;
    }
    .cssBtn3{
        height: 50px !important;
        width: 100%;
        font-size: 20px;
        --background: #c8c8c9 !important;
        // --background: #444 !important;
        color: #444;
        border-radius: 6px;
        border: none;
        padding: 0px 5px !important;
    }
    
    .cssBtn4, .cssBtn5{
        margin-top: 12px;
        height: 42px !important;
        width: 90%;
        font-size: 17px;
        --background: #F0344C !important;
        color: #fff;
        --border-radius: 6px !important;
        border: none;
        padding: 0px 5px !important;
    }
    .cssBtn5{
        --background: #EADEDE !important;
        color: #F0344C;
    }
    
    @media only screen and (max-width: 362px) {
        .cssCard1, .cssCard2{
            margin-top: 20px;
            padding: 6px 10;
            border-radius: 5px;
            padding-bottom: 0px;
        }
        .cssCard11{
            margin: 5px auto;
            margin-top: 5px;
        }
        .cssTitleCard{
            font-size: 12px;
            position: relative;
            top: -16px;
        }
        .cssTitleCard span{
            position: relative;
            top: -6px;
        }
        .cssContentCard{
            position: relative;
            top: -14px;
        }
        .cssContentCard div{margin-top: 4px;}
        .cssContentCard .cssLibel{
            font-size: 12px;
            margin-left: 10px;
            margin-top: 8px;
        }
        .cssContentCard .cssValue{
            font-size: 13px;
        }
        
        .cssContentCard .cssNum{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cssContentCard .cssNum .cssValue{
            direction: rtl;
            font-size: 15px;
        }
        
        .cssContentCard .cssNum .cssBtn{
            height: 38px !important; 
            width: 100%;
            font-size: 11px;
            --border-radius: 19px !important;
            border: none;
        }
        .cssContentCard .cssNum .cssBtn img{
            width: 20px; height: 20px;
            margin-right: 8px;
        }
        // ------------- row 2
        .cssCard2{
            height: 90px;
        }
        .cssCard2Infos{
            margin-top: 8px !important;
        }
        .cssDate{
            position: absolute;
            left: 0px; top: -22px;
            font-size: 13px;
            color: #fafafa;
        }
        .cssCard2Infos .cssLibel{
            font-size: 12px !important;
            text-align: center;
        }
        .cssCard2Infos .cssValue{
            font-size: 15px !important;
        }
    
        // ----- row 3
        .cssBtn2, .cssBtn3{
            margin-top: 0px !important;
            height: 44px !important;
            font-size: 17px;
            --border-radius: 4px !important;
        }
    }
    
    .cssBtnWhats{
        --background: rgb(19, 187, 19);
    }
    .cssCard11{
        margin: 5px auto;
        margin-top: 5px;
    }
    
    capacitor-google-map {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
      `
      let content = document.getElementById("printable").innerHTML
      content = `<style type='text/css'>${css} <style>` + content
      this.printer.print(content, options).then(() => {
        console.log("doc printed");

      }, (err) => {
        console.log(err);

      });
    }, () => {
      console.log("printer is not Available()");
    });

  }
  ngOnInit() {
    console.log("mapRef 1 :", this.mapRef);

  }
  doRefresh(event) {
    console.log("mapRef refresh :", this.mapRef);

    this.parametrage()
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  goBack() {
    this.navCtrl.back();
  }

  public toFloat(value: string): number {
    return parseFloat(value);
  }
  ionViewWillEnter() {
    console.log("mapRef 2 :", this.mapRef);
  }
  ionViewDidEnter() {
    this.parametrage()
  }
  parametrage() {
    this.paramService.getOrderDetails({ code: this.code }).subscribe((res: any) => {
      this.order_details = res
      this.coordinate = {
        lat: this.order_details[0].lat,
        lng: this.order_details[0].lng
      }
      this.createMap(this.coordinate);
    })
  }

  async createMap(coordinate) {
    console.log("mapRef 3:", this.mapRef);

    const newMap = await GoogleMap.create({
      id: 'my-map', // Unique identifier for this map instance
      element: this.mapRef.nativeElement, // reference to the capacitor-google-map element
      apiKey: this.apiKey, // Your Google Maps API Key
      config: {
        center:
          // The initial position to be rendered by the map
          coordinate,
        zoom: 10, // The initial zoom level to be rendered by the map

      },
    });

    // Add a marker to the map
    // const markerId = await newMap.addMarker({
    //   coordinate
    // });
  }

}
