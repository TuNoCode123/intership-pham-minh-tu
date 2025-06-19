let productId;
let starReview = 0,
  textReview = "";
let userOnlines;
let isFirstTimeReview = false;
let base_url_block = "https://shopoftu2.myshopify.com";
const BASE_REVIEWS = {
  1: "RẤT KHÔNG HÀI LÒNG",
  2: "KHÔNG HÀI LÒNG",
  3: "TẠM ỔN",
  4: "HÀI LÒNG",
  5: "RẤT HÀI LÒNG",
};
const localName = {
  rating: `product-rating-${productId}`,
  review: `product-review-${productId}`,
};
const listContainer = document.getElementById("list-container");
const loadingStateReview = document.getElementById("loading-state-review");
const selectedFilterReview = document.getElementById("country-select-review");
const selectFilterRating = document.getElementById(
  "country-select-review-rating",
);
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const currentPageEl = document.getElementById("current-page");
const paginationReview = document.getElementsByClassName("pagination");
const totalPagesEl = document.getElementById("total-pages");
const spinnerReview = document.getElementById("fullscreenSpinner");
const messageReview = document.getElementById("message-review");
const textMapping = document.getElementById("text-mapping");

const openModalBtnCharge = document.getElementById("open-embed-modal-btn");
let isDragging = false;
let offsetX, offsetY;
openModalBtnCharge.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - openModalBtnCharge.offsetLeft;
  offsetY = e.clientY - openModalBtnCharge.offsetTop;
  openModalBtnCharge.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  openModalBtnCharge.style.left = e.clientX - offsetX + "px";
  openModalBtnCharge.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  openModalBtnCharge.style.cursor = "grab";
});
let currentPage = 1;
let totalPages = 0;
const LIMIT_PAGE = 5;
let skipReview = 0;
let cursorReview = undefined;
let currentOrderby = "none";
let currentGroup = "none";
let isOrder = false;
let isGroup = false;
function showLoadingReview() {
  spinnerReview.style.display = "flex";
}
function hideLoadingReview() {
  spinnerReview.style.display = "none";
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    currentPageEl.innerHTML = currentPage;

    if (cursorReview) {
      if (isOrder || isGroup) {
        let clause = {};
        if (isOrder) {
          clause["orderBy"] = currentOrderby;
        }
        if (isGroup) {
          clause["group"] = currentGroup;
        }
        skipReview -= LIMIT_PAGE;
        initFetch({
          id: productId,
          limit: LIMIT_PAGE,
          typeCursor: "before",
          // orderBy: currentOrderby,
          skip: skipReview,
          lastId: cursorReview.previousId,
          ...clause,
        });
      } else {
        initFetch({
          id: productId,
          limit: LIMIT_PAGE,
          typeCursor: "before",
          lastId: cursorReview.previousId,
        });
      }
    }

    // updateButtons();
    // Thêm logic tải dữ liệu trang trước ở đây
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    currentPageEl.innerHTML = currentPage;
    if (cursorReview) {
      if (isOrder || isGroup) {
        let clause = {};
        if (isOrder) {
          clause["orderBy"] = currentOrderby;
        }
        if (isGroup) {
          clause["group"] = currentGroup;
        }

        skipReview += LIMIT_PAGE;
        initFetch({
          id: productId,
          limit: LIMIT_PAGE,
          typeCursor: "after",
          // orderBy: currentOrderby,
          skip: skipReview,
          lastId: cursorReview.nextId,
          ...clause,
        });
      } else {
        console.log("init fetch");
        initFetch({
          id: productId,
          limit: LIMIT_PAGE,
          typeCursor: "after",
          lastId: cursorReview.nextId,
        });
      }
    }
    // updateButtons();
    // Thêm logic tải dữ liệu trang tiếp theo ở đây
  }
});
function fetchFilterReview(value) {
  skipReview = 0;
  const clause = {};
  if (isGroup) {
    clause["group"] = currentGroup;
  }
  initFetch({
    id: productId,
    limit: LIMIT_PAGE,
    typeCursor: "after",
    orderBy: value,
    skip: 0,
    ...clause,
  });
  currentOrderby = value;
  currentPage = 1;
  currentPageEl.innerHTML = currentPage;
  if (value === "none") {
    isOrder = false;
  } else {
    isOrder = true;
  }
}
selectedFilterReview.addEventListener("change", function () {
  fetchFilterReview(this.value);
  //)
  // skipReview = 0;
  // const clause = {};
  // if (isGroup) {
  //   clause["group"] = currentGroup;
  // }
  // initFetch({
  //   id: productId,
  //   limit: LIMIT_PAGE,
  //   typeCursor: "after",
  //   orderBy: this.value,
  //   skip: 0,
  //   ...clause,
  // });
  // currentOrderby = this.value;
  // currentPage = 1;
  // currentPageEl.innerHTML = currentPage;
  // if (this.value === "none") {
  //   isOrder = false;
  // } else {
  //   isOrder = true;
  // }
});
selectFilterRating.addEventListener("change", function () {
  skipReview = 0;
  const clause = {};
  if (isOrder) {
    clause["orderBy"] = currentOrderby;
  }
  initFetch({
    id: productId,
    limit: LIMIT_PAGE,
    typeCursor: "after",
    group: this.value,
    skip: 0,
  });
  currentGroup = this.value;
  currentPage = 1;
  currentPageEl.innerHTML = currentPage;
  if (this.value === "none") {
    isGroup = false;
  } else {
    isGroup = true;
  }
});
function showLoadingStateReview() {
  loadingStateReview.style.display = "block";
  listContainer.style.display = "none";
  paginationReview[0].style.display = "none";
  // container.style.display = "none";
}
function hideLoadingStateReview() {
  loadingStateReview.style.display = "none";
  listContainer.style.display = "flex";
  paginationReview[0].style.display = "flex";
}

