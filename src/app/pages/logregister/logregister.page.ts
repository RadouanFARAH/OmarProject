import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, NavController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { UserService } from 'src/app/services/user.service';
import { VilleQuartierService } from 'src/app/services/ville-quartier.service';
import jwtDecode from 'jwt-decode';
import { ToastService } from 'src/app/toasts/toast.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ParametresService } from 'src/app/services/parametres.service';

@Component({
  selector: 'app-logregister',
  templateUrl: './logregister.page.html',
  styleUrls: ['./logregister.page.scss'],
})
export class LogregisterPage implements OnInit {

  data: FormGroup;
  slideOpts = {
    speed: 400,
    allowSlideNext: false,
    allowSlidePrev: false
  };
  ville: string = "";
  showSuccessAlerte: boolean = false;
  showErrorAlerte: boolean = false;
  genre: any = "";
  role: any = "";
  manChecked: boolean = false;
  womanChecked: boolean = false;
  quartiers: any;
  responsable: any;
  villeDisabled: boolean = true;
  generatePassword: any;
  @ViewChild('slides') slides: IonSlides;
  href: string;
  showSuccessAlerte2: boolean;
  id: any;
  message: string = 'فشل في محاولة التسجيل. المرجو منك إعادة العملية.';
  username: any;
  beingRegistred: boolean = false;
  genPwd: Object;
  spinner: boolean;
  villes: any;
  selectedVille: any;
  lat: any;
  lng: any;
  imageURL: any;
  image: any;
  constructor(private platform: Platform, private paramService: ParametresService, private geolocation: Geolocation, private sanitizer: DomSanitizer, private toast: ToastService, private storage: Storage, private navCtrl: NavController, private locationService: VilleQuartierService, private fb: FormBuilder, private userService: UserService, private activeRoute: ActivatedRoute, private route: Router) {
    this.storage.get('id').then((id) => {
      this.id = id
    })
    this.storage.get('username').then((username) => {
      this.username = username
    })
    this.activeRoute.params.subscribe((params) => {
      if (params.ville) {
        this.beingRegistred = false
        this.ville = params.ville;
        let data = {
          ville: params.ville
        }
        this.locationService.getQuartierByVille(data).subscribe((res: any) => {
          this.quartiers = res
          this.data.patchValue({
            adresselogement: [res[0].id]
          })
        }, err => console.log(err))

      } else {
        this.beingRegistred = true
        // this.getVille()
        this.getVilles()
      }
      this.responsable = params.responsable;
      this.role = params.role;
    })
  }
  getVille() {
    this.generatePassword = true;
    this.locationService.getVille().subscribe((ville: any) => {
      this.ville = ville;
      this.data.patchValue({
        ville: [ville]
      })
      this.villeDisabled = true
      let data = {
        ville
      }
      this.locationService.getQuartierByVille(data).subscribe((res: any) => {
        this.quartiers = res
        this.data.patchValue({
          adresselogement: [res[0].id]
        })
      }, err => console.log(err))
    })
  }
  getVilles() {
    this.generatePassword = true;

    this.locationService.getVilles().subscribe((villes: any) => {
      this.villes = villes;

    })
  }

  getQuartiers() {

    let data = {
      ville: this.data.value.ville
    }

    this.locationService.getQuartierByVille(data).subscribe((res: any) => {
      this.quartiers = res
      this.data.patchValue({
        adresselogement: [res[0].id]
      })
    }, err => console.log(err))
  }

