import { EventEmitter, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { UploadFile } from './upload-file.model';
import { UploadEvent } from './upload-event.model';
export declare class FileComponent implements OnDestroy {
    private zone;
    headertext: string;
    customstyle: string;
    onFileDrop: EventEmitter<UploadEvent>;
    onFileOver: EventEmitter<any>;
    onFileLeave: EventEmitter<any>;
    stack: any[];
    files: UploadFile[];
    subscription: Subscription;
    dragoverflag: boolean;
    constructor(zone: NgZone);
    onDragOver(event: Event): void;
    onDragLeave(event: Event): void;
    dropFiles(event: any): void;
    private traverseFileTree(item, path);
    private addToQueue(item);
    pushToStack(str: any): void;
    popToStack(): void;
    private clearQueue();
    private preventAndStop(event);
    ngOnDestroy(): void;
}