function createStar(rating) {
  const stars = "⭐".repeat(rating) + "☆".repeat(5 - rating);
  return stars;
}
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}
function formatDateNotTime(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
let reviews;
async function initFetch({
  id,
  orderBy,
  lastId,
  limit,
  typeCursor,
  skip,
  group,
}) {
  showLoadingStateReview();
  messageReview.style.display = "none";
  const lastIdParam = lastId ? `&lastId=${lastId}` : "";
  const limitParam = limit ? `&limit=${limit}` : "";
  const typeCursorParam = typeCursor ? `&typeCursor=${typeCursor}` : "";
  const orderByParam = orderBy ? `&orderBy=${orderBy}` : "";
  const skipParam = skip ? `&skip=${skip}` : "";
  const groupParam = group ? `&group=${group}` : "";
  const url = `https://${base_url_block}/apps/app/api/reviews/list?productId=${id}${orderByParam}${limitParam}${typeCursorParam}${skipParam}${lastIdParam}${groupParam}`;
  // console.log("url111", BASE_URL_EMBED);
  fetch(url, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (Object.keys(data.DT.data).length === 0) {
        if (!isFirstTimeReview) {
          selectedFilterReview.style.display = "none";
          selectFilterRating.style.display = "none";
          paginationReview[0].style.display = "none";
          isFirstTimeReview = true;
          loadingStateReview.style.display = "none";
          messageReview.style.display = "flex";
          return;
        }

        paginationReview[0].style.display = "none";
        loadingStateReview.style.display = "none";
        messageReview.style.display = "flex";
        return;
      }
      isFirstTimeReview = true;
      totalPages =
        data.DT.totalPages % LIMIT_PAGE == 0
          ? data.DT.totalPages / LIMIT_PAGE
          : Math.floor(data.DT.totalPages / LIMIT_PAGE) + 1;
      totalPagesEl.innerHTML = totalPages;
      reviews = data.DT.data;
      rederReviewList(data.DT.data);
      hideLoadingStateReview();
      if (data.DT.cursor) {
        cursorReview = data.DT.cursor;
        const { isNextPage, isPreviousPage } = data.DT.cursor;
        nextBtn.classList.toggle("disabled", isNextPage === false);
        prevBtn.classList.toggle("disabled", isPreviousPage === false);
      }

      console.log("Reviews fetched successfully:", data);
    });
}
function rederReviewList(reviews) {
  listContainer.innerHTML = "";
  // for (let i = 0; i < reviews.length; i++) {
  //   renderReview(reviews[i]);
  // }
  if (reviews?.length > 0)
    reviews?.forEach((review, index) => {
      // console.log("render");
      renderReview(review, index);
    });
}
function renderReview(review, index) {
  const containerReviews = document.createElement("div");
  containerReviews.className = "container-reviews"; // nên dùng class thay vì id
  const customerReviews = document.createElement("div");
  customerReviews.id = "customer-reviews";

  const customerAvatar = document.createElement("div");
  customerAvatar.className = "customer-avatar";
  const avatarIcon = document.createElement("i");
  avatarIcon.className = "fa-solid fa-user-tie";
  customerAvatar.appendChild(avatarIcon);

  const isOnline = document.createElement("span");
  isOnline.className = "online-status";
  isOnline.classList.add(
    `user-${review.customers.customerId.split("/").pop()}`,
  );
  isOnline.style.display = "none";

  customerAvatar.appendChild(isOnline);

  const customerInfo = document.createElement("div");
  customerInfo.className = "customer-infor";
  customerInfo.style.display = "flex";
  customerInfo.style.flexDirection = "column";
  customerInfo.style.justifyContent = "center";
  customerInfo.style.alignItems = "flex-start";
  customerInfo.style.marginLeft = "10px";

  const customerName = document.createElement("div");
  customerName.id = "customer-name";

  const customerDate = document.createElement("div");
  customerDate.id = "customer-date";

  customerInfo.appendChild(customerName);
  customerInfo.appendChild(customerDate);

  customerReviews.appendChild(customerAvatar);
  customerReviews.appendChild(customerInfo);

  const contentReviews = document.createElement("div");
  contentReviews.id = "content-reviews";
  contentReviews.style.width = "70%";

  const starReviews = document.createElement("div");
  starReviews.id = "star-reviews";

  const textReviews = document.createElement("div");
  textReviews.id = "text-reviews";

  const reviewImagesContainer = document.createElement("div");
  reviewImagesContainer.id = "review-images";

  const imagesReviews = document.createElement("div");
  imagesReviews.id = "images-reviews";
  imagesReviews.style.display = "flex";
  imagesReviews.style.gap = "10px";
  // imagePreview.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";

  const dateReviews = document.createElement("div");
  dateReviews.id = "date-reviews";

  contentReviews.appendChild(starReviews);
  contentReviews.appendChild(textReviews);
  contentReviews.appendChild(reviewImagesContainer);
  contentReviews.appendChild(imagesReviews);
  contentReviews.appendChild(dateReviews);
  starReviews.innerHTML = `
  <span class="stars">${createStar(review.rating)}</span>
  <span class="text">${BASE_REVIEWS[review.rating]}</span>
`;
  textReviews.innerHTML = `<span class="review-text">${review.content}</span>`;
  if (review.images && review.images.length > 0) {
    review.images.forEach((imageUrl) => {
      const img = document.createElement("img");
      img.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      img.src = imageUrl.image;
      img.alt = "Review Image";
      img.classList.add("review-image");
      const imgLink = document.createElement("a");
      imgLink.href = imageUrl.image;
      imgLink.setAttribute("data-fancybox", `gallery-${index}`);
      imgLink.setAttribute("data-caption", "Review Image");
      imgLink.appendChild(img);

      imagesReviews.appendChild(imgLink);
    });
  }
  dateReviews.innerHTML = `<span class="review-date">Đánh giá vào ${formatDate(review.created_at)}</span>`;
  customerName.innerText =
    review.customers.firstName + " " + review.customers.lastName;
  customerDate.innerText =
    "Đã tham gia " + formatDateNotTime(review.created_at);

  containerReviews.appendChild(customerReviews);
  containerReviews.appendChild(contentReviews);
  listContainer.appendChild(containerReviews);
  updateOnlineStatus();
}

