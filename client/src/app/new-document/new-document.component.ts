import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';


@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.css']
})
export class NewDocumentComponent implements OnInit {
  hide: any;
  hideme:any;
  constructor(
        private router: Router,
  ) { }

  ngOnInit() {
  }
  hideshow() {
    if (this.hide == null) {
      this.hide = 'hide';

    } else {
      this.hide = null;
    }
  }
  hidealso() {
    if (this.hideme == null) {
      this.hideme = 'hide';

    } else {
      this.hideme = null;
    }
  }

  opendocument(path) {
    this.router.navigateByUrl('/digital_sign/'+path);
    localStorage.setItem('digitalpath',path)
  }
}
