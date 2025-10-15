import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Loader2, Sparkles } from 'lucide-react';
import { simulateIngredientDetection } from '@/lib/api';

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIngredientsDetected: (ingredients: string[]) => void;
}

export const ImageUploadModal = ({ 
  open, 
  onOpenChange, 
  onIngredientsDetected 
}: ImageUploadModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setDetectedIngredients([]);
    };
    reader.readAsDataURL(file);
  };

  const handleDetectIngredients = async () => {
    if (!previewUrl) return;
    
    setIsDetecting(true);
    // Simulate API call to vision/LLM service
    const detected = await simulateIngredientDetection();
    setDetectedIngredients(detected);
    setIsDetecting(false);
  };

  const handleConfirm = () => {
    onIngredientsDetected(detectedIngredients);
    handleClose();
  };

  const handleClose = () => {
    setPreviewUrl(null);
    setDetectedIngredients([]);
    setIsDetecting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload Ingredient Photo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!previewUrl ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-32 flex flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8" />
                  <span>Choose File</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-32 flex flex-col gap-2"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8" />
                  <span>Take Photo</span>
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />

              <p className="text-sm text-muted-foreground text-center">
                Upload a photo of your ingredients for automatic detection
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>

              {detectedIngredients.length === 0 ? (
                <Button
                  onClick={handleDetectIngredients}
                  disabled={isDetecting}
                  className="w-full h-12"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Detecting Ingredients...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Detect Ingredients
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-secondary/20 border border-secondary rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      Detected Ingredients:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {detectedIngredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="bg-secondary/30 text-secondary-foreground px-3 py-1 rounded-full text-sm capitalize"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    These ingredients will be added to your list. You can edit them later.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {detectedIngredients.length > 0 && (
            <Button onClick={handleConfirm}>
              Add {detectedIngredients.length} Ingredient{detectedIngredients.length !== 1 ? 's' : ''}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
