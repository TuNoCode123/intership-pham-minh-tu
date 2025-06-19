let BASE_URL_EMBED = "https://shopoftu2.myshopify.com";
const API = {
  CREATE_REDEEM: `${BASE_URL_EMBED}/apps/app/api/redeem`,
  HISTORY_COUPON: `https://${BASE_URL_EMBED}/apps/app/api/redeemed_code`,
};
let shopId;
let currentPoint = 0;
const openModalBtn = document.getElementById("open-embed-modal-btn");
const closeModalBtn = document.getElementById("close-embed-modal-btn");
const modalOverlay = document.getElementById("my-app-modal-overlay");
const pointItemsList = document.getElementById("point-items-list");
const currentPointsElement = document.getElementById("current-points");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const retryBtn = document.getElementById("retry-btn");
const spinner = document.getElementById("fullscreenSpinner");
const container = document.getElementById("voucherContainer");
const userPoint = document.getElementById("user-points");
const userRanking = document.getElementById("user-ranking");
const userSpent = document.getElementById("user-spent");
const pagination = document.getElementsByClassName(
  "pagination cursor-pagination",
);
const previousButton = document.getElementsByClassName(
  "pagination-item pagination-prev",
);
const nextButton = document.getElementsByClassName(
  "pagination-item pagination-next",
);
const paginationPages = document.getElementsByClassName("pagination-pages");
const selectedFilter = document.getElementById("country-select");
const selectedCondition = document.getElementById("country-select-condition");
const statsGrid = document.getElementById("statsGrid");

let curreentPage = 1;
let currentValueSelected = "";
let skip = 0;
let isOrderBy = false;
let LIMIT = 10;
paginationPages[0].innerHTML = curreentPage;

function createStatCard(label, value, iconClass, isTotal = false) {
  const card = document.createElement("div");
  card.className = `stat-card ${isTotal ? "total-card" : ""}`;

  card.innerHTML = `
                <i class="${iconClass}" style="font-size: 24px;"></i>
                <div class="stat-value">${value}</div>
                <div class="stat-label">${label}</div>
            `;

  return card;
}
nextButton &&
  nextButton.length > 0 &&
  nextButton[0].addEventListener("click", () => {
    if (isOrderBy && currentValueSelected) {
      skip += LIMIT;
      fetchHistoryCoupon({
        customerId: userId,
        limit: LIMIT,
        typeCursor: "after",
        orderBy: currentValueSelected,
        skip,
      });
    } else {
      fetchHistoryCoupon({
        customerId: userId,
        limit: 10,
        typeCursor: "after",
        lastId: cursor.nextId,
      });
    }
    curreentPage++;
    paginationPages[0].innerHTML = curreentPage;
  });

previousButton &&
  previousButton.length > 0 &&
  previousButton[0].addEventListener("click", () => {
    if (isOrderBy && currentValueSelected) {
      skip -= LIMIT;
      fetchHistoryCoupon({
        customerId: userId,
        limit: LIMIT,
        typeCursor: "before",
        orderBy: currentValueSelected,
        skip,
      });
    } else {
      fetchHistoryCoupon({
        customerId: userId,
        limit: 10,
        typeCursor: "before",
        lastId: cursor.previousId,
      });
    }

    curreentPage--;
    paginationPages[0].innerHTML = curreentPage;
  });

let isRedeem = false;
let isFirstTime = true;
let cursor = undefined;
const modalRedeemTitle = document.getElementsByClassName(
  "modal-history-title redeem",
);
const historyCouponLink = document.getElementsByClassName(
  "modal-history-title",
);
const contentRedeem = document.getElementById("content-redeem");
const contentHistory = document.getElementById("content-history");

let userId = 0;
historyCouponLink &&
  historyCouponLink.length > 0 &&
  historyCouponLink[0].addEventListener("click", () => {
    showContentHistory();
    if (isRedeem || isFirstTime) {
      fetchHistoryCoupon({
        customerId: userId,
        limit: 10,
        typeCursor: "after",
      });
      isFirstTime = false;
      isRedeem = false;
      return;
    }
    pagination[0].style.display = "flex";
  });
modalRedeemTitle &&
  modalRedeemTitle.length > 0 &&
  modalRedeemTitle[0].addEventListener("click", () => {
    showContentRedeem();
  });

