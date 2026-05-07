# EWMS-OCR-Module-Vibe Code  📸

ระบบอ่านเลขมิเตอร์ไฟฟ้าด้วย AI (OCR) สำหรับใช้งานบน Google Apps Script โดยใช้ Gemini AI API

## ส่วนประกอบ
1. **Code.gs**: ฟังก์ชันฝั่ง Server สำหรับส่งรูปภาพไปประมวลผลที่ Gemini API
2. **OCR_Component.html**: ส่วนแสดงผลหน้าบ้าน (HTML/CSS/JS) ที่รวมการทำงานของกล้องและการแสดงผล Scan Animation

## วิธีการใช้งาน (Setup Guide)

### 1. การตั้งค่า API Key
1. ไปที่ [Google AI Studio](https://aistudio.google.com/) เพื่อขอ API Key
2. ใน Google Apps Script Project ของคุณ ไปที่ **Project Settings (รูปฟันเฟือง)**
3. ในส่วน **Script Properties** ให้เพิ่ม Property ใหม่:
   - Property: `GEMINI_API_KEY`
   - Value: `(API Key ของคุณที่ได้จาก AI Studio)`

### 2. การติดตั้งในโปรเจกต์ใหม่
1. Copy เนื้อหาใน `Code.gs` ไปวางในโปรเจกต์ GAS ของคุณ
2. Copy เนื้อหาใน `OCR_Component.html` ไปวางในไฟล์ HTML ของคุณ หรือใช้ `include('OCR_Component')` หากคุณมีการจัดการไฟล์แยก
3. ในหน้าหลักของคุณ ให้สร้างฟังก์ชัน Callback เพื่อรับค่าที่อ่านได้:
   ```javascript
   window.onOcrSuccess = function(reading) {
     // จัดการกับตัวเลขที่อ่านได้ เช่น นำไปใส่ใน Input
     document.getElementById('your-input-id').value = reading;
     console.log('AI Read Value:', reading);
   };
   ```

## คุณสมบัติหลัก
- **Fast Analysis**: ใช้โมเดล Gemini 2.0 Flash เพื่อความรวดเร็ว
- **Native Camera Support**: รองรับการเปิดกล้องมือถือโดยตรงผ่าน `capture="environment"`
- **Scan Animation**: มี UI จำลองการสแกนเพื่อประสบการณ์ใช้งานที่ดี
- **Auto-Correction**: มีระบบตัดทศนิยมและกรองเฉพาะตัวเลขโดยอัตโนมัติ

---
พัฒนาโดย **Saila** - *Modular Extract from The9EWMS Project*
