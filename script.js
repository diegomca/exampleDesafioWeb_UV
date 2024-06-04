document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

const itemsPerPage = 10;
let currentPage = 1;
let data = [];

function fetchData() {
  fetch("https://akabab.github.io/superhero-api/api/all.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((fetchedData) => {
      data = fetchedData;
      renderPagination();
      renderPage(currentPage);
    })
    .catch((error) => {
      document.getElementById("dataList").textContent = "Fetch error: " + error;
    });
}

function renderPage(page) {
  const dataList = document.getElementById("dataList");
  dataList.innerHTML = ""; // Limpiar cualquier contenido existente

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = data.slice(start, end);

  pageData.forEach((item) => {
    const card = document.createElement("div");
    card.className = "col-md-3";
    card.innerHTML = `
            <div class="card mb-4 shadow-sm">
                <div class="card-body">
                    <img src="${item.images.sm}" class="card-img-top maxWidthImage" alt="${item.biography.fullName}">
                    <h5 class="card-title">${item.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Nombre completo: ${item.biography.fullName}</h6>
                    <p class="card-text">${item.connections.groupAffiliation}</p>
                </div>
            </div>
        `;
    dataList.appendChild(card);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = ""; // Limpiar cualquier contenido existente

  if (totalPages <= 1) return; // No mostrar paginación si hay una sola página

  const maxPagesToShow = 10;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(
    totalPages,
    currentPage + Math.floor(maxPagesToShow / 2)
  );

  if (endPage - startPage + 1 < maxPagesToShow) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
  }

  if (startPage > 1) {
    pagination.appendChild(createPageItem(1));
    if (startPage > 2) {
      pagination.appendChild(createEllipsis());
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.appendChild(createPageItem(i));
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pagination.appendChild(createEllipsis());
    }
    pagination.appendChild(createPageItem(totalPages));
  }
}

function createPageItem(page) {
  const pageItem = document.createElement("li");
  pageItem.className = "page-item" + (page === currentPage ? " active" : "");
  pageItem.innerHTML = `<a class="page-link" href="#">${page}</a>`;
  pageItem.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = page;
    renderPage(currentPage);
    renderPagination();
  });
  return pageItem;
}

function createEllipsis() {
  const ellipsisItem = document.createElement("li");
  ellipsisItem.className = "page-item disabled";
  ellipsisItem.innerHTML = `<span class="page-link">...</span>`;
  return ellipsisItem;
}
