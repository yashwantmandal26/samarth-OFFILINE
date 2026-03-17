import sys
import os
import json
import easyocr

# Initialize EasyOCR
# lang=['hi', 'en'] for Hindi and English support
# gpu=False for better compatibility across all systems (CPU fallback)
reader = easyocr.Reader(['hi', 'en'], gpu=False)

def perform_ocr(image_path):
    if not os.path.exists(image_path):
        return {"error": "Image path does not exist"}
    
    try:
        # reader.readtext returns a list of tuples: (bbox, text, confidence)
        result = reader.readtext(image_path)
        
        extracted_text = [line[1] for line in result]
        
        return {"text": " ".join(extracted_text)}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)
    
    img_path = sys.argv[1]
    output = perform_ocr(img_path)
    print(json.dumps(output))
