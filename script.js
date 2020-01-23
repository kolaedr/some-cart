let cartList = document.querySelector('.item-cart-list');
const main = document.querySelector('.main');
const totalAmountElem = document.querySelector('.total-amount');
let count = 1;

main.addEventListener('click', (e) => {
    e.preventDefault();
    createCartList(e);
    if (e.target.classList.contains('delete')) {
        let s = JSON.parse(localStorage.getItem('user-id'));
        if (e.target.parentNode.children[0].getAttribute('data-id') === s['cart' + e.target.parentNode.children[0].getAttribute('data-id')].item) {
            e.target.parentNode.remove();

            userCartCreat();
        }
        updateTotalAmount();
    }
    console.log(e.target.innerHTML)

    if(e.target.classList.contains('countinput')){
        console.log(e.target.previousElementSibling)
        e.target.setAttribute('value', e.target.value);
        e.target.previousElementSibling.setAttribute('data-count', e.target.value);
        updateTotalAmount();
    }
});

window.addEventListener('load', () => {
    updateUserCart();
});


function createCartList(e) {
    if (e.target.classList.contains('add-cart')) {

        let itemPrice = e.target.parentNode.children[3].getAttribute('data-price');
        let itemName = e.target.parentNode.children[0].innerHTML;
        let itemId = e.target.parentNode.getAttribute('data-id');
        let cartListLi = document.querySelectorAll('.item-cart-list li');

        if (cartListLi.length == 0 || checkCart(itemId, cartListLi)) {
            const elem = document.createElement('LI');
            elem.innerHTML = `
            <span class="goods" data-id="${itemId}"  data-count="${count}" data-price="${itemPrice}">${itemName}</span> 
            <input type="number" name="xx" class="countinput" value="${count}" min="0">
            <label for="xx"> шт.</label>
            <span class="price-item-cart">${itemPrice} uhy.</span>
            <span class="fas delete">&#xf00d;</span>`;
            cartList.appendChild(elem);
            userCartCreat();
            updateTotalAmount();
        }
        else {
            for (const el of cartListLi) {
                if (el.children[0].getAttribute('data-id') === itemId) {
                    count = el.children[0].getAttribute('data-count');
                    ++count;
                    el.children[0].setAttribute('data-count', count);
                    el.children[1].setAttribute('value', count);
                    userCartCreat();
                    count = 1;
                    updateTotalAmount();
                }
            }
        }
    }
}

function updateTotalAmount(){
    let totalAmount=0;
    cartListLi = document.querySelectorAll('.item-cart-list li');
    for (const el of cartListLi) {
        totalAmount += el.children[0].getAttribute('data-price')*el.children[0].getAttribute('data-count');
    }
    totalAmountElem.innerHTML = totalAmount;
}

function checkCart(itemId, cartListLi) {
    for (const el of cartListLi) {
        if (el.children[0].getAttribute('data-id') == itemId) {
            return false;
        }
    }
    return true;
}

function userCartCreat() {
    localStorage.removeItem('user-id');
    let cartListLi = document.querySelectorAll('.item-cart-list li');
    let userCartStart = {};
    cartListLi.forEach(function (element) {

        let userCart = {
            item: element.children[0].getAttribute('data-id'),
            itemname: element.children[0].innerHTML,
            itemprice: element.children[0].getAttribute('data-price'),
            count: element.children[0].getAttribute('data-count')
        };
        userCartStart['cart' + element.children[0].getAttribute('data-id')] = userCart;
        z = JSON.stringify(userCartStart);
        sendJson(z);
    });

    function sendJson(z) {
        localStorage.setItem('user-id', z);

    }
}
function updateUserCart() {
    const s = JSON.parse(localStorage.getItem('user-id'));
    for (let key in s) {
        const elem = document.createElement('LI');
        elem.innerHTML = `
        <span class="goods" data-id="${s[key].item}" data-count="${s[key].count}" data-price="${s[key].itemprice}">${s[key].itemname}</span> 
        <input type="number" name="" id="" value="${s[key].count}"> шт.
        <span class="price-item-cart">${s[key].itemprice} грн.</span>
        <span class="fas delete">&#xf00d;</span>`;
        cartList.appendChild(elem);
        
    }
    updateTotalAmount();
}