//star
const stars = document.querySelectorAll(".star");
// const selectedRating = document.querySelector(".selected-rating");

stars.forEach((star) => {
  star.addEventListener("click", function () {
    const rating = this.getAttribute("data-rating");
    starReview = rating;
    highlightStars(rating);
    // selectedRating.textContent = rating;
    localStorage.setItem(`product-rating-${productId}`, rating);
  });
});

function highlightStars(rating) {
  if (rating > 0) {
    textMapping.innerHTML = BASE_REVIEWS[rating];
  } else {
    textMapping.innerHTML = "";
  }

  stars.forEach((star) => {
    const starRating = star.getAttribute("data-rating");
    star.classList.toggle("active", starRating <= rating);
  });
}

//review-content

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ImageStore", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", {
          keyPath: `id`,
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Failed to open IndexedDB");
    };
  });
}

const reviewContent = document.getElementById("myTextarea");
reviewContent &&
  reviewContent.addEventListener("input", function () {
    localStorage.setItem(`product-review-${productId}`, this.value);
    textReview = this.value;
  });
const buttonReviewSubmit = document.getElementsByClassName("btn");
buttonReviewSubmit?.length > 0 &&
  buttonReviewSubmit[0].addEventListener("click", function () {
    console.log("----------->", BASE_URL_EMBED);
    showLoadingReview();
    const formData = new FormData();
    formData.append("product_id", `gid://shopify/Product/${productId}`);
    formData.append("customer_id", `gid://shopify/Customer/${customerId}`);
    formData.append("rating", starReview);
    formData.append("content", textReview);
    formData.append("shopId", shopId);
    for (const file of uploadedFiles) {
      formData.append("images", file.file);
    }
    fetch(`https://${BASE_URL_EMBED}/apps/app/api/reviews`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const { EC, EM } = data;
        if (EC == 0) {
          reviewContent.innerHTML = "";
          reviewContent.value = "";
          starReview = 0;
          textReview = "";
          uploadedFiles = [];
          localStorage.removeItem(`product-rating-${productId}`);
          localStorage.removeItem(`product-review-${productId}`);
          displayImagePreviews();
          updateFileInfo();
          getAllImagesFromIndexedDB().then((images) => {
            images.forEach((image) => {
              if (image.productId == productId) {
                deleteFromIndexDb(image.id);
              }
              // deleteFromIndexDb(image.id);
            });
          });
          highlightStars(starReview);
          // selectedRating.textContent = starReview;
          fetchCanComment(customerId, productId);
          showToastSuccess(
            "Bình luận của bạn đã được chuyển đến kiểm duyệt viên và đợi kiểm duyệt!!!",
          );
        } else {
          showToastError(EM);
        }
        hideLoadingReview();
      })
      .catch((err) => console.error(err));
  });

