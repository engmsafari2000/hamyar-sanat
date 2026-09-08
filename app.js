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
/* ================================
   Provider Button
================================ */




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


 /* =================================
       Receiver Button
    ================================= */

    const receiverBtn =
        document.getElementById("receiverBtn");

    if (receiverBtn) {

        receiverBtn.addEventListener("click", function () {

            console.log("Receiver selected");

            // Haptic feedback
            if (WebApp) {
                WebApp.HapticFeedback
                    .impactOccurred("light");
            }س

            /*
               Temporary receiver page
               Redirect to Hamsanat website
            */

            window.location.href = "https://www.hamsanat.ir/";

        });

    }



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
