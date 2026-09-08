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

    const receiverBtn =
        document.getElementById("receiverBtn");

    if (receiverBtn) {

        receiverBtn.addEventListener("click", function () {

            console.log("Receiver selected");

            // Haptic feedback
            if (WebApp) {
                WebApp.HapticFeedback
                    .impactOccurred("light");
            }

            /*
               Temporary receiver page
               Redirect to Hamsanat website
            */

            window.location.href = "https://www.hamsanat.ir/";

        });

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
