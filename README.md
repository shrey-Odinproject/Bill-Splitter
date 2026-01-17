# 💶 Bill Splitter

A lightweight, browser-based utility to split complex bills among friends. No database, no login, and no data tracking—everything stays in your browser's local state.

## 🚀 Features
- **OCR Receipt Scanning:** Upload a photo of your bill to automatically extract items and prices.
- **Dynamic People Management:** Add or remove friends on the fly.
- **Visual Color Coding:** Each person is assigned a unique color for easy tracking across the table.
- **Check-All Utility:** Quickly assign all items to a single person with one click.
- **Real-time Math:** Instant calculation of "who owes what" as you check or uncheck items.

## 💡 Pro-Tips for Accuracy

### 1. Handling Discounts & Vouchers
To apply a discount, tax deduction, or a fixed-amount voucher:
* Click **Add Manually**.
* Enter the name (e.g., "Promo Code").
* **Enter a negative value** for the price (e.g., `-5.00`).
* Check the boxes for the people who should share that discount.

### 2. OCR Scanning Limitations
> [!WARNING]  
> **Accuracy Notice:** The "Upload Bill" feature uses Tesseract.js (client-side OCR). While convenient, it is **not 100% reliable** yet.

> [!TIP]
> **For Best Results:** When taking a photo or uploading, try to scan **only the items and prices**. Excluding the store header (contact details) and the footer (totals/tax) prevents the AI from getting confused by extra numbers.

* **Image Quality:** Ensure the photo is well-lit and the text is not blurry.
* **Verification:** Always double-check the prices and item names after scanning. 
* **Manual Correction:** Use the "Add Manually" or "Remove (✕)" buttons to fix any errors the AI makes.

## 🛠️ Tech Stack
- **HTML5 / CSS3** (Flexbox/Grid for mobile responsiveness)
- **Vanilla JavaScript** (State management and DOM manipulation)
- **Tesseract.js** (Optical Character Recognition)

## 📦 Local Setup
1. Clone this repository.
2. Open `index.html` in any modern web browser.
3. (Optional) Host on **GitHub Pages** for free by enabling "Pages" in your repository settings.