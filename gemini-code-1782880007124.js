const WEBHOOK = "ضع_رابط_الديسكورد_هنا";

async function search() {
    const user = document.getElementById('userInput').value.trim();
    if(!user) return alert("يرجى إدخال رقم الطلب");
    
    // هنا يتم جلب البيانات من ملف data.csv
    // وبناء النتائج في div id="results"
    alert("جاري البحث عن الطلب: " + user);
}

function doAction(type, order) {
    document.getElementById('modalTitle').innerText = "تأكيد " + type;
    document.getElementById('modal').style.display = "flex";
    
    document.getElementById('confirmBtn').onclick = () => {
        // منطق الإرسال للديسكورد
        hideModal();
        alert("تمت العملية بنجاح!");
    };
}

function hideModal() {
    document.getElementById('modal').style.display = "none";
}