selectedFilter.addEventListener("change", function () {
  skip = 0;
  const clause = {};
  if (currentConditionSelect) {
    clause.group = currentConditionSelect;
  }
  fetchHistoryCoupon({
    customerId: userId,
    limit: 10,
    typeCursor: "after",
    orderBy: this.value,
    skip: 0,
    ...clause,
  });

  currentValueSelected = this.value;
  curreentPage = 1;
  paginationPages[0].innerHTML = curreentPage;
  if (this.value === "none") {
    isOrderBy = false;
    return;
  }
  isOrderBy = true;
});
let currentConditionSelect;
let isCondition;
selectedCondition.addEventListener("change", function () {
  skip = 0;
  let clause = {};
  if (currentValueSelected) {
    clause.orderBy = currentValueSelected;
  }
  fetchHistoryCoupon({
    customerId: userId,
    limit: 10,
    typeCursor: "after",
    group: this.value,
    skip: 0,
    ...currentValueSelected,
  });

  currentConditionSelect = this.value;
  curreentPage = 1;
  paginationPages[0].innerHTML = curreentPage;
  if (this.value === "none") {
    isCondition = false;
    return;
  }
  isCondition = true;
});
function showContentRedeem() {
  contentRedeem.style.display = "block";
  contentHistory.style.display = "none";
}
function showContentHistory() {
  contentRedeem.style.display = "none";
  contentHistory.style.display = "block";
  // pagination[0].style.display = "none";
  // console.log("History fetched successfully");
}
function showLoading() {
  spinner.style.display = "flex";
}

function hideLoading() {
  spinner.style.display = "none";
}

function openModal(info) {
  modalOverlay.style.display = "block";
  document.body.style.overflow = "hidden";
  document.getElementById("open-embed-modal-btn")?.classList.add("hidden");
  initModal(info).then(() => fetchPointData(currentPoint));
  // initModal(info);
  // fetchPointData(currentPoint);
  // fetchPointData(currentPoint);
}
function formatVND(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}
function closeModal() {
  document.getElementById("open-embed-modal-btn")?.classList.remove("hidden");
  modalOverlay.style.display = "none";
  document.body.style.overflow = "auto";
}
const userPointReady = document.getElementById("user-point-ready");
async function initModal(infor) {
  userPoint.style.display = "block";
  userPointReady.style.display = "none";
  showLoadingState();
  if (infor.id && infor.domain) {
    const url = `https://${infor.domain}/apps/app/api/loyal/me/${infor.id}?shopId=${shopId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      showErrorState("error ");
      return;
    }
    const data = await res.json();
    if (data.EC !== 0) {
      showErrorState(data.EM);
      return;
    }
    currentPoint = data.DT.totalPoints ?? 0;

    const tierName = data?.DT?.rank?.tierName ?? "";
    const pointRate = data?.DT?.rank?.pointRate ?? 0;
    const pointsPer100k = Math.ceil(100000 * pointRate);
    const totalSpent = data?.DT?.totalSpent ?? 0;
    const nextTierName = data?.DT?.greaterRank?.tierName ?? "";
    const nextTierMinSpent = data?.DT?.greaterRank?.min_spent ?? 0;
    const pointRateNext = data?.DT?.greaterRank?.pointRate ?? 0;
    const pointsNextPer100k = Math.ceil(100000 * pointRateNext);
    const remaining =
      nextTierMinSpent > totalSpent ? nextTierMinSpent - totalSpent : 0;

    userRanking.innerHTML = `
  <strong style="font-size: 16px; color: #ffa500;">
    Hạng hiện tại: ${tierName}
  </strong>
  <br/>
  <span style="font-size: 14px; color: #333;">
    Với mỗi đơn hàng trị giá <strong>100.000đ</strong>, bạn nhận được 
    <span style="color: #007bff; font-weight: bold;">
      ${pointsPer100k} điểm
    </span>.
  </span>
  <br/>
  ${
    nextTierName && remaining > 0
      ? `
    <span style="font-size: 14px; color: #555;">
      Hãy tiêu thêm <strong style="color: green;">${remaining.toLocaleString()}đ</strong> để lên hạng 
      <strong style="color: #9933ff;">${nextTierName}</strong>!
    </span>
    <br/>
  <span style="font-size: 14px; color: #333;">
    Với lợi ích là mỗi đơn hàng trị giá <strong>100.000đ</strong>, bạn nhận được 
    <span style="color: #007bff; font-weight: bold;">
      ${pointsNextPer100k} điểm
    </span>.
  </span>
  `
      : ""
  }
`;

    userSpent.textContent = formatVND(data?.DT?.totalSpent);
    currentPointsElement.textContent = currentPoint.toLocaleString();
    userPoint.style.display = "none";
    userPointReady.style.display = "block";
  }
  document.getElementById("user-name").textContent = infor.name;
  document.getElementById("user-id").textContent = infor.id;
  retryBtn.addEventListener("click", () => fetchPointData(currentPoint));

  // Đóng modal khi click bên ngoài
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}
function fetchPointData() {
  // if (currentPoint == 0) {
  //   return;
  // }
  // loading
  // showLoadingState();

  const url = `https://${BASE_URL_EMBED}/apps/app/api/all-point-spend?shopId=${shopId}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.EC == 0) {
        renderPointList(data.DT);
        hideLoadingState();
      } else {
        showErrorState(data.EM);
      }
    })
    .catch((error) => {
      console.error("Error fetching point data:", error);
      showErrorState(error.message);
    });
}
function showLoadingStateHistory() {
  loadingState.style.display = "block";
  errorState.style.display = "none";
  container.style.display = "none";
  statsGrid.style.display = "none";
  // selectedFilter.style.display = "none";
  pagination[0].style.display = "none";
}
function hideLoadingStateHistory() {
  loadingState.style.display = "none";
  container.style.display = "grid";
  statsGrid.style.display = "grid";
  // selectedFilter.style.display = "block";
  pagination[0].style.display = "flex";
}
function showLoadingState() {
  loadingState.style.display = "block";
  errorState.style.display = "none";
  pointItemsList.style.display = "none";
  // container.style.display = "none";
}
function hideLoadingState() {
  loadingState.style.display = "none";
  pointItemsList.style.display = "block";
}

