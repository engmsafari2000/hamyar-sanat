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
    ================================= */

    const providerBtn =
        document.getElementById("providerBtn");

   providerBtn.addEventListener("click", function () {


    console.log("Provider selected");


    // لرزش کوتاه ایتا
    if(window.Eitaa && Eitaa.WebApp){

        Eitaa.WebApp.HapticFeedback
        .impactOccurred("light");


        // درخواست شماره تلفن فقط برای خدمات دهنده

        Eitaa.WebApp.requestContact(
            function(status){


                console.log(
                    "Contact status:",
                    status
                );


                /*
                  اگر کاربر اجازه داد
                  وارد بخش خدمات دهنده شود
                */

                if(status === "sent"){


                    window.location.href =
                    "provider/index.html";

                }
                else{


                  window.location.href = "provider/index.html";


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
