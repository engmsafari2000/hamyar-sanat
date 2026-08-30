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
                if (
                    success &&
                    contactData.responseUnsafe &&
                    contactData.responseUnsafe.contact &&
                    contactData.responseUnsafe.contact.phone
                ) {

                    // استخراج شماره موبایل
                    const phoneNumber =
                        contactData.responseUnsafe.contact.phone;


                    // نمایش شماره در Console
                    console.log(
                        "Phone number:",
                        phoneNumber
                    );


                    // ذخیره شماره موبایل
                    localStorage.setItem(
                        "eitaaPhone",
                        phoneNumber
                    );


                    // بررسی شماره ذخیره‌شده
                    console.log(
                        "Saved phone:",
                        localStorage.getItem("eitaaPhone")
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
