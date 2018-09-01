import { Component } from '@angular/core';

@Component({
  templateUrl: './DigitalSignature.component.html'
})


export class DigitalSignatureComponent {
  pdfSrc: string  | ArrayBuffer = './assets/pdf-test.pdf';
  onFileSelected() {
    let $img: any = document.querySelector('#file');
   
    if (typeof (FileReader) !== 'undefined') {
      let reader = new FileReader();
   
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };
   
      reader.readAsArrayBuffer($img.files[0]);
    }
  }
    //pdfSrc: string = 'http://www.pdf995.com/samples/pdf.pdf';
}