const imageUpload = document.getElementById("image-upload");
const addImagesBtn = document.getElementById("add-images-btn");
const imagePreview = document.getElementById("image-preview");
const fileInfo = document.getElementById("file-info");
const reviewForm = document.getElementById("product-evaluate");

let uploadedFiles = [];

// Trigger file input when button is clicked
addImagesBtn.addEventListener("click", function () {
  imageUpload.click();
});

imageUpload.addEventListener("change", function (e) {
  const files = Array.from(e.target.files);

  if (files.length > 0) {
    saveImageToIndexedDB(files).then((data) => {
      console.log("data", data);
      uploadedFiles = [...uploadedFiles, ...data];
      updateFileInfo();
      displayImagePreviews();
    });
  }
  imageUpload.value = "";
});

function updateFileInfo() {
  if (uploadedFiles.length === 0) {
    fileInfo.textContent = "Không ảnh nào được chọn!";
  } else {
    fileInfo.textContent = `${uploadedFiles.length} ảnh được chọn!`;
  }
}
async function saveImageToIndexedDB(files) {
  const db = await initDB();
  const tx = db.transaction("images", "readwrite");
  const store = tx.objectStore("images");
  let listImages = [];
  for (const file of files) {
    const key = await new Promise((resolve, reject) => {
      const addRequest = store.add({ file: file, productId });
      addRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };
      addRequest.onerror = (event) => {
        reject(event.target.error);
      };
    });
    listImages.push({
      id: key,
      file,
    });
  }
  return listImages;
}
async function getAllImagesFromIndexedDB() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");

    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Failed to retrieve images");
    };
  });
}

