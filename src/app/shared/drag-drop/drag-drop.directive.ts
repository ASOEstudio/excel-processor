import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
})
export class DragDropDirective {
  @Output() fileOver = new EventEmitter<boolean>();
  @Output() fileDropped = new EventEmitter<any>();

  constructor() {}

  // Dragover listener
  @HostListener('dragover', ['$event'])
  onDragOver(evt): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver.emit(true);
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver.emit(false);
  }

  // Drop listener
  @HostListener('drop', ['$event'])
  public ondrop(evt): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver.emit(false);
    if (evt.dataTransfer.files.length > 0) {
      this.fileDropped.emit(evt.dataTransfer);
    }
  }
}
