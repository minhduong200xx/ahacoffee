for (let index = 1; index < 26; index++) {
  updateStatus(index);
}
var choiceTable = document.querySelectorAll(".tables button");
choiceTable.forEach(function (button, index) {
  button.addEventListener("click", function () {
    if (checkEmpty(index + 1)) {
      clearBillPopup();
      var tableNumber = document.querySelector(".table-number");
      tableNumber.innerHTML = choiceTable[index].innerHTML;
      togglePopup();
      toggleBillPopup();
    } else {
      getDataFromStorage(index + 1);
      toggleOrderedPopup();
    }
  });
});

var menuPopup = document.querySelector(".menu-popup");
var billPopup = document.querySelector(".bill-popup");
var iconClose = document.querySelector(".drink-list__header i");
var orderedPopup = document.querySelector(".ordered-table");
function togglePopup(e) {
  menuPopup.classList.toggle("hide");
}
function toggleBillPopup() {
  billPopup.classList.toggle("hide");
}
function toggleOrderedPopup() {
  orderedPopup.classList.toggle("hide");
}
iconClose.addEventListener("click", function () {
  toggleBillPopup();
  togglePopup();
});
var print = document.querySelector(".print");
print.addEventListener("click", function () {
  toggleBillPopup();
  togglePopup();
});
menuPopup.addEventListener("click", function (e) {
  if (e.target == e.currentTarget) {
    togglePopup();
  }
});
const choiceDrink = document.querySelectorAll(".item > h3");
choiceDrink.forEach(function (h3) {
  h3.addEventListener("click", function (e) {
    var currentItem = document.querySelectorAll(".bill-popup .desc");
    var currentQty = document.querySelectorAll(".bill-popup .qty");
    var item = e.target;
    var drink = item.parentElement;
    var name = drink.querySelector(".item-title").innerHTML;
    var price = drink.querySelector(".item-price").innerHTML;
    if (checkCurrent(name)) {
      billTotal();
    } else {
      addDrink(name, price);
    }
  });
});

function checkCurrent(name) {
  var currentItem = document.querySelectorAll(".bill-popup .desc");
  var currentQty = document.querySelectorAll(".bill-popup .qty p");
  for (let index = 0; index < currentItem.length; index++) {
    if (name === currentItem[index].innerHTML) {
      currentQty[index].innerHTML = parseInt(currentQty[index].innerHTML) + 1;
      return true;
    } else false;
  }
}

function addDrink(name, price) {
  var addtr = document.createElement("tr");
  var trContent =
    `<tr>
  <td class = "desc">` +
    name +
    `</td>
  <td class = "qty"><i class="fa-solid fa-minus"></i>
    <p >1</p><i class="fa-solid fa-plus"></i>
  </td>
  <td><p><span>` +
    price +
    `</span></p><sup>đ</sup></td>
  <td  class="delete"style="cursor: pointer;color:red">Delete</td>
</tr>`;
  addtr.innerHTML = trContent;
  var detail = document.querySelector(".bill-popup tbody");
  detail.append(addtr);
  increaseQty();
  decreaseQty();
  billTotal();
  deleteItem();
}
function billTotal() {
  var items = document.querySelectorAll("tbody tr");
  var totalAll = 0;
  for (let index = 0; index < items.length; index++) {
    var qty = items[index].querySelector(".qty p").innerHTML;
    var price = items[index].querySelector("p span").innerHTML;
    totalAll += qty * price * 1000;
  }
  var invoiceTotal = document.querySelector(".total span");
  invoiceTotal.innerHTML = totalAll.toLocaleString("de-DE");
}
function deleteItem() {
  var currentItems = document.querySelectorAll("tbody tr");
  for (let index = 0; index < currentItems.length; index++) {
    var deletes = document.querySelectorAll(".delete");
    deletes[index].addEventListener("click", function (e) {
      var itemDelete = e.target;
      var item = itemDelete.parentElement;
      item.remove();
      var currentTable = document.querySelector(
        ".bill-popup .table-number"
      ).innerHTML;
      billTotal();
    });
  }
}
function increaseQty(e) {
  var icon = document.querySelectorAll(".bill-popup .fa-plus");
  for (let index = 0; index < icon.length; index++) {
    icon[index].addEventListener("click", function (e) {
      var qtyValue = e.target.parentElement.querySelector("p");
      var qty = parseInt(qtyValue.innerHTML);
      qty++;
      if (icon.length > 1 && index < icon.length - 1) {
        qtyValue.innerHTML = qty - 1;
      } else qtyValue.innerHTML = qty;
      billTotal();
    });
  }
}

