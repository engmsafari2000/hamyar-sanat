/* =================================
   Eitaa Web App Initialization
================================= */

document.addEventListener("DOMContentLoaded", function () {

    //* =================================
       Eitaa WebApp
    ================================= */

    const WebApp = window.Eitaa?.WebApp;

    // Initialize Eitaa WebApp
    if (WebApp) {
        WebApp.ready();
        WebApp.expand();

        // Back Button must be hidden on the main page
        WebApp.BackButton.hide();
    }

    /*
       When the main page is restored from browser BFCache,
       DOMContentLoaded may not run again.
       pageshow guarantees that the Back Button is hidden.
    */
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

            if (WebApp) {
                WebApp.HapticFeedback.impactOccurred("light");
            }

            // Go to provider page
            window.location.href = "provider/index.html";
        });
    }


    /* =================================
       Receiver Button
    ================================= */

    const receiverBtn = document.getElementById("receiverBtn");

    if (receiverBtn) {
        receiverBtn.addEventListener("click", function () {

            console.log("Receiver selected");

            if (WebApp) {
                WebApp.HapticFeedback.impactOccurred("light");
            }

            const homeSection =
                document.getElementById("home-section");

            const chatSection =
                document.getElementById("chat-section");

            if (homeSection) {
                homeSection.style.display = "none";
            }

            if (chatSection) {
                chatSection.style.display = "block";
            }
        });
    }


    /* =================================
       AI Chat - n8n Connection
    ================================= */

    const N8N_CHAT_URL =
        "https://rasoul2000.app.n8n.cloud/webhook/bd1b9c4b-ca4f-477e-8457-3b3203a970ad/chat";

    const chatInput =
        document.getElementById("chatInput");

    const sendBtn =
        document.getElementById("sendBtn");

    const chatMessages =
        document.getElementById("chat-messages");

    const backBtn =
        document.getElementById("backBtn");


    /* =================================
       Session ID
    ================================= */

    let sessionId =
        localStorage.getItem("hamyar_sanat_session_id");

    if (!sessionId) {

        sessionId =
            "user_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 10);

        localStorage.setItem(
            "hamyar_sanat_session_id",
            sessionId
        );
    }


    /* =================================
       Add Message
    ================================= */

    function addMessage(message, type) {

        if (!chatMessages) {
            return;
        }

        const messageDiv =
            document.createElement("div");

        messageDiv.classList.add(
            type === "user"
                ? "user-message"
                : "bot-message"
        );

        if (type === "user") {

            messageDiv.innerHTML =
                `<p>${escapeHtml(message)}</p>`;

        } else {

            messageDiv.innerHTML =
                `<strong>🤖 همیار صنعت</strong>
                 <p>${formatBotMessage(message)}</p>`;
        }

        chatMessages.appendChild(messageDiv);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }


    /* =================================
       Escape HTML
    ================================= */

    function escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text ?? "";

        return div.innerHTML;
    }


    /* =================================
       Format Bot Message
    ================================= */

    function formatBotMessage(message) {

        if (!message) {
            return "";
        }

        return escapeHtml(message)
            .replace(/\n/g, "<br>");
    }


    /* =================================
       Typing Indicator
    ================================= */

    function showTyping() {

        if (!chatMessages) {
            return;
        }

        // Prevent duplicate typing indicators
        if (document.getElementById("typing-message")) {
            return;
        }

        const typingDiv =
            document.createElement("div");

        typingDiv.id =
            "typing-message";

        typingDiv.classList.add(
            "bot-message"
        );

        typingDiv.innerHTML =
            `<strong>🤖 همیار صنعت</strong>
             <p>در حال بررسی درخواست شما...</p>`;

        chatMessages.appendChild(typingDiv);

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }


    /* =================================
       Hide Typing Indicator
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


    /* =================================
       Send Message
    ================================= */

    async function sendMessage() {

        if (!chatInput || !sendBtn) {
            return;
        }

        const message =
            chatInput.value.trim();

        if (!message) {
            return;
        }

        addMessage(message, "user");

        chatInput.value = "";

        sendBtn.disabled = true;
        sendBtn.textContent =
            "در حال ارسال...";

        showTyping();

        try {

            console.log(
                "Sending message to n8n:",
                message
            );

            const response =
                await fetch(N8N_CHAT_URL, {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        chatInput: message,
                        sessionId: sessionId
                    })
                });


            console.log(
                "n8n response status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "HTTP Error: " +
                    response.status
                );
            }


            const data =
                await response.json();


            console.log(
                "n8n response:",
                data
            );


            hideTyping();


            /*
               n8n may return the response
               under different property names.
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

            hideTyping();

            addMessage(
                "⚠️ در ارتباط با دستیار هوشمند مشکلی ایجاد شد. لطفاً دوباره تلاش کنید.",
                "bot"
            );

        } finally {

            sendBtn.disabled = false;

            sendBtn.textContent =
                "ارسال";
        }
    }


    /* =================================
       Send Button
    ================================= */

    if (sendBtn) {

        sendBtn.addEventListener(
            "click",
            sendMessage
        );
    }


    /* =================================
       Enter Key
    ================================= */

    if (chatInput) {

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
    }


    /* =================================
       Internal Chat Back Button
       
       IMPORTANT:
       This is NOT Eitaa's native
       WebApp.BackButton.
    ================================= */

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            function () {

                if (WebApp) {

                    WebApp.HapticFeedback
                        .impactOccurred("light");
                }


                const chatSection =
                    document.getElementById(
                        "chat-section"
                    );

                const homeSection =
                    document.getElementById(
                        "home-section"
                    );


                if (chatSection) {

                    chatSection.style.display =
                        "none";
                }


                if (homeSection) {

                    homeSection.style.display =
                        "block";
                }
            }
        );
    }


    /* =================================
       Support Button
    ================================= */

    const supportBtn =
        document.getElementById(
            "supportBtn"
        );


    if (supportBtn) {

        supportBtn.addEventListener(
            "click",
            function () {

                console.log(
                    "Support selected"
                );


                const message =
                    "فعال‌سازی بخش «خرید و فروش دستگاه» نیازمند حمایت مالی و همراهی شما عزیزان است.";


                if (WebApp) {

                    WebApp.HapticFeedback
                        .impactOccurred("light");

                    WebApp.showAlert(
                        message
                    );

                } else {

                    alert(message);
                }
            }
        );
    }

});
```
