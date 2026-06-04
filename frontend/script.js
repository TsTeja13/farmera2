// =========================
// PLANT DISEASE DETECTION
// =========================

async function uploadImage() {

    const file =
    document.getElementById("imageInput").files[0];

    if (!file) {
        alert("Please upload a plant image.");
        return;
    }

    document.getElementById("result").innerHTML =
        "🔍 Analyzing image... Please wait.";

    const reader = new FileReader();

    reader.onloadend = async function () {

        const base64 =
            reader.result.split(",")[1];

        try {

            const response =
                await fetch("/api/detect", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        imageBase64: base64
                    })
                });

            const data =
                await response.json();

            document.getElementById("result").innerHTML =
                data.result;

        } catch (error) {

            document.getElementById("result").innerHTML =
                "❌ Error analyzing image.";

            console.error(error);
        }
    };

    reader.readAsDataURL(file);
}



// =========================
// AI CHATBOT
// =========================

async function sendMessage() {

    const message =
        document.getElementById("userInput").value;

    if (!message) {
        alert("Please enter a question.");
        return;
    }

    document.getElementById("chatReply").innerHTML =
        "🤖 Thinking...";

    try {

        const response =
            await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message
                })
            });

        const data =
            await response.json();

        document.getElementById("chatReply").innerHTML =
            data.reply;

    } catch (error) {

        document.getElementById("chatReply").innerHTML =
            "❌ Error contacting AI.";

        console.error(error);
    }
}



// =========================
// VOICE INPUT
// =========================

function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert(
            "Speech Recognition is not supported in this browser."
        );

        return;
    }

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = function (event) {

        const transcript =
            event.results[0][0].transcript;

        document.getElementById("userInput").value =
            transcript;
    };
}