function decreaseQty() {
  var icon = document.querySelectorAll(".bill-popup .fa-minus");
  for (let index = 0; index < icon.length; index++) {
    icon[index].addEventListener("click", function (e) {
      var qtyValue = e.target.parentElement.querySelector("p");
      var qty = parseInt(qtyValue.innerHTML);
      qty--;
      if (qty <= 0) {
        e.currentTarget.parentElement.parentElement.remove();
      } else {
        if (icon.length > 1 && index < icon.length - 1) {
          qtyValue.innerHTML = qty + 1;
        } else qtyValue.innerHTML = qty;
      }
      billTotal();
    });
  }
}
function setTableData() {
  var currentItems = document.querySelectorAll(".bill-popup tbody tr");
  var id = document.querySelector(".bill-popup .table-number").innerHTML;
  var data = [];
  if (currentItems.length !== 0) {
    for (let index = 0; index < currentItems.length; index++) {
      var name =
        currentItems[index].querySelector(".bill-popup .desc").innerHTML;
      var qty =
        currentItems[index].querySelector(".bill-popup .qty p").innerHTML;
      var price =
        currentItems[index].querySelector(".bill-popup p span").innerHTML;
      var item = { name: name, qty: qty, price: price };
      data.push(item);
    }
    localStorage.setItem(id, JSON.stringify(data));
  }
  updateStatus(id);
}
function updateStatus(id) {
  if (checkEmpty(id)) {
    document.getElementById(`${id}`).style.backgroundColor = "green";
  } else document.getElementById(`${id}`).style.backgroundColor = "red";
}
function clearBillPopup() {
  var currentItems = document.querySelectorAll("tbody tr");
  for (let index = 0; index < currentItems.length; index++) {
    currentItems[index].remove();
  }
  billTotal();
}
function getDataFromStorage(index) {
  var data = JSON.parse(localStorage.getItem(index));
  var id = document.querySelector(".ordered-table .table-number");
  id.innerHTML = index;
  for (let i = 0; i < data.length; i++) {
    var name = data[i].name;
    var qty = data[i].qty;
    var price = data[i].price;
    var addtr = document.createElement("tr");
    var trContent =
      `<tr>
    <td class = "desc">` +
      name +
      `</td>
    <td class = "qty" >
      <p >` +
      qty +
      `</p>
    </td>
    <td><p><span>` +
      price +
      `</span></p><sup>đ</sup></td>
  </tr>`;
    addtr.innerHTML = trContent;
    var detail = document.querySelector(".ordered-table tbody");
    detail.append(addtr);
    var items = document.querySelectorAll(".ordered-table tbody tr");
    var totalAll = 0;
    for (let index = 0; index < items.length; index++) {
      var qty = items[index].querySelector(".ordered-table .qty p").innerHTML;
      var price = items[index].querySelector(".ordered-table p span").innerHTML;
      totalAll += qty * price * 1000;
    }
    var invoiceTotal = document.querySelector(".ordered-table .total span");
    invoiceTotal.innerHTML = totalAll.toLocaleString("de-DE");
  }
}

function checkEmpty(index) {
  var data = localStorage.getItem(index);
  if (data) return false;
  else return true;
}
function deleteData() {
  clearBillPopup();
  var currentTable = document.querySelector(
    ".ordered-table .table-number"
  ).innerHTML;
  localStorage.removeItem(currentTable);
  updateStatus(currentTable);
  toggleOrderedPopup();
}
var closeTable = document.querySelector(".ordered-table .fa-times");
closeTable.addEventListener("click", toggleOrderedPopup);
