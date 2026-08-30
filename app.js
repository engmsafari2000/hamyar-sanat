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

/* ================================
   Provider Button
================================ */

/* ================================
   Provider Button
================================ */

/* ================================
   Provider Button
================================ */

const providerBtn =
    document.getElementById("providerBtn");


providerBtn.addEventListener("click", function () {

    console.log("Provider selected");


    // بررسی وجود Eitaa WebApp
    if (window.Eitaa && Eitaa.WebApp) {

        // لرزش کوتاه
        Eitaa.WebApp.HapticFeedback
            .impactOccurred("light");


        // درخواست شماره موبایل
        Eitaa.WebApp.requestContact(

            function (success, contactData) {

                console.log(
                    "Contact success:",
                    success
                );

                console.log(
                    "Contact data:",
                    contactData
                );


                // اگر کاربر شماره را تأیید کرد
                if (success) {

                    /*
                     * فعلاً کل contactData را ذخیره می‌کنیم
                     * تا ساختار دقیق اطلاعات ایتا مشخص شود.
                     */

                    localStorage.setItem(
                        "eitaaContact",
                        JSON.stringify(contactData)
                    );


                    console.log(
                        "Saved contact:",
                        localStorage.getItem("eitaaContact")
                    );


                    // رفتن به فرم خدمات‌دهنده
                    window.location.href =
                        "provider/index.html";

                }

                else {

                    Eitaa.WebApp.showAlert(
                        "برای ثبت خدمات، تأیید شماره موبایل الزامی است."
                    );

                }

            }

        );

    }

});


    /* ================================
       Receiver Button
    ================================= */

    const receiverBtn =
        document.getElementById("receiverBtn");

    receiverBtn.addEventListener("click", function () {

        console.log("Receiver selected");

        // Haptic feedback
        if (window.Eitaa && Eitaa.WebApp) {

            Eitaa.WebApp.HapticFeedback.impactOccurred(
                "light"
            );
        }

        // For now:
        // Go to receiver chatbot

        window.location.href = "receiver.html";
    });


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
                "بخش پشتیبانی به‌زودی فعال خواهد شد."
            );

        } else {

            alert(
                "بخش پشتیبانی به‌زودی فعال خواهد شد."
            );
        }

    });



});
