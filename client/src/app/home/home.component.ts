import { Component, OnInit,ViewChild } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
//import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Router } from '@angular/router';
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imageUrls = [
    { url: 'assets/img/bg11.png' },
    { url: 'assets/img/bg22.png' },
    { url: 'assets/img/bg33.png' },
    { url: 'assets/img/bg44.png' },
    { url: 'assets/img/bg55.png' },
    { url: 'assets/img/bg6.png' }
  ];
  backgroundSize: string = '100%';
  height: string = '312px';
  imgags: string[];
  @ViewChild('slideshow') slideshow: any;
  public carouselBannerItems: Array<any> = [];
  public carouselBanner: NgxCarousel;
  constructor(
    private auth: AuthenticationService,
    private router: Router

  ) {
    if (auth.isLoggedIn()) {
      // digital_sign
    router.navigate(['landing']);
  }
}

  ngOnInit() {
 
}

    setcarouselimage(image) {
  
      this.slideshow.goToSlide(image);
    }

}
