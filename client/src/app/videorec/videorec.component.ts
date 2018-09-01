import { Component, OnInit, ViewChild } from '@angular/core';
let RecordRTC = require('recordrtc/RecordRTC.min');
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-videorec',
  templateUrl: './videorec.component.html',
  styleUrls: ['./videorec.component.css']
})
export class VideorecComponent implements OnInit {
  private stream: MediaStream;
  private recordRTC: any;
  @ViewChild('video') video;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    // set the initial state of the video
    let video:HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }

  toggleControls() {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  successCallback(stream: MediaStream) {

    var options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    let video: HTMLVideoElement = this.video.nativeElement;
   // video.src = window.URL.createObjectURL(stream); ---------  depriciated
    video.srcObject = stream;
    this.toggleControls();
  }

  errorCallback() {
    //handle error here
  }

  processVideo(audioVideoWebMURL) {
    let video: HTMLVideoElement = this.video.nativeElement;
    let recordRTC = this.recordRTC;
    video.src = audioVideoWebMURL;
    this.toggleControls();
    var recordedBlob = recordRTC.getBlob();
    var fileName = this.generateRandomString() + '.webm';
                
                var file = new File([recordedBlob], fileName, {
                    type: 'video/webm'
                });
                const formData: FormData = new FormData();
                formData.append('filetoupload', file);
                this.http.post('https://mybitrade.com:3001/api/uploadvideofile', formData)
                  .subscribe(data => {
                
                  });

   // alert(recordedBlob)
    recordRTC.getDataURL(function (dataURL) { });
  }

  generateRandomString() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

  startRecording() {
    let mediaConstraints: any;
     mediaConstraints = {
      video: {
        mandatory: {
          maxWidth: 320,
          maxHeight: 240
        }
      }, audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));


  }

  stopRecording() {
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
  }

  download() {
    this.recordRTC.save('video.webm');
  }
}
