'use client';

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from "@/components/ui/button";
import { Eraser, Check, X } from 'lucide-react';

interface SignaturePadProps {
    onSave: (signatureData: string) => void;
    onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const clear = () => {
        sigCanvas.current?.clear();
        setIsEmpty(true);
    };

    const save = () => {
        if (sigCanvas.current?.isEmpty()) return;
        
        const dataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
        if (dataURL) {
            onSave(dataURL);
        }
    };

    return (
        <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl border shadow-xl">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Draw your signature</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Use your mouse or touch screen</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onCancel} className="size-8 rounded-full p-0">
                    <X className="size-4" />
                </Button>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 overflow-hidden h-48 relative">
                <SignatureCanvas 
                    ref={sigCanvas}
                    onBegin={() => setIsEmpty(false)}
                    penColor='black'
                    canvasProps={{
                        className: 'signature-canvas w-full h-full'
                    }}
                />
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <span className="text-sm font-bold uppercase tracking-[0.2em]">Sign Here</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    onClick={clear}
                    className="flex-1 rounded-xl h-12 uppercase text-[10px] font-bold tracking-widest"
                >
                    <Eraser className="size-3.5 mr-2" />
                    Clear
                </Button>
                <Button 
                    onClick={save}
                    disabled={isEmpty}
                    className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 uppercase text-[10px] font-bold tracking-widest"
                >
                    <Check className="size-3.5 mr-2" />
                    Confirm & Apply
                </Button>
            </div>
        </div>
    );
};