function showErrorState(message) {
  showToastError(message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.");
  loadingState.style.display = "none";
  errorState.style.display = "block";
  pointItemsList.style.display = "none";
}
function showToastSuccess(message) {
  Toastify({
    text: message,
    duration: 4000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
  }).showToast();
}
function showToastError(message) {
  Toastify({
    text: message,
    duration: 4000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "#f87171", // màu đỏ nhạt
    stopOnFocus: true,
  }).showToast();
}
function renderPointList(pointsData) {
  pointItemsList.innerHTML = "";

  pointsData.forEach((point) => {
    const { pointNumber, moneyAmount } = point;

    const item = document.createElement("div");
    item.className = "point-item";

    const label = document.createElement("div");
    label.className = "point-label";
    label.textContent = `${pointNumber.toLocaleString()} điểm`;

    const value = document.createElement("div");
    value.className = "point-value";
    value.textContent = `${moneyAmount.toLocaleString("vi-VN")} đ`;

    const button = document.createElement("button");
    button.className = "point-button";
    button.textContent = "Đổi ngay";
    button.disabled = currentPoint < pointNumber;
    button.addEventListener("click", () => {
      valueDivInput.style.display = "flex";
      button.style.display = "none";
    });

    const valueDivInput = document.createElement("div");
    valueDivInput.className = "input-number-group";
    // valueDivInput.style.display = "none"; // ẩn input và button xác nhận ban đầu
    const input = document.createElement("input");
    input.className = "input-number";
    input.type = "number";
    input.value = 1;
    input.min = 1;
    input.placeholder = "Nhập số lần";
    input.addEventListener("change", (e) => {
      const numberOfRedeem = parseInt(e.target.value, 10);

      if (+pointNumber * numberOfRedeem > +currentPoint) {
        input.value = numberOfRedeem - 1;
        showToastError(`Bạn không đủ điểm để đổi phần thưởng này!.`);

        // alert("Bạn không đủ điểm để đổi phần thưởng này.");
        return;
      }
    });

    const buttonRedeem = document.createElement("button");
    buttonRedeem.className = "confirm-btn";
    buttonRedeem.textContent = "Xác nhận";
    buttonRedeem.addEventListener("click", () => {
      Swal.fire({
        title: "Thông báo!",
        text: `Bạn có chắc chắn muốn đổi ${input.value * pointNumber} point để lấy mã giảm giá ${(moneyAmount * input.value).toLocaleString("vi-VN")} VND không?`,
        icon: "warning",
        confirmButtonText: "Ok, đổi ngay!",
        confirmButtonColor: "#ff0000",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        background: "#f0f0f0",
        // color: "#fff",
        customClass: {
          confirmButton: "delete-btn",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          showLoading();
          const url = API.CREATE_REDEEM;
          const data = {
            customerId: userId,
            amount: moneyAmount * input.value,
            point_used: input.value * pointNumber,
            exchangeId: point.id,
            typeKey: "L2",
          };
          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              ...data,
              shopId: shopId + "",
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.EC === 0) {
                hideLoading();
                // input.value = 1;
                valueDivInput.style.display = "none";
                button.style.display = "block";
                Swal.fire({
                  title: "Thông báo!",
                  html: `Đổi <strong>${input.value * pointNumber} điểm</strong> thành công!<br>
         Nhận được mã giảm giá <strong style="font-weight: bold; color: #d33;">${data.DT.code}</strong><span class="copy-text">(Copy)</span> trị giá 
         <strong>${data.DT.amount.toLocaleString("vi-VN")} VND</strong>`,
                  icon: "success",
                });
                document
                  .querySelector(".copy-text")
                  .addEventListener("click", function () {
                    navigator.clipboard.writeText(data.DT.code);
                    showToastSuccess("Đã sao chép mã voucher: " + data.DT.code);
                    this.textContent = "(Copied!)";
                    setTimeout(() => (this.textContent = "(Copy)"), 2000);
                  });
                currentPoint = currentPoint - input.value * pointNumber;
                currentPointsElement.textContent =
                  currentPoint.toLocaleString();
                isRedeem = true;
                fetchPointData(currentPoint);
              } else {
                hideLoading();
                showToastError(
                  data.EM || "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
                );
              }
            })
            .catch((error) => {
              console.error("Error redeeming points:", error);
              showToastError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            });

          // fetch("/delete-item", { method: "POST" }) // Gọi API xóa
          //   .then((response) => {
          //     Swal.fire("Đã xóa!", "", "success");
          //   });
        }
      });
    });
    buttonRedeem.disabled = currentPoint < pointNumber;
    const buttonRedeemCancel = document.createElement("button");
    buttonRedeemCancel.textContent = "Hủy";
    buttonRedeemCancel.className = "cancel-btn";
    buttonRedeemCancel.addEventListener("click", () => {
      valueDivInput.style.display = "none";
      button.style.display = "block";
    });

    valueDivInput.appendChild(input);
    valueDivInput.appendChild(buttonRedeem);
    valueDivInput.appendChild(buttonRedeemCancel);
    valueDivInput.style.display = "none";

    item.appendChild(label);
    item.appendChild(value);
    item.appendChild(button);
    item.appendChild(valueDivInput);
    pointItemsList.appendChild(item);
    // pointItemsList.appendChild(valueDivInput);
  });
}
// get detail log coupon in the past
async function fetchHistoryCoupon({
  customerId,
  limit,
  typeCursor,
  lastId,
  orderBy,
  group,
  skip,
}) {
  console.log("Fetching history coupon for customerId:", customerId);
  if (!customerId) {
    showErrorState("Customer ID is required to fetch history coupon.");
    return;
  }
  showLoadingStateHistory();
  const lastIdParam = lastId ? `&lastId=${lastId}` : "";
  const limitParam = limit ? `&limit=${limit}` : "";
  const typeCursorParam = typeCursor ? `&typeCursor=${typeCursor}` : "";
  const orderByParam = orderBy ? `&orderBy=${orderBy}` : "";
  const skipParam = skip ? `&skip=${skip}` : "";
  const groupParam = group ? `&group=${group}` : "";
  const url = `https://${BASE_URL_EMBED}/apps/app/api/redeemed_code?customerId=${customerId}${lastIdParam}${limitParam}${typeCursorParam}${orderByParam}${skipParam}${groupParam}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.EC === 0) {
        statsGrid.innerHTML = ""; // Xóa nội dung cũ trong statsGrid
        statsGrid.appendChild(
          createStatCard(
            "Tổng số lần đổi thưởng",
            data.DT.infor._count._all,
            "fa-solid fa-list-check",
          ),
        );

        // Thêm card tổng điểm đã dùng
        statsGrid.appendChild(
          createStatCard(
            "Tổng điểm đã dùng",
            data.DT.infor._sum.point_used.toLocaleString(),
            "fa-solid fa-coins",
          ),
        );

        // Thêm card tổng giá trị
        statsGrid.appendChild(
          createStatCard(
            "Tổng giá trị",
            formatCurrency(data.DT.infor._sum.amount),
            "fa-solid fa-sack-dollar",
          ),
        );

        renderVouchers(data.DT.data || []);
        cursor = data.DT.cursor || undefined;
        if (data.DT.cursor) {
          const { isNextPage, isPreviousPage } = data.DT.cursor;
          if (isNextPage) {
            nextButton[0].disabled = false;
          } else {
            nextButton[0].disabled = true;
          }
          if (isPreviousPage) {
            previousButton[0].disabled = false;
          } else {
            previousButton[0].disabled = true;
          }
        }

        pagination[0].style.display = "flex";
      } else {
        showErrorState(data.EM);
      }
    })
    .catch((error) => {
      console.error("Error fetching history coupon:", error);
      showErrorState(error.message);
    });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToastSuccess("Đã sao chép mã voucher: " + text);
  });
}

function renderVouchers(vouchers) {
  container.innerHTML = "";
  if (vouchers.length == 0) {
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.innerHTML = `
    <h3>Không có voucher nào</h3>
`;

    loadingState.style.display = "none";
    statsGrid.style.display = "grid";
    // selectedFilter.style.display = "block";
    pagination[0].style.display = "none";
    return;
  }
  vouchers.forEach((voucher) => {
    const voucherElement = document.createElement("div");
    voucherElement.className = "voucher-card";

    voucherElement.innerHTML = `
                    <div class="card-header">
                        <span class="voucher-id">Mã số #${voucher.id}</span>
                        <span class="voucher-amount">${formatCurrency(voucher.amount)}</span>
                    </div>
                    
                    <div class="card-body">
                        <div class="detail-item">
                            <span class="detail-label">Ngày tạo</span>
                            <span class="detail-value">${formatDate(voucher.created_at)}</span>
                        </div>
                        
                        <div class="detail-item">
                            <span class="detail-label">Điểm sử dụng</span>
                            <span class="detail-value">${voucher.point_used} điểm</span>
                        </div>
                    </div>
                    
                    <div class="voucher-code-container">
                        <span id="status-${voucher.codeId}"  class="status-badge ${voucher.code.status ? "status-used" : ""}">
                            ${voucher.code.status ? "Hết hạn" : voucher.code.isUsed ? "Đã dùng" : "Chưa dùng"}
                        </span>
                        <div class="voucher-code">${voucher.code.code}</div>
                        <button class="copy-btn" onclick="copyToClipboard('${voucher.code.code}')">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                        </button>
                    </div>
                `;
    container.appendChild(voucherElement);
  });
  hideLoadingStateHistory();
}
let URL_SOCKET = "https://eb90-14-232-161-225.ngrok-free.app".trim();
let sk;
document.addEventListener("DOMContentLoaded", function () {
  sk = io(URL_SOCKET, {
    transports: ["websocket"],
  });
  const info = window.customerInfo;

  if (info.loggedIn) {
    shopId = info.shopId;
    userId = info.id || 0;
    BASE_URL_EMBED = info.domain;

    sk.on("connect", () => {
      console.log("Connected to Socket.IO server!");
      sk.emit("userOnlineEmbed", userId);
    });
    sk.on("expiredCoupon", (data) => {
      const selectedEl = document.getElementById(`status-${data}`);
      if (selectedEl) {
        selectedEl.classList.add("status-used");
        // selectedEl.classList.add("status-expired");
        selectedEl.textContent = "Hết hạn";
      }
      console.log("expired coupon Id", data);
    });
    window.addEventListener("beforeunload", function (event) {
      sk.emit("userOffline", userId);
      // sk.disconnect();
    });

    // initModal(info);
    openModalBtn.addEventListener("click", () => openModal(info));
    closeModalBtn.addEventListener("click", closeModal);
  } else {
    console.log("Not logged in");
    document.getElementById("open-embed-modal-btn")?.classList.add("hidden");
  }
});