function displayImagePreviews() {
  imagePreview.innerHTML = "";

  uploadedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewItem = document.createElement("div");
      previewItem.className = "preview-item";
      previewItem.dataset.imageId = file.id;
      previewItem.innerHTML = `
          <a data-fancybox="gallery" data-caption="Review Image" href="${e.target.result}">
          <img  src="${e.target.result}"  alt="Preview">
          </a>
          <button type="button" class="btn-remove-image" data-index="${index}">
            <i class="fas fa-times"></i>
          </button>
        `;

      imagePreview.appendChild(previewItem);
    };

    reader.readAsDataURL(file.file);
  });
}

imagePreview.addEventListener("click", function (event) {
  if (event.target.closest(".btn-remove-image")) {
    const previewItem = event.target.closest(".preview-item");
    const index = parseInt(
      event.target.closest(".btn-remove-image").dataset.index,
    );
    const id = previewItem.dataset.imageId;
    uploadedFiles.splice(index, 1);
    displayImagePreviews();
    updateFileInfo();
    deleteFromIndexDb(id);
  }
});
async function deleteFromIndexDb(keys) {
  const db = await initDB();
  const tx = db.transaction("images", "readwrite");
  const store = tx.objectStore("images");
  const deleteRequest = store.delete(+keys);

  deleteRequest.onsuccess = function () {
    console.log("Đã xóa thành công phần tử!!");
  };
  deleteRequest.onerror = function () {
    console.error("Lỗi khi xóa phần tử:", deleteRequest.error);
  };
}
let customerId;
const orderNumber = document.getElementById("number-order");
function fetchCanComment(cusId, productId) {
  try {
    const url = `https://${base_url_block}/apps/app/api/canComment?customerId=${cusId}&productId=${productId}`;
    fetch(url, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data?.DT?.isCanComment) {
          reviewForm.style.display = "none";
          orderNumber.innerHTML =
            "Hiện tại bạn không còn lượt bình luận nào, hãy mua hàng để bình luận!";
          return;
        }

        orderNumber.innerHTML = `Bạn còn ${data?.DT?.commentNumber} lần bình luận!`;
        reviewForm.style.display = "block";
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}
function fetchOverViewProduct(productId) {
  const url = `https://${base_url_block}/apps/app/api/view_product/${productId}`;
  fetch(url, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      renderStarRatings(data.DT);
      console.log("Reviews fetched successfully:", data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function renderStarRatings(data) {
  const totalReviews = data.total_reviews;
  const starCounts = data.listStar;
  const averageRating = data.avg_star;

  // Update average rating display
  document.querySelector(".average-rating .score").textContent = averageRating;
  document.querySelector(".total-reviews").textContent =
    `(${totalReviews} đánh giá)`;

  const avgStarsContainer = document.querySelector(".average-rating .stars");
  avgStarsContainer.innerHTML = "";
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    const starSpan = document.createElement("span");
    starSpan.classList.add("star");
    if (i < fullStars) {
      starSpan.innerHTML = "&#9733;"; // Full star
    } else if (i === fullStars && hasHalfStar) {
      starSpan.innerHTML = "&#9733;";
      starSpan.style.color = "gold";
      starSpan.style.backgroundImage =
        "linear-gradient(to right, gold 50%, lightgray 50%)";
      starSpan.style.WebkitBackgroundClip = "text";
      starSpan.style.color = "transparent";
    } else {
      starSpan.innerHTML = "&#9734;";
      starSpan.style.color = "lightgray";
    }
    avgStarsContainer.appendChild(starSpan);
  }

  // Render individual rating rows
  const individualRatingsContainer = document.querySelector(
    ".individual-ratings",
  );
  individualRatingsContainer.innerHTML = ""; // Clear previous rows
  for (let i = 5; i >= 1; i--) {
    const count = starCounts[i - 1]?.reviewNumber || 0;
    const percentage = (count / totalReviews) * 100;

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("rating-row");
    const starsDiv = document.createElement("div");
    starsDiv.classList.add("stars");
    for (let j = 0; j < 5; j++) {
      const starSpan = document.createElement("span");
      starSpan.classList.add("star");
      if (j < i) {
        starSpan.innerHTML = "&#9733;";
        starSpan.style.color = "gold";
      } else {
        starSpan.innerHTML = "&#9734;";
        starSpan.style.color = "lightgray";
      }
      starsDiv.appendChild(starSpan);
    }
    rowDiv.appendChild(starsDiv);

    const progressBarContainer = document.createElement("div");
    progressBarContainer.classList.add("progress-bar-container");
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.style.width = `${percentage}%`;
    progressBar.style.display = "block";
    progressBarContainer.appendChild(progressBar);
    rowDiv.appendChild(progressBarContainer);
    const countSpan = document.createElement("span");
    countSpan.classList.add("count");
    countSpan.textContent = count;
    rowDiv.appendChild(countSpan);

    individualRatingsContainer.appendChild(rowDiv);
  }
}
let socket;
function updateOnlineStatus() {
  if (userOnlines?.length > 0) {
    const listStatus = document.getElementsByClassName(`online-status`);

    if (listStatus.length > 0) {
      Array.from(listStatus).forEach((el) => {
        el.style.display = "none";
      });
    }
    console.log("userOnlines", userOnlines);
    userOnlines.map((user) => {
      const listUserOnline = Array.from(
        document.getElementsByClassName(`user-${user.userId}`),
      );

      if (listUserOnline.length > 0) {
        console.log("listUserOnline", listUserOnline);
        listUserOnline.forEach((el) => {
          el.style.display = "block";
        });
      }
    });
  }
}

const submitButton = document.addEventListener("DOMContentLoaded", function () {
  const URL_SOCKET_REVIEW = "https://eb90-14-232-161-225.ngrok-free.app".trim();
  const info = window.productInfor;
  base_url_block = info.domain;
  socket = io(URL_SOCKET_REVIEW, {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server review!");
    socket.emit("userOnlineBlock", info.customerId);
  });
  socket.on("listUserOnline", (data) => {
    console.log("listUserOnline", data);
    userOnlines = data;
  });

  productId = info.id;
  customerId = info.customerId;

  socket.on("adminApprovedReview", async (data) => {
    console.log("adminApprovedReview", data);
    if (!data) {
      showToastError("admin rejected your review");
    } else {
      showToastSuccess("admin approved your review");
    }

    await Promise.all([
      fetchFilterReview("desc"),
      fetchOverViewProduct(productId),
    ]);
  });
  messageReview.style.display = "none";
  const savedRating = localStorage.getItem(`product-rating-${productId}`);
  const saveContent = localStorage.getItem(`product-review-${productId}`);
  getAllImagesFromIndexedDB().then((images) => {
    console.log("Images from IndexedDB:", images);
    if (images.length > 0) {
      const imageOfProduct = [];
      images.forEach((i) => {
        const { productId: pId, ...restObject } = i;
        if (pId == productId) {
          imageOfProduct.push(restObject);
        }
      });
      uploadedFiles = [...uploadedFiles, ...imageOfProduct];
      displayImagePreviews();
      updateFileInfo();
    }
  });
  // const savedImage = localStorage.getItem("images");
  // if (savedImage) {
  //   uploadedFiles = JSON.parse(savedImage);
  //   displayImagePreviews();
  //   updateFileInfo();
  // }
  if (saveContent) {
    reviewContent.value = saveContent;
    textReview = saveContent;
  }
  if (savedRating) {
    // selectedRating.textContent = savedRating;
    starReview = savedRating;
    highlightStars(savedRating);
  }
  Fancybox.bind("[data-fancybox]", {
    Thumbs: false,
    Toolbar: {
      display: {
        left: [],
        middle: [],
        right: ["close"],
      },
    },
  });
  let asyncFunc = [];
  if (customerId && productId) {
    asyncFunc.push(fetchCanComment(customerId, productId));
  }

  Promise.all([
    fetchOverViewProduct(productId),
    initFetch({ id: info.id, limit: LIMIT_PAGE }),
    ...asyncFunc,
  ]);
});
