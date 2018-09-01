import { Component } from '@angular/core';
// import { UploadFile, UploadEvent, FileSystemFileEntry, FileSystemDirectoryEntry } from 'lib/ngx-drop';
import { UploadEvent, UploadFile ,FileSystemFileEntry,FileSystemDirectoryEntry} from 'ngx-file-drop';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dragndrop',
  templateUrl: './dragndrop.component.html',
  styleUrls: ['./dragndrop.component.css']
})
export class DragndropComponent {
  constructor(private http: HttpClient) {
            
            
  }
  public files: UploadFile[] = [];

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          
          // You could upload it like this:           (Imaginary service that resizes the logo, saves it and returns the minified version back.)
          const formData = new FormData()
          formData.append('filetoupload', file, droppedFile.relativePath)
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
          // this.http.post('http://127.0.0.1:3000/api/uploadfile', formData, { headers: headers, responseType: 'blob' })
          this.http.post('https://mybitrade.com:3001/api/uploadfile', formData, { headers: headers, responseType: 'blob' })
         
          .subscribe(data => {
            console.log('i m subscribe')
            // Sanitized logo returned from backend
          })
          

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }
}