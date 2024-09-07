// تحميل الفيديو عند اختيار ملف الفيديو
document.getElementById('video-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const video = document.getElementById('video');
    
    // إعداد الفيديو للعرض
    video.src = URL.createObjectURL(file);
    video.load();
    video.play();

    // البدء في تحليل الفيديو عند تشغيله
    detectPeople();
});

// تحميل نموذج COCO-SSD
async function loadModel() {
    return await cocoSsd.load();  // تحميل نموذج COCO-SSD
}

// تحديد الأشخاص داخل الفيديو
async function detectPeople() {
    const videoElement = document.getElementById('video');
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');
    
    const model = await loadModel();  // تحميل النموذج

    videoElement.addEventListener('play', () => {
        // تحليل الفيديو كل 100 مللي ثانية
        const interval = setInterval(async () => {
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);  // رسم الفيديو على الكانفس
            const predictions = await model.detect(videoElement);  // تحليل الإطار الحالي للفيديو

            // مسح الكانفس في كل مرة قبل رسم النتائج الجديدة
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            predictions.forEach(prediction => {
                if (prediction.class === 'person') {
                    // تخصيص الكود لرسم مربع حول الشخص المكتشف
                    ctx.strokeStyle = '#FF0000';  // لون المربع الأحمر
                    ctx.lineWidth = 4;
                    ctx.strokeRect(
                        prediction.bbox[0],
                        prediction.bbox[1],
                        prediction.bbox[2],
                        prediction.bbox[3]
                    );
                    ctx.fillStyle = '#FF0000';  // لون النص الأحمر
                    ctx.font = '18px Arial';
                    ctx.fillText(
                        prediction.class + ' - ' + Math.round(prediction.score * 100) + '%',
                        prediction.bbox[0],
                        prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
                    );
                }
            });
        }, 100);  // فحص كل 100 مللي ثانية
    });
}
