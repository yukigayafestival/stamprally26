// =========================
// スタンプのデータ
// =========================

const stamps = [
    {
        id: "https://yukigayasai2026/scan/1",
        name: "1"
    },
    {
        id: 2,
        name: "2"
    },
    {
        id: 3,
        name: "3"
    },
    {
        id: 4,
        name: "4"
    },
    {
        id: 5,
        name: "5"
    },
    {
        id: 5,
        name: "6"
    }
];


// =========================
// localStorageから獲得状況を読み込む
// =========================

let collectedStamps =
    JSON.parse(localStorage.getItem("collectedStamps")) || [];


// =========================
// HTMLの要素を取得
// =========================

const stampList =
    document.getElementById("stamp-list");

const resetButton =
    document.getElementById("reset-button");

const scanQrButton =
    document.getElementById("scan-qr-button");

const qrReader =
    document.getElementById("qr-reader");

const stopQrButton =
    document.getElementById("stop-qr-button");


// =========================
// QRコード読み取り用
// =========================

let html5QrCode = null;


// =========================
// スタンプを画面に表示する
// =========================

function displayStamps() {

    stampList.innerHTML = "";


    stamps.forEach(function(stamp) {

        // 獲得済みか確認
        const isCollected =
            collectedStamps.includes(stamp.id);


        // カードを作成
        const stampCard =
            document.createElement("div");

        stampCard.classList.add("stamp-card");


        // 獲得済みならクラスを追加
        if (isCollected) {

            stampCard.classList.add("collected");

        }


        // スタンプ名
        const stampName =
            document.createElement("div");

        stampName.classList.add("stamp-name");

        stampName.textContent = stamp.name;


        // スタンプ状況
        const stampStatus =
            document.createElement("div");

        stampStatus.classList.add("stamp-status");


        if (isCollected) {

            stampStatus.textContent = "1 / 1";

        } else {

            stampStatus.textContent = "0 / 1";

        }


        // カードに追加
        stampCard.appendChild(stampName);

        stampCard.appendChild(stampStatus);


        // 一覧に追加
        stampList.appendChild(stampCard);

    });
}


// =========================
// スタンプを獲得する
// =========================

function collectStamp(stampId) {

    


    // 存在するスタンプか確認
    const stamp =
        stamps.find(function(stamp) {

            return stamp.id === stampId;

        });


    if (!stamp) {

        showMessage("存在しないスタンプです。");

        return;

    }


    // すでに獲得しているか確認
    if (collectedStamps.includes(stampId)) {

        showMessage(
            `${stamp.name}はすでに獲得しています。`
        );

        return;

    }


    // スタンプを追加
    collectedStamps.push(stampId);


    // localStorageに保存
    localStorage.setItem(
        "collectedStamps",
        JSON.stringify(collectedStamps)
    );


    // 画面を更新
    displayStamps();


    // メッセージ
    showMessage(
        `${stamp.name}のスタンプを獲得しました！`
    );
}


// =========================
// メッセージ表示
// =========================

function showMessage(message) {

    const messageSection =
        document.getElementById("message-section");

    const messageText =
        document.getElementById("message-text");


    messageText.textContent = message;

    messageSection.hidden = false;

}


// =========================
// QRコード読み取り開始
// =========================

scanQrButton.addEventListener("click", function() {

    // QRリーダーを表示
    qrReader.hidden = false;

    // 読み取り終了ボタンを表示
    stopQrButton.hidden = false;

    // QRコード読み取りを作成
    html5QrCode =
        new Html5Qrcode("qr-reader");


    // カメラを開始
    html5QrCode.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,
            qrbox: {
                width: 250,
                height: 250
            }
        },

        function(decodedText) {

            // QRコードから読み取った文字
            console.log(
                "QRコード:",
                decodedText
            );


            // スタンプIDとして扱う
            collectStamp(decodedText);


            // 読み取りを終了
            stopQrScanner();

        },

        function(errorMessage) {

            // QRコードが見つからない場合
            // 基本的には何もしない

        }

    ).catch(function(error) {

        console.error(
            "カメラを起動できませんでした:",
            error
        );

        showMessage(
            "カメラを起動できませんでした。カメラの使用を許可してください。"
        );

        stopQrScanner();

    });

});


// =========================
// QRコード読み取り終了
// =========================

stopQrButton.addEventListener(
    "click",
    function() {

        stopQrScanner();

    }
);


// =========================
// QRスキャナーを停止
// =========================

function stopQrScanner() {

    if (html5QrCode) {

        html5QrCode.stop()
            .then(function() {

                html5QrCode.clear();

                html5QrCode = null;

            })
            .catch(function(error) {

                console.error(
                    "QRスキャナー停止エラー:",
                    error
                );

                html5QrCode = null;

            });

    }


    // QR画面を隠す
    qrReader.hidden = true;

    // 終了ボタンを隠す
    stopQrButton.hidden = true;

}


// =========================
// リセット
// =========================

resetButton.addEventListener(
    "click",
    function() {

        collectedStamps = [];


        // localStorageから削除
        localStorage.removeItem(
            "collectedStamps"
        );


        // 画面を更新
        displayStamps();


        showMessage(
            "スタンプをリセットしました。"
        );

    }
);
// =========================
// URLからスタンプIDを取得
// =========================

function checkStampUrl() {

    const stampId = window.location.href;
collectStamp(stampId);


   

}
checkStampUrl();

// =========================
// 最初にスタンプを表示
// =========================

displayStamps();