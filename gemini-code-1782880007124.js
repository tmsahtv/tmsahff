const WEBHOOK = "ضع_رابط_الديسكورد_هنا";

async function search() {
    const user = document.getElementById('userInput').value.trim().toLowerCase();
    const resDiv = document.getElementById('results');
    resDiv.innerHTML = '<p class="text-center">جاري البحث...</p>';
    
    try {
        const res = await fetch('data.csv');
        const data = await res.text();
        const rows = data.split('\n');
        
        let found = false;
        let html = '';
        
        rows.forEach((row, i) => {
            if(i === 0 || !row.toLowerCase().includes(user)) return;
            found = true;
            const cols = row.split(',');
            const isDelivered = row.toLowerCase().includes('delivered');
            
            html += `
            <div class="glass p-5 rounded-2xl grid md:grid-cols-5 items-center gap-4 text-center">
                <span class="font-bold text-pink-400">طلب: ${cols[1]}</span>
                <span>${cols[3]}</span>
                <span class="text-neutral-400 text-sm">${cols[5]}</span>
                <span class="${isDelivered ? 'status-delivered' : 'status-pending'}">
                    ${isDelivered ? '✅ تم التوصيل' : '⏳ قيد التنفيذ'}
                </span>
                <div class="flex gap-2 justify-center">
                    ${!isDelivered ? `
                        <button onclick="doAction('استعجال', '${cols[1]}')" class="bg-blue-600 px-3 py-1 rounded text-xs">استعجال</button>
                        <button onclick="doAction('تعديل', '${cols[1]}')" class="bg-purple-600 px-3 py-1 rounded text-xs">تعديل</button>
                        <button onclick="doAction('إلغاء', '${cols[1]}')" class="bg-red-600 px-3 py-1 rounded text-xs">إلغاء</button>
                    ` : `<button onclick="doAction('تقييم', '${cols[1]}')" class="bg-yellow-600 px-4 py-1 rounded text-xs w-full">⭐ تقييم</button>`}
                </div>
            </div>`;
        });
        resDiv.innerHTML = found ? html : '<p class="text-center text-red-500">لا يوجد طلب بهذا الرقم.</p>';
    } catch(e) { resDiv.innerHTML = '<p class="text-center text-red-500">خطأ في الاتصال!</p>'; }
}

function doAction(type, order) {
    if (type === 'استعجال') {
        const last = localStorage.getItem(`rush_${order}`);
        if (last && (Date.now() - last < 3600000)) return alert("⚠️ تم طلب استعجال لهذا الطلب منذ أقل من ساعة.");
    }
    
    document.getElementById('modalTitle').innerText = `إجراء: ${type} - طلب ${order}`;
    document.getElementById('modalReason').style.display = (type === 'تعديل' || type === 'إلغاء') ? 'block' : 'none';
    document.getElementById('modal').style.display = 'flex';
    
    document.getElementById('confirmBtn').onclick = () => {
        const reason = document.getElementById('modalReason').value;
        const payload = {
            embeds: [{
                title: "🔔 إشعار طلب جديد من TMSAHFF STORE",
                color: 16711680,
                fields: [
                    { name: "نوع الطلب", value: type, inline: true },
                    { name: "رقم الطلب", value: order, inline: true },
                    { name: "التاريخ", value: new Date().toLocaleString(), inline: false },
                    { name: "التفاصيل / السبب", value: reason || "لا توجد إضافات" }
                ],
                footer: { text: "نظام الإدارة الاحترافي" }
            }]
        };
        fetch(WEBHOOK, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
        if (type === 'استعجال') localStorage.setItem(`rush_${order}`, Date.now());
        hideModal();
        alert('تم إرسال طلبك للإدارة بنجاح!');
    };
}

function hideModal() { document.getElementById('modal').style.display = 'none'; }