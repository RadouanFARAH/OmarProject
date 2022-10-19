import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Platform, AlertController, IonRouterOutlet, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  name: string = "";
  id: any;
  role: any;
  constructor(
    private userService: UserService,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, private storage: Storage, private helper: JwtHelperService, private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.id = params.id
    })

    this.userService.name.subscribe((n) => {

      this.name = n
    })
    this.userService.role.subscribe((n) => {

      this.role = n
    })
    this.storage.create();
    this.initializeApp();
    this.storage.get('role').then((role) => {
      if (role) {
        this.role = role
      }
    })
    this.storage.get('username').then((username) => {
      if (username) {
        this.name = username
      }
    })
  }

  async ngOnInit() {
    this.userService.name.subscribe((n) => {
      this.name = n
    })
  }
  ionViewWillEnter() {

    this.userService.name.subscribe((n) => {
      this.name = n
    })
  }
  logout(d) {
    if (d === "C") {
      this.storage.get('tokenV').then((tokenV) => {
        if (tokenV) {
          this.storage.set('token', tokenV)
          this.router.navigate(['/vendeur-home'])
        } else {
          this.storage.remove('tokenC')
          this.storage.remove('token')
          this.storage.remove('id')
          this.storage.remove('role')
          this.storage.remove('username')
          this.router.navigate(['/login'])
        }
      })
    }
    else if (d == 'V') {
      this.storage.get('tokenR').then((tokenR) => {
        if (tokenR) {
          this.storage.set('token', tokenR)
          this.router.navigate(['/responsable-home'])
        } else {
          this.storage.remove('tokenV')
          this.storage.remove('id')
          this.storage.remove('role')
          this.storage.remove('username')
          this.router.navigate(['/login'])
        }
      })
    }
    else if (d == 'R') {
      this.storage.get('tokenD').then((tokenD) => {
        if (tokenD) {
          this.storage.set('token', tokenD)
          this.router.navigate(['/directeur-home'])
        } else {
          this.storage.remove('token')
          this.storage.remove('tokenR')
          this.storage.remove('id')
          this.storage.remove('role')
          this.storage.remove('username')
          this.router.navigate(['/login'])
        }
      })
    }
    else if (d == 'D') {
      this.storage.remove('token')
      this.storage.remove('tokenD')
      this.storage.remove('id')
      this.storage.remove('role')
      this.storage.remove('username')
      this.router.navigate(['/login'])
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.backButton.subscribeWithPriority(9999, () => {
        // do nothing
      })
      this.storage.get('role').then((role) => {
        if (role == "C") {
          this.router.navigate(["categories"])
        } else if (role == "V") {
          this.router.navigate(["vendeur-home"])
        } else if (role == "R") {
          this.router.navigate(["responsable-home"])
        } else if (role == "D") {
          this.router.navigate(["directeur-home"])
        }
      })
      this.storage.get('visited').then((isVisited) => {
        if (!isVisited) {
          this.router.navigate(['/logaccount']).then(() => {
            this.storage.set('visited', true)
          })
        }
      })
    })
  }
}

