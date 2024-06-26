import Element from './Element';
import HTMLCanvasElement from './HTMLCanvasElement';
import HTMLImageElement from './HTMLImageElement';
import HTMLVideoElement from './HTMLVideoElement';

class Document extends Element {
  constructor() {
    super('#document');
    this.body = new Element('BODY');
    this.documentElement = new Element('HTML');
    this.readyState = 'complete';
  }

  createElement(tagName) {
    switch ((tagName || '').toLowerCase()) {
      case 'video':
        return new HTMLVideoElement(tagName);
      case 'img':
        return new HTMLImageElement(tagName);
      case 'canvas':
        return new HTMLCanvasElement(tagName);
      case 'iframe':
        // Return nothing to keep firebase working.
        return null;
      default:
        return new Element(tagName);
    }
  }

  createElementNS(tagName) {
    const element = this.createElement(tagName);
    element.toDataURL = () => ({});
    return element;
  }

  getElementById() {
    return new Element('div');
  }
}

export default Document;
