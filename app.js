/* =================================
   Eitaa Web App Initialization
================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Check if Eitaa WebApp is available
    if (window.Eitaa && Eitaa.WebApp) {

        // Tell Eitaa that the Web App is ready
        Eitaa.WebApp.ready();

        // Expand the Web App
        Eitaa.WebApp.expand();
    }
const WebApp = window.Eitaa?.WebApp;

window.addEventListener("pageshow", function () {
    WebApp?.BackButton.hide();
});
/* =================================
   Provider Button
================================= */

const providerBtn = document.getElementById("providerBtn");

if (providerBtn) {

    providerBtn.addEventListener("click", function () {

        console.log("Provider selected");

        // بررسی وجود Eitaa WebApp
        if (window.Eitaa && window.Eitaa.WebApp) {

            // لرزش کوتاه
            window.Eitaa.WebApp.HapticFeedback
                .impactOccurred("light");

        }

        // رفتن به صفحه Provider
        window.location.href = "provider/index.html";

    });

}
/* ================================
       Receiver Button
   ================================= */

const receiverBtn = document.getElementById("receiverBtn");

receiverBtn.addEventListener("click", function () {

    console.log("Receiver selected");

    // Haptic feedback
    if (window.Eitaa && Eitaa.WebApp) {
        Eitaa.WebApp.HapticFeedback.impactOccurred("light");
    }

    // Hide home section
    const homeSection = document.getElementById("home-section");

    if (homeSection) {
        homeSection.style.display = "none";
    }

    // Show chat section
    const chatSection = document.getElementById("chat-section");

    if (chatSection) {
        chatSection.style.display = "block";
    }

});

/* ================================
       AI Chat - n8n Connection
   ================================= */

// n8n Chat Webhook URL
const N8N_CHAT_URL =

    "https://rasoul2000.app.n8n.cloud/webhook/bd1b9c4b-ca4f-477e-8457-3b3203a970ad/chat";


// عناصر چت
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chat-messages");
const backBtn = document.getElementById("backBtn");


// شناسه جلسه کاربر
// برای اینکه n8n بتواند مکالمه کاربر را از هم تفکیک کند
let sessionId = localStorage.getItem("hamyar_sanat_session_id");

if (!sessionId) {

    sessionId =
        "user_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 10);

    localStorage.setItem(
        "hamyar_sanat_session_id",
        sessionId
    );
}


/* ================================
       نمایش پیام در چت
   ================================= */

function addMessage(message, type) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add(
        type === "user"
            ? "user-message"
            : "bot-message"
    );

    if (type === "user") {

        messageDiv.innerHTML = `
            <p>${escapeHtml(message)}</p>
        `;

    } else {

        messageDiv.innerHTML = `
            <strong>🤖 همیار صنعت</strong>
            <p>${formatBotMessage(message)}</p>
        `;

    }

    chatMessages.appendChild(messageDiv);

    // رفتن به آخرین پیام
    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* ================================
       جلوگیری از HTML Injection
   ================================= */

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ================================
       قالب‌بندی پاسخ AI
   ================================= */

function formatBotMessage(message) {

    if (!message) {
        return "";
    }

    return escapeHtml(message)
        .replace(/\n/g, "<br>");
}


/* ================================
       نمایش وضعیت در حال پردازش
   ================================= */

function showTyping() {

    const typingDiv =
        document.createElement("div");

    typingDiv.id = "typing-message";

    typingDiv.classList.add("bot-message");

    typingDiv.innerHTML = `
        <strong>🤖 همیار صنعت</strong>
        <p>در حال بررسی درخواست شما...</p>
    `;

    chatMessages.appendChild(typingDiv);

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* ================================
       حذف وضعیت پردازش
   ================================= */

function hideTyping() {

    const typing =
        document.getElementById(
            "typing-message"
        );

    if (typing) {
        typing.remove();
    }
}


/* ================================
       ارسال پیام به n8n
   ================================= */

async function sendMessage() {

    const message =
        chatInput.value.trim();

    // اگر چیزی وارد نشده
    if (!message) {
        return;
    }


    // نمایش پیام کاربر
    addMessage(
        message,
        "user"
    );


    // پاک کردن Input
    chatInput.value = "";


    // غیرفعال کردن دکمه
    sendBtn.disabled = true;

    sendBtn.textContent = "در حال ارسال...";


    // نمایش Loading
    showTyping();


    try {

        console.log(
            "Sending message to n8n:",
            message
        );


        const response =
            await fetch(
                N8N_CHAT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        chatInput: message,

                        sessionId: sessionId

                    })
                }
            );


        console.log(
            "n8n response status:",
            response.status
        );


        // بررسی خطای HTTP
        if (!response.ok) {

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        // دریافت پاسخ
        const data =
            await response.json();


        console.log(
            "n8n response:",
            data
        );


        // حذف Loading
        hideTyping();


        /*
         * n8n ممکن است پاسخ را
         * در یکی از این فیلدها برگرداند.
         */

        const botResponse =
            data.output ||
            data.text ||
            data.response ||
            data.message ||
            data.answer;


        if (botResponse) {

            addMessage(
                botResponse,
                "bot"
            );

        } else {

            addMessage(
                "پاسخی از دستیار دریافت نشد.",
                "bot"
            );

            console.log(
                "Unknown n8n response:",
                data
            );

        }


    } catch (error) {

        console.error(
            "n8n connection error:",
            error
        );


        // حذف Loading
        hideTyping();


        addMessage(
            "⚠️ در ارتباط با دستیار هوشمند مشکلی ایجاد شد. لطفاً دوباره تلاش کنید.",
            "bot"
        );

    }


    // فعال کردن دکمه
    sendBtn.disabled = false;

    sendBtn.textContent = "ارسال";
}


/* ================================
       کلیک روی دکمه ارسال
   ================================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);


/* ================================
       ارسال با Enter
   ================================= */

chatInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* ================================
       دکمه بازگشت
   ================================= */

backBtn.addEventListener(
    "click",
    function () {

        // Haptic feedback
        if (
            window.Eitaa &&
            Eitaa.WebApp
        ) {

            Eitaa.WebApp
                .HapticFeedback
                .impactOccurred("light");

        }


        // مخفی کردن چت
        const chatSection =
            document.getElementById(
                "chat-section"
            );

        if (chatSection) {

            chatSection.style.display =
                "none";

        }


        // نمایش صفحه اصلی
        const homeSection =
            document.getElementById(
                "home-section"
            );

        if (homeSection) {

            homeSection.style.display =
                "block";

        }

    }
);

    /* ================================
       Support Button
    ================================= */

    const supportBtn =
        document.getElementById("supportBtn");

    supportBtn.addEventListener("click", function () {

        console.log("Support selected");

        if (window.Eitaa && Eitaa.WebApp) {

            Eitaa.WebApp.HapticFeedback.impactOccurred(
                "light"
            );

            /*
             * Later we can replace this with
             * the actual Eitaa support link.
             */

            Eitaa.WebApp.showAlert(
                "فعال‌سازی بخش «خرید و فروش دستگاه» نیازمند حمایت مالی و همراهی شما عزیزان است."
            );

        } else {

            alert(
                "فعال‌سازی بخش «خرید و فروش دستگاه» نیازمند حمایت مالی و همراهی شما عزیزان است."
            );
        }

    });



});
