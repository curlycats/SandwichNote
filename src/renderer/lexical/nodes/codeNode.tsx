import { CodeNode } from '@lexical/code';
import { EditorConfig } from 'lexical';

export class CustomCodeNode extends CodeNode {
  static getType() {
    return 'custom-code';
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    console.log('CustomCodeNode created DOM element:', element);
    element.classList.add('editor-code');
    return element;
  }

  // You can add custom methods or override existing ones here
}
