import { Component, OnInit } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';

@Component({
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  imgags: string[];
  public carouselBannerItems: Array<any> = [];
  public carouselBanner: NgxCarousel;
  constructor() {}
  public pdfsrc = 'http://www.pdf995.com/samples/pdf.pdf';
  ngOnInit() {
    this.imgags = [
      'assets/img/bg1.png',
      'assets/img/bg2.jpg',
      'assets/img/bg3.jpg',
      'assets/img/bg4.jpg',
      'assets/img/bg5.jpg'
    ];
    this.carouselBanner = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: 4,
      speed: 500,
      interval: 5000,
      point: {
        visible: true,
        pointStyles: `
          .ngxcarouselPoint {
 display: none;
            list-style-type: none;
            text-align: center;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            position: absolute;
            width: 100%;
            bottom: 20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngxcarouselPoint li {
            display: none;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.55);
            padding: 5px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngxcarouselPoint li.active {
              background: white;
              width: 10px;
          }
        `
      },
      load: 2,
      custom: 'banner',
      touch: true,
      loop: true,
      easing: 'cubic-bezier(0, 0, 0.2, 1)'
    }
    this.carouselBannerLoad();
}
public carouselBannerLoad() {
  const len = this.carouselBannerItems.length;
  if (len <= 5) {
      for (let i = len; i < this.imgags.length; i++) {
      this.carouselBannerItems.push(
       // this.imgags[Math.floor(Math.random() * this.imgags.length)]
       this.imgags[i]
      );
    }
  }
}

}