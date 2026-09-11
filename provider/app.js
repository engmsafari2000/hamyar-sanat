const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbySCRuX3dm0i6brTkRfJUSJnqhJCIbQ0fJ4olWrQA97M5oTr-yQXhboJZylinQxto2g5Q/exec";

// آدرس Webhook مربوط به n8n برای دریافت عکس
// این مقدار را با آدرس واقعی Webhook خودتان جایگزین کنید
const N8N_WEBHOOK_URL =
    "https://rasoul2000.app.n8n.cloud/webhook-test/service-image";

// یک توکن ساده برای جلوگیری از سوءاستفاده از Webhook عمومی
// (باید دقیقاً همین مقدار در n8n هم چک شود)
const N8N_WEBHOOK_TOKEN = "MySecret123456";

// حداکثر حجم مجاز عکس (بایت) - اینجا ۵ مگابایت
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const activitySelect =
    document.getElementById("activity");

const dynamicFields =
    document.getElementById("dynamicFields");

const form =
    document.getElementById("serviceForm");

const serviceImageInput =
    document.getElementById("serviceImage");

const submitButton =
    document.querySelector(".submit-button");

const submitBtnText =
    document.getElementById("submitBtnText");

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
// Generate Submission ID
// =====================================
// این شناسه در ردیف گوگل شیت و در پیلود عکس ارسالی
// به n8n هر دو ثبت می‌شود تا بعداً بشود آن‌ها را به هم مرتبط کرد

function generateSubmissionId() {

    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }

    // fallback برای مرورگرهای قدیمی‌تر
    return (
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 10)
    );
}


// =====================================
// Upload Image To n8n Webhook
// =====================================

async function uploadImageToN8n(file, submissionId) {

    const imageFormData = new FormData();

    imageFormData.append(
        "submissionId",
        submissionId
    );

    imageFormData.append(
        "token",
        N8N_WEBHOOK_TOKEN
    );

    imageFormData.append(
        "image",
        file,
        file.name
    );

    const response = await fetch(
        N8N_WEBHOOK_URL,
        {
            method: "POST",
            body: imageFormData
            // توجه: هدر Content-Type را دستی ست نکنید،
            // مرورگر خودش boundary مناسب multipart را اضافه می‌کند
        }
    );

    if (!response.ok) {

        throw new Error(
            "n8n webhook responded with status " +
            response.status
        );
    }

    return response;
}


// =====================================
// Toggle Submit Button Loading State
// =====================================

function setSubmitLoading(isLoading) {

    submitButton.disabled = isLoading;

    submitBtnText.textContent = isLoading
        ? "در حال ارسال..."
        : "ثبت اطلاعات";
}


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
        // بررسی فایل عکس (در صورت انتخاب)
        // ===============================

        const imageFile =
            serviceImageInput?.files?.[0] || null;

        if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {

            showModal(
                "warning",
                "حجم فایل زیاد است",
                "حجم تصویر باید کمتر از ۵ مگابایت باشد."
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

        // شناسه یکتا برای اتصال ردیف گوگل شیت به عکس ارسالی در n8n
        const submissionId = generateSubmissionId();
        data.submissionId = submissionId;

        // این فیلد فقط برای FormData لازم بود، در دیتای متنی نیازی نیست
        delete data.serviceImage;

    // افزودن شماره Eitaa به اطلاعات ارسالی
    data.eitaaPhone = eitaaPhone;

        console.log(
            "اطلاعات ارسال شده:",
            data
        );


        setSubmitLoading(true);


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

console.log("اطلاعات ارسال شده:", data)
            // ===============================
            // ارسال عکس به n8n (در صورت وجود)
            // ===============================

            let imageUploadFailed = false;

            if (imageFile) {

                try {

                    await uploadImageToN8n(
                        imageFile,
                        submissionId
                    );

                }

                catch (imageError) {

                    console.error(
                        "خطا در ارسال عکس به n8n:",
                        imageError
                    );

                    imageUploadFailed = true;
                }
            }


            // ===============================
            // بررسی زمینه فعالیت
            // ===============================

            const selectedActivity =
                activitySelect.value;


            if (imageUploadFailed) {

                // اطلاعات فرم ثبت شد ولی عکس ارسال نشد
                showModal(
                    "warning",
                    "ثبت ناقص",
                    "اطلاعات فرم با موفقیت ثبت شد، اما ارسال تصویر با خطا مواجه شد. لطفاً بعداً دوباره تصویر را ارسال کنید."
                );

            }


            // حالت سوم:
            // تراش و فرز

            else if (
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


            // پاک کردن فرم پس از ثبت (فقط در صورت موفقیت کامل)

            if (!imageUploadFailed) {

                form.reset();

                dynamicFields.innerHTML = "";
            }

        }


        catch (error) {

            console.error(error);


            showModal(
                "warning",
                "خطا در ثبت اطلاعات",
                "ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید."
            );

        }

        finally {

            setSubmitLoading(false);
        }

    }
);
