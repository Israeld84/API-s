const carList = document.getElementById("car-list");
const form = document.getElementById("newCarForm");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const modal = document.getElementById("carModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalYear = document.getElementById("modalYear");
const closeModal = document.getElementById("closeModal");

let cars = JSON.parse(localStorage.getItem("cars")) || [
  { id: 1, make: "Toyota", model: "Corolla", year: 2021, image: "" },
  { id: 2, make: "Ford", model: "Mustang", year: 2022, image: "" },
  { id: 3, make: "Tesla", model: "Model S", year: 2023, image: "" },
  { id: 4, make: "BMW", model: "X5", year: 2020, image: "" },
  { id: 5, make: "Honda", model: "Civic", year: 2019, image: "" },
  { id: 6, make: "Audi", model: "A4", year: 2022, image: "" },
  { id: 7, make: "Chevrolet", model: "Camaro", year: 2021, image: "" },
  { id: 8, make: "Nissan", model: "Altima", year: 2018, image: "" },
  { id: 9, make: "Jeep", model: "Wrangler", year: 2021, image: "" },
  { id: 10, make: "Mercedes", model: "C-Class", year: 2022, image: "" }
];

function saveCars() {
  localStorage.setItem("cars", JSON.stringify(cars));
}

function renderCars() {
  let filteredCars = [...cars];

  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filteredCars = filteredCars.filter(car =>
      car.make.toLowerCase().includes(searchTerm) ||
      car.model.toLowerCase().includes(searchTerm)
    );
  }

  if (sortSelect.value === "year") {
    filteredCars.sort((a, b) => b.year - a.year);
  } else if (sortSelect.value === "make") {
    filteredCars.sort((a, b) => a.make.localeCompare(b.make));
  }

  carList.innerHTML = "";
  filteredCars.forEach((car) => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <img src="${car.image}" alt="${car.make} ${car.model}">
      <div class="info">
        <h3>${car.make} ${car.model}</h3>
        <p>${car.year}</p>
      </div>
     
    `;
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("delete-btn")) {
        showCarDetails(car);
      }
    });
    carList.appendChild(card);
  });
}

function showCarDetails(car) {
  modalImage.src = car.image;
  modalTitle.textContent = `${car.make} ${car.model}`;
  modalYear.textContent = `Year: ${car.year}`;
  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newCar = {
    id: Date.now(),
    make: document.getElementById("make").value,
    model: document.getElementById("model").value,
    year: parseInt(document.getElementById("year").value),
    image: document.getElementById("image").value,
  };
  cars.push(newCar);
  saveCars();
  renderCars();
  form.reset();
});

searchInput.addEventListener("input", renderCars);
sortSelect.addEventListener("change", renderCars);

function deleteCar(id) {
  if (confirm("Are you sure you want to delete this car?")) {
    cars = cars.filter(car => car.id !== id);
    saveCars();
    renderCars();
  }
}

renderCars();