/**
 * ============================================================
 * EWMS - OCR Module (Server-side)
 * AI Optical Character Recognition for Meter Reading
 * ============================================================
 */

/**
 * readElecMeterFromBase64(base64Data)
 * Processes an image using Gemini AI to read meter digits.
 * @param {string} base64Data - Image data in base64 format.
 * @returns {object} Result containing success status and reading.
 */
function readElecMeterFromBase64(base64Data) {
  try {
    var imageData = base64Data;
    var mimeType  = "image/jpeg";

    if (base64Data.indexOf(',') > -1) {
      var parts = base64Data.split(',');
      imageData = parts[1];
      var header = parts[0]; 
      var mMatch = header.match(/data:([^;]+);/);
      if (mMatch) { mimeType = mMatch[1]; }
    }

    // IMPORTANT: Set your Gemini API Key in Script Properties
    var props = PropertiesService.getScriptProperties();
    var GEMINI_API_KEY = props.getProperty('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      return { success: false, error: 'API Key not found. Please set GEMINI_API_KEY in Script Properties.' };
    }

    var model = "gemini-2.0-flash"; // Standard fast model
    var url   = "https://generativelanguage.googleapis.com/v1beta/models/" 
              + model + ":generateContent?key=" + GEMINI_API_KEY;

    var prompt =
      "This is a Thai electricity meter (drum/dial type). " +
      "Find the row of digit wheels (odometer-style counter). " +
      "Read ONLY the digits inside WHITE or BLACK frames, from left to right. " +
      "IGNORE the last digit(s) that are inside a RED frame or box. " +
      "IGNORE any digit after a decimal point. " +
      "IGNORE digits that are only half-visible or between two numbers. " +
      "The result should be 4-6 digits only. " +
      "Reply with ONLY the digits, no spaces, no decimals, no other text. " +
      "Example: 02565";

    var requestBody = {
      contents: [{
        role: "user",
        parts: [
          { inline_data: { mime_type: mimeType, data: imageData } },
          { text: prompt }
        ]
      }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 30
      }
    };

    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(requestBody),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    var httpCode = response.getResponseCode();
    var body     = response.getContentText();

    if (httpCode !== 200) {
      return { success: false, error: "HTTP error: " + httpCode, raw: body };
    }

    var json = JSON.parse(body);
    if (!json.candidates || json.candidates.length === 0) {
      return { success: false, error: "AI returned no candidates.", raw: body };
    }

    var text = json.candidates[0].content.parts[0].text.trim();
    // Clean result: take only first line and remove non-digits
    var cleaned = text.split('.')[0].replace(/[^0-9]/g, "");

    if (cleaned.length >= 3 && cleaned.length <= 7) {
      return { success: true, reading: cleaned, raw: text };
    }

    return { success: false, error: "Reading failed or irregular format: " + text, raw: text };

  } catch (e) {
    return { success: false, error: "Server error: " + e.toString() };
  }
}
