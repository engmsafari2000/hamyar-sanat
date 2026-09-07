const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbySCRuX3dm0i6brTkRfJUSJnqhJCIbQ0fJ4olWrQA97M5oTr-yQXhboJZylinQxto2g5Q/exec";

const activitySelect =
    document.getElementById("activity");

const dynamicFields =
    document.getElementById("dynamicFields");

const form =
    document.getElementById("serviceForm");

const WebApp = window.Eitaa?.WebApp;

// =====================================
// Eitaa Back Button
// =====================================

const backButton = WebApp?.BackButton;

function goBack() {
    window.history.back();
}

if (backButton) {
    backButton.show();
    backButton.onClick(goBack);
}

// =====================================
// Get Eitaa Phone Number
// =====================================
let eitaaPhone = null;

if (WebApp) {
    WebApp.requestContact((isOk, data) => {

        if (isOk && data.response) {

            const params = new URLSearchParams(data.response);

            const contactJSON = params.get("contact");

            if (contactJSON) {
                const contact = JSON.parse(
                    decodeURIComponent(contactJSON)
                );

                eitaaPhone = contact.phone;

                console.log("Eitaa phone:", eitaaPhone);
            }

        } else {
            console.log("User did not share phone number.");
        }

    });
}

eitaaPhone = contact.phone;

// =====================================
// Modal Elements
// =====================================

const messageModal =
    document.getElementById("messageModal");

const modalIcon =
    document.getElementById("modalIcon");

const modalTitle =
    document.getElementById("modalTitle");

const modalMessage =
    document.getElementById("modalMessage");

const modalCloseBtn =
    document.getElementById("modalCloseBtn");





// =====================================
// Show Modal Function
// =====================================

function showModal(type, title, message) {

    // حذف کلاس‌های قبلی
    messageModal.classList.remove(
        "warning",
        "success"
    );

    // اضافه کردن نوع پیام
    messageModal.classList.add(
        type
    );

    // تعیین آیکون
    if (type === "warning") {

        modalIcon.textContent = "!";
    }

    else if (type === "success") {

        modalIcon.textContent = "✓";
    }

    // عنوان
    modalTitle.textContent = title;

    // متن
    modalMessage.textContent = message;

    // نمایش
    messageModal.classList.add(
        "show"
    );
}


// =====================================
// Close Modal
// =====================================

modalCloseBtn.addEventListener(
    "click",
    function () {

        messageModal.classList.remove(
            "show"
        );

    }
);


// بستن Modal با کلیک بیرون آن

messageModal.addEventListener(
    "click",
    function (event) {

        if (event.target === messageModal) {

            messageModal.classList.remove(
                "show"
            );
        }

    }
);


// =====================================
// Dynamic Fields
// =====================================

activitySelect.addEventListener(
    "change",
    function () {

        dynamicFields.innerHTML = "";


        // ==========================
        // تراش و فرز
        // ==========================

        if (this.value === "machining") {

            dynamicFields.innerHTML = `

                <h3 class="dynamic-title">
                    اطلاعات تجهیزات
                </h3>





                <div class="form-group">

                    <label>
                        نوع دستگاه
                    </label>


                    <div class="radio-group">

                        <label class="radio-item">

                            <input
                                type="radio"
                                name="machineType"
                                value="lathe"
                            >

                            تراش

                        </label>


                        <label class="radio-item">

                            <input
                                type="radio"
                                name="machineType"
                                value="milling"
                            >

                            فرز

                        </label>

                    </div>

                </div>


                <div class="form-group">

                    <label for="axisCount">
                        تعداد محور
                    </label>

                    <input
                        type="number"
                        id="axisCount"
                        name="axisCount"
                        min="1"
                        placeholder="مثلاً 3"
                    >

                </div>


                <div class="form-group">

                    <label for="machineSize">
                        ابعاد دستگاه
                    </label>

                    <input
                        type="text"
                        id="machineSize"
                        name="machineSize"
                        placeholder="مثلاً 1000×500×500"
                    >

                </div>




            `;
        }


    }
);


// =====================================
// Submit Form
// =====================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // بررسی فیلدهای ضروری

        if (!form.checkValidity()) {

            showModal(
                "warning",
                "اطلاعات ناقص است",
                "لطفاً تمام فیلدهای ضروری (*) را تکمیل کنید."
            );

            return;
        }


        // ===============================
        // دریافت اطلاعات فرم
        // ===============================

        const formData =
        new FormData(form);

        const data =
        Object.fromEntries(
        formData.entries()
        );

    // افزودن شماره Eitaa به اطلاعات ارسالی
    data.eitaaPhone = eitaaPhone;

        console.log(
            "اطلاعات ارسال شده:",
            data
        );


        try {

            // ===============================
            // ارسال اطلاعات به Google Sheet
            // ===============================

            await fetch(
                GOOGLE_SCRIPT_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(data)

                }
            );


            // ===============================
            // بررسی زمینه فعالیت
            // ===============================

            const selectedActivity =
                activitySelect.value;


            // حالت سوم:
            // تراش و فرز

            if (
                selectedActivity === "machining"
            ) {

                showModal(
                    "success",
                    "ثبت موفق",
                    "اطلاعات شما با موفقیت ثبت گردید. اطلاعات این بخش به مدت یک هفته به خدمات‌گیرندگان ارجاع داده می‌شود."
                );

            }


            // حالت دوم:
            // سایر خدمات

            else {

                showModal(
                    "success",
                    "ثبت موفق",
                    "اطلاعات شما با موفقیت ثبت شد. اطلاعات شما بعد از تأیید پشتیبانی در بانک اطلاعات اصناف قرار خواهد گرفت."
                );

            }


            // پاک کردن فرم پس از ثبت

            form.reset();

            dynamicFields.innerHTML = "";

        }


        catch (error) {

            console.error(error);


            showModal(
                "warning",
                "خطا در ثبت اطلاعات",
                "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید."
            );

        }

    }
);