  goBack() {
    this.navCtrl.back();
  }
  ngOnInit() {
    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        console.log(resp.coords);
        this.lat = resp.coords.latitude
        this.lng = resp.coords.longitude

      }).catch((error) => {
        console.log('Error getting location', error);
      });

      //  let watch = this.geolocation.watchPosition();
      //  watch.subscribe((data) => {
      //   // data can be a set of coordinates, or an error (if an error occurred).
      //   // data.coords.latitude
      //   // data.coords.longitude
      //   console.log(data);

      //  });

    });

    this.data = this.fb.group({
      nomprenom: ["", Validators.required],
      ville: [this.ville],
      adresselogement: ["", Validators.required],
      adresseentreprise: [""],
      tel: ["", Validators.required],
      whatsapp: ["", Validators.required],
      email: ["", Validators.email],
      password: [""]
    })

  }

  preventCaracters(event) {

    let regex = /[0-9]/g;
    var k;
    k = event.key;  //         k = event.keyCode;  (Both can be used)
    let isNumeric = regex.test(k);
    return isNumeric
  }
  slideNext() {
    this.slides.slidePrev()

    // this.slides.slideNext()
    // this.slides.getActiveIndex().then((index)=>{

    //   this.slides.slideTo(index+1);
    // }) 
  }
  slideBack() {
    this.slides.slidePrev()

    // this.slides.getActiveIndex().then((index)=>{

    //   this.slides.slideTo(index-1);
    // }) 
  }

  checkMan() {
    this.manChecked = true;
    this.womanChecked = false;
    this.genre = 'H';
  }
  checkWoman() {
    this.womanChecked = true;
    this.manChecked = false;
    this.genre = 'F';
  }
  dismiss() {
    this.showSuccessAlerte2 = false;
    this.goBack()
  }
  register() {
    this.showErrorAlerte = false
    this.showSuccessAlerte = false;
    this.spinner = true
    let tel: string = this.data.get('tel').value
    let whatsapp = this.data.get('whatsapp').value
    if (((!tel.startsWith('06') && !tel.startsWith('07')) || (tel.length !== 10)) || ((!whatsapp.startsWith('06') && !whatsapp.startsWith('07')) || (whatsapp.length !== 10))) {
      this.toast.presentErrorToast('رقم الهاتف أو الواتس اب غير صحيح', 5000);
    } else {

      let data = { ...this.data.value, genre: this.genre, role: this.role, host: this.id, generatePassword: this.generatePassword, lat: this.lat, lng: this.lng }

      this.userService.register(data).subscribe((res:any) => {
        this.spinner = true
        const formData = new FormData();
        if (this.image) {
          formData.append('image', "profile_image_"+res.id+'.' + this.image.name.split('.')[1]);
        }
        this.paramService.setProfileImage(formData).subscribe((res: any) => {
        }, async (err) => {
          console.log(err)
        })
        this.data.reset()
        this.genPwd = res.genPwd
        if (this.beingRegistred) {
          let listname = ''
          if (this.role == 'C') listname = 'العملاء'
          if (this.role == 'V') listname = 'البائعين'
          if (this.role == 'R') listname = 'المسؤولين'
          this.href = `whatsapp://send?phone=${data.whatsapp.replace('0', '212')}&text=مرحبا%2C%20لقد%20تمت%20إضافتك%20إلى%0a%20لائحة%20${listname}%2C%20يمكنكم%20ولوج%20تطبيق%20إقتصد%20بأدخال%20رقم%20هاتفكم%0a%20*${data.tel}*%20و%20رمزكم%20السري%20*${res}*%20بعد%20تسجيلكم%20بهذا%20رمز%20يمكنكم%20تغييره%20برمز%20سري%20خاص%20بكم%0a%0a%0A%0A%0A.ملاحظه%3A%0A%20تطبيق%20إقتصد%20غير%20متاح%20لأن%20على%20متجر%20قوقل%20بلاي%20سيتم%20إصداره%20قريباً%20و%20سوف%20%20نخبركم%20فور%20نزوله.`
          this.showSuccessAlerte2 = true;
        } else {
          if (this.role == 'C') {
            let dt = {
              id: data.tel,
              pwd: data.password
            }
            this.userService.login(dt).subscribe(async (res: any) => {

              let decodedToken: any = jwtDecode(res.token)
              await this.storage.set('token', res.token)
              await this.storage.set('username', res['name'])
              await this.storage.set('id', decodedToken.id)
              await this.storage.set('role', res['role'])
              await this.userService.name.next(res['name'])
              await this.userService.role.next(res['role'])
              this.route.navigate(["categories"])

            }, async (err) => {
              this.toast.presentErrorToast('', 3000);
              this.showSuccessAlerte = true;

            })
          } else {
            this.showSuccessAlerte = true;
          }
        }
        // send whatssapp message:
      }, (err) => {
        if (err.status == 409) {
          this.message = 'المستخدم موجود بالفعل في نظامنا'
        }
        this.showErrorAlerte = true;
        setTimeout(() => {
          this.showErrorAlerte = false;
        }, 3000);
      })
    }

  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
  onChange(e) {

    if (e.target.files[0].size > 10000000) {
      this.toast.presentErrorToast('حجم الصورة كبير جدا', 5000)
      return
    } else {
      this.imageURL = this.sanitizeImageUrl(URL.createObjectURL(e.target.files[0]))
      this.image = e.target.files[0]
    }

  }
  dimissLoginAlert() {
    this.route.navigate(['login'])
  }



}
