const loadBtn = document.getElementById("loadBtn");
const btn = document.querySelector(".btn");
const searchBox = document.querySelector(".search-box");
const searchInput = document.getElementById("searchInput");
const transactionPage = document.querySelector(".transaction-page");
const tbody = document.getElementById("transactionBody");

const sortPriceIcon = document.getElementById("sortPrice");
const sortDateIcon = document.getElementById("sortDate");

let currentSort = { field: null, order: "asc" };

loadBtn.addEventListener("click", () => {
  btn.classList.add("hidden");
  searchBox.classList.remove("hidden");
  transactionPage.classList.remove("hidden");
  fetchAndRenderData();
});

// جستجو بر اساس refId
searchInput.addEventListener("input", () => {
  fetchAndRenderData(searchInput.value.trim());
});

// مرتب‌سازی براساس قیمت
sortPriceIcon.addEventListener("click", () => {
  toggleSort("price", sortPriceIcon);
});

// مرتب‌سازی براساس تاریخ
sortDateIcon.addEventListener("click", () => {
  toggleSort("date", sortDateIcon);
});

function toggleSort(field, icon) {
  sortPriceIcon.classList.remove("up");
  sortPriceIcon.classList.add("down");
  sortDateIcon.classList.remove("up");
  sortDateIcon.classList.add("down");

  currentSort.order =
    currentSort.field === field && currentSort.order === "asc" ? "desc" : "asc";
  currentSort.field = field;

  if (currentSort.order === "asc") {
    icon.classList.remove("down");
    icon.classList.add("up");
  } else {
    icon.classList.remove("up");
    icon.classList.add("down");
  }

  fetchAndRenderData(searchInput.value.trim());
}
function fetchAndRenderData(search = "") {
  let url = "http://localhost:3000/transactions";
  const params = [];
  if (search) params.push(`refId_like=${search}`);
  if (currentSort.field)
    params.push(`_sort=${currentSort.field}&_order=${currentSort.order}`);
  if (params.length > 0) url += "?" + params.join("&");

  fetch(url)
    .then((res) => res.json())
    .then((data) => renderTable(data))
    .catch((err) => console.error("خطا در دریافت داده‌ها:", err));
}
function renderTable(data) {
  tbody.innerHTML = "";
  data.forEach((item, index) => {
    const tr = document.createElement("tr");
    const typeColor = item.type.includes("افزایش") ? "green" : "red";
    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleString("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td class="${typeColor}">${item.type}</td>
      <td class="color-800">${item.price.toLocaleString()}</td>
      <td>${item.refId}</td>
      <td class="color-800">${formattedDate}</td>
    `;
    tbody.appendChild(tr);
  });
}
