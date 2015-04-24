module components.dragDrop {
  'use strict';

  export interface IDragDropService {
    getType(): string;
    setType(type: string): void;
    getData(): any;
    setData(data: any): void;
  }

  class DragDropService implements IDragDropService {
    private type: string;
    private data: any;

    constructor() {
      this.type = '';
      this.data = null;
    }

    getType(): string {
      return this.type;
    }

    setType(type: string): void {
      this.type = type;
    }

    getData(): any {
      return this.data;
    }

    setData(data: any): void {
      this.data = data;
    }
  }

  angular.module('dragDrop').service('dragDropService', DragDropService);
}
