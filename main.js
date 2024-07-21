const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const result = document.getElementById('result');
 let code_data ;


    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            video.srcObject = stream;

            // Ensure the video dimensions are set once the metadata is loaded
            video.addEventListener('loadedmetadata', () => {
                video.play();
                scanWithJsQR();
            });
        } catch (err) {
            console.error("Error accessing camera: ", err);
        }
    }

    async function scanWithJsQR() {
        try {
            while (true) {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                        code_data = code.data;
                        addContent(code_data);
                        stopVideoStream();
                        redirect(code_data);
                        return;
                    }
                }
                await new Promise(requestAnimationFrame);
            }
        } catch (err) {
            console.error("Error detecting QR code with jsQR: ", err);
            await new Promise(requestAnimationFrame);
            await scanWithJsQR();
        }
    }

    function redirect(code_data){
        const data  = code_data.slice(0,4);
        if(data==="http"){   
            window.open(code_data);    
        }
    }

    function stopVideoStream() {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
document.addEventListener('DOMContentLoaded', (event) => {
    initCamera();
});


const scan = document.querySelector(".scanning");
scan.addEventListener("click", () =>{   
    console.log("Scanner")
    const qrcontent = document.getElementById("qrcontent");
    qrcontent.style.display = "none";
    initCamera();
})

const close = document.querySelector(".closebtn");
close.addEventListener("click", () =>{
    const qrcontent = document.getElementById("qrcontent");
    qrcontent.style.display = "none";
})

function addContent(content){
    const qrcontent = document.getElementById("qrcontent");
    const qrcontentAdd = document.querySelector(".qrcontent-js");
    qrcontent.style.display = "block";
    const h3 = document.createElement("h3");
    h3.innerHTML = content;
    qrcontentAdd.appendChild(h3);
    initCamera();
}



const upload = document.querySelector(".uploading");
console.log(upload);
upload.addEventListener("click",()=>{
    console.log("upload")
    const imgupload = document.querySelector(".imgupload");
    imgupload.click();
});

document.querySelector(".imgupload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    stopVideoStream();
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const canvas = document.getElementById('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0, img.width, img.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
                if (qrCode) {
                    code_data = qrCode.data;
                    addContent(code_data);
                    
                } else {
                    const qrcontent = document.getElementById("qrcontent");
                    qrcontent.style.display = "none";
                    alert("NO QR Code Found");
                    
                }
            };
        };
        reader.readAsDataURL(file);
    }
});