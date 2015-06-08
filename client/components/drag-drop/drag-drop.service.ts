/**
 * This is a component that enables drag and drop support.
 */
module components.dragDrop {
  'use strict';
  /**
   * This is the structure of the drag and drop service.
   */
  export interface IDragDropService {
    getType(): string;
    setType(type: string): void;
    getData(): any;
    setData(data: any): void;
  }
  /**
   * This is the drag and drop service.
   */
  class DragDropService implements IDragDropService {
    /**
     * This is the type of the data being dragged.
     */
    private type: string;
    /**
     * This is the data being dragged.
     */
    private data: any;

    /**
     * This is the constructor that takes the injected dependencies.
     */
    constructor() {
      this.type = '';
      this.data = null;
    }

    /**
     * This returns the type of the data being dragged.
     * @returns {string}
     */
    getType(): string {
      return this.type;
    }

    /**
     * This sets the type of the data being dragged.
     * @param type
     */
    setType(type: string): void {
      this.type = type;
    }

    /**
     * This returns the data being dragged.
     * @returns {any}
     */
    getData(): any {
      return this.data;
    }

    /**
     * This sets the type of data being dragged.
     * @param data
     */
    setData(data: any): void {
      this.data = data;
    }
  }
  // register the service.
  angular.module('dragDrop').service('dragDropService', DragDropService);
}
