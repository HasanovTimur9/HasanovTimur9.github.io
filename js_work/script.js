var getDiscount = function(age) {
    if (age <= 20) return 10;
    if (age >= 65) return 20;
    return 0;
};

var getItem = function(money) {
    if (money >= 300 && money <= 3000) return { name: "чайник", img: "teapot.jpg" };
    if (money >= 3001 && money <= 10000) return { name: "пылесос", img: "cleaner.jpg" };
    if (money > 10000) return { name: "холодильник", img: "fridge.jpg" };
    return null;
};

var showResult = function(age, money, item, discount) {
    const result = document.getElementById("result");
    const image = document.getElementById("image");

    if (!item) {
        result.innerHTML = `Недостаточно средств для покупки`;
        image.innerHTML = "";
        return;
    }

    result.innerHTML =
        `Возраст: ${age} лет<br>` +
        `Сумма: ${money} руб.<br>` +
        `Предмет: ${item.name}<br>` +
        `Скидка: ${discount}%`;

    image.innerHTML = `<img src="${item.img}" alt="${item.name}" width="200">`;
};

var main = function() {
    const age = document.getElementById("age").value;
    if (!age || age <= 0) return alert("Введите корректный возраст!");

    const money = prompt("Введите сумму денег на покупку:");
    if (!money || money <= 0) return alert("Введите корректную сумму!");

    const discount = getDiscount(age);
    const item = getItem(money);
    showResult(age, money, item, discount);
};

document.getElementById("btnChoose").addEventListener("click", main);