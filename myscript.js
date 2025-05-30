const carList = document.getElementById("car-list");
const form = document.getElementById("newCarForm");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const modal = document.getElementById("carModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalYear = document.getElementById("modalYear");
const closeModal = document.getElementById("closeModal");

let cars = JSON.parse(localStorage.getItem("cars")) || [];

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
      <img src="${car.image || 'https://via.placeholder.com/200x130?text=No+Image'}" alt="${car.make} ${car.model}">
      <div class="info">
        <h3>${car.make} ${car.model}</h3>
        <p>${car.year}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      showCarDetails(car);
    });
    carList.appendChild(card);
  });
}

function showCarDetails(car) {
  modalImage.src = car.image || 'https://via.placeholder.com/400x300?text=No+Image';
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

renderCars();

// VIN decode logic
document.getElementById("decodeVinBtn").addEventListener("click", async () => {
  const vin = document.getElementById("vin").value.trim();
  const message = document.getElementById("vinMessage");

  if (!vin || vin.length < 5) {
    message.textContent = "Please enter a valid VIN (at least 5 characters).";
    return;
  }

  message.textContent = "Looking up VIN...";

  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
    const data = await res.json();

    const results = data.Results;
    const make = results.find(item => item.Variable === "Make")?.Value || "";
    const model = results.find(item => item.Variable === "Model")?.Value || "";
    const year = results.find(item => item.Variable === "Model Year")?.Value || "";

    if (make && model && year) {
      document.getElementById("make").value = make;
      document.getElementById("model").value = model;
      document.getElementById("year").value = year;

      
      const guessImageURL = `https://source.unsplash.com/400x300/?${make},${model},car`;
      document.getElementById("image").value = guessImageURL;

      message.textContent = "Car info filled successfully.";
    } else {
      message.textContent = "Car info not found for this VIN.";
    }
  } catch (err) {
    console.error("Error decoding VIN:", err);
    message.textContent = "Failed to decode VIN. Try again later.";
  }
});
