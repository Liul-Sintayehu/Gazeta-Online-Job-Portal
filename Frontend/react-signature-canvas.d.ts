declare module 'react-signature-canvas' {
  import { Component, RefObject } from 'react';

  export interface SignatureCanvasProps {
    canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
    clearOnResize?: boolean;
    backgroundColor?: string;
    penColor?: string;
    onEnd?: () => void;
    onBegin?: () => void;
  }

  export default class SignatureCanvas extends Component<SignatureCanvasProps> {
    clear(): void;
    isEmpty(): boolean;
    toDataURL(type?: string, encoderOptions?: number): string;
    fromDataURL(dataUrl: string, options?: any): void;
    toData(): any;
    fromData(pointGroups: any): void;
  }
}
