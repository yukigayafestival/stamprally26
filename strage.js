const STORAGE_KEY = "stamp_rally_stamps";

// スタンプを保存
function saveStamp(stampId) {
    const stamps = getStamps();

    if (!stamps.includes(stampId)) {
        stamps.push(stampId);
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(stamps)
    );
}

// スタンプ一覧を取得
function getStamps() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

// スタンプを持っているか
function hasStamp(stampId) {
    return getStamps().includes(stampId);
}