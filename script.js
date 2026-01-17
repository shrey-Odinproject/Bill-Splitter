// State Management
let people = ["shrey", "vatsal", "priyansh", "ayush", "samrah", "janu"];
// Unique colors for each person (Cycles through these if more people are added)
const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f43f5e"];
let items = [];

const fileInput = document.getElementById('billUpload');
const status = document.getElementById('status');

// OCR logic
fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    status.innerText = "⏳ Reading receipt... please wait.";

    try {
        const { data: { text } } = await Tesseract.recognize(file, 'eng');
        processText(text);
        status.innerText = "✅ Scan complete!";
    } catch (err) {
        status.innerText = "❌ Error reading image.";
        console.error(err);
    }
};

function processText(rawText) {
    const lines = rawText.split('\n');
    lines.forEach(line => {
        const priceMatch = line.match(/(\d+[.,]\d{2})/);
        if (priceMatch) {
            const price = parseFloat(priceMatch[0].replace(',', '.'));
            const name = line.replace(priceMatch[0], '').trim() || "Scanned Item";

            const ignoreList = ['total', 'tax', 'subtotal', 'visa', 'cash', 'change', 'amount'];
            const shouldIgnore = ignoreList.some(word => name.toLowerCase().includes(word));

            if (!shouldIgnore && price > 0) {
                items.push({ name, price, splits: new Array(people.length).fill(false) });
            }
        }
    });
    render();
}

// Interaction Logic
function addManualItem() {
    const name = document.getElementById('manualName').value;
    const price = parseFloat(document.getElementById('manualPrice').value);

    // Older logic: will not add if price is 0 or empty string
    if (name && price) {
        items.push({ name, price, splits: new Array(people.length).fill(false) });
        render();
        document.getElementById('manualName').value = '';
        document.getElementById('manualPrice').value = '';
    }
}

function addPerson() {
    const name = document.getElementById('newPersonName').value;
    if (name) {
        people.push(name);
        items.forEach(item => item.splits.push(false));
        render();
        document.getElementById('newPersonName').value = '';
    }
}

function removePerson(index) {
    people.splice(index, 1);
    items.forEach(item => item.splits.splice(index, 1));
    render();
}

function toggleSplit(itemIdx, personIdx) {
    items[itemIdx].splits[personIdx] = !items[itemIdx].splits[personIdx];
    render();
}

function removeItem(index) {
    items.splice(index, 1);
    render();
}

// Rendering UI
// Add this new function to your script.js
function toggleAllForPerson(personIdx) {
    // Check if at least one item is NOT checked for this person
    const anyUnchecked = items.some(item => !item.splits[personIdx]);

    // If there are unchecked items, check them all. Otherwise, uncheck all.
    items.forEach(item => {
        item.splits[personIdx] = anyUnchecked;
    });
    render();
}

function render() {
    const headerRow = document.getElementById('headerRow');
    const tableBody = document.getElementById('tableBody');
    const totalRow = document.getElementById('totalRow');

    // 1. Header with Black/White cells
    headerRow.innerHTML = `
        <th style="background-color: black; color: white;">Item</th>
        <th style="background-color: black; color: white;">Price</th>
    `;

    // Inside your render() function in script.js
    people.forEach((p, i) => {
        const userColor = colors[i % colors.length];
        headerRow.innerHTML += `
        <th style="background-color: ${userColor}; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); padding: 12px 4px;">
            <div style="margin-bottom: 8px; font-weight: bold;">${p}</div>
            
            <div class="header-button-group">
                <button onclick="toggleAllForPerson(${i})" class="btn-all">Check All</button>
                <button onclick="removePerson(${i})" class="btn-remove">✕</button>
            </div>
        </th>`;
    });

    tableBody.innerHTML = '';
    let personTotals = new Array(people.length).fill(0);
    let grandTotal = 0; // Track the sum of all items

    // 2. Render the items
    items.forEach((item, itemIdx) => {
        grandTotal += item.price; // Add to bill total
        const splitCount = item.splits.filter(s => s).length;
        const pricePer = splitCount > 0 ? item.price / splitCount : 0;

        let rowHtml = `<tr>
            <td style="text-align: left;">
                <button onclick="removeItem(${itemIdx})" class="danger" style="padding:2px 5px; margin-right: 5px;">×</button> 
                ${item.name}
            </td>
            <td style="font-weight: bold;">€${item.price.toFixed(2)}</td>`;

        people.forEach((_, personIdx) => {
            const isChecked = item.splits[personIdx];
            const userColor = colors[personIdx % colors.length];
            if (isChecked) personTotals[personIdx] += pricePer;

            rowHtml += `<td>
                <input type="checkbox" 
                       class="split-checkbox" 
                       style="accent-color: ${userColor}" 
                       ${isChecked ? 'checked' : ''} 
                       onchange="toggleSplit(${itemIdx}, ${personIdx})">
            </td>`;
        });
        rowHtml += `</tr>`;
        tableBody.innerHTML += rowHtml;
    });

    // 3. Render the footer (Totals per person)
    totalRow.innerHTML = `<td colspan="2" style="background-color: black; color: white;">TOTAL PER PERSON</td>`;
    personTotals.forEach((sum, i) => {
        const userColor = colors[i % colors.length];
        totalRow.innerHTML += `<td style="color: ${userColor}; font-weight: 800; font-size: 1.1em;">€${sum.toFixed(2)}</td>`;
    });

    // 4. Update the Grand Total display
    document.getElementById('billGrandTotal').innerText = `Total Bill: €${grandTotal.toFixed(2)}`;
}

// Initial Run
render();