const carList = document.getElementById("car-list");
const form = document.getElementById("newCarForm");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const decodeBtn = document.getElementById("decodeVinBtn");

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
  filteredCars.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <img src="${car.image}" alt="${car.make} ${car.model}">
      <div class="info">
        <h3>${car.make} ${car.model}</h3>
        <p>${car.year}</p>
      </div>
    `;
    card.addEventListener("click", () => showCarDetails(car));
    carList.appendChild(card);
  });
}

function showCarDetails(car) {
  modalImage.src = car.image || "https://via.placeholder.com/400x200?text=No+Image";
  modalTitle.textContent = `${car.make} ${car.model}`;
  modalYear.textContent = `Year: ${car.year}`;
  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// ✅ VIN decoding only populates the fields
decodeBtn.addEventListener("click", async () => {
  const vin = document.getElementById("vin").value.trim();
  if (!vin) return alert("Please enter a VIN.");

  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
    const data = await response.json();
    const results = data.Results;

    const make = results.find(r => r.Variable === "Make")?.Value || "";
    const model = results.find(r => r.Variable === "Model")?.Value || "";
    const year = parseInt(results.find(r => r.Variable === "Model Year")?.Value) || "";

    if (make && model && year) {
      document.getElementById("make").value = make;
      document.getElementById("model").value = model;
      document.getElementById("year").value = year;
      alert("VIN decoded! Make, model, and year filled. Please click 'Add Car' to add it.");
    } else {
      alert("Could not decode the VIN properly.");
    }
  } catch (error) {
    console.error("Error decoding VIN:", error);
    alert("Error decoding VIN.");
  }
});

// ✅ Submit handler adds car to list
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const make = document.getElementById("make").value.trim();
  const model = document.getElementById("model").value.trim();
  const year = parseInt(document.getElementById("year").value);
  const image = document.getElementById("image").value.trim() || "https://via.placeholder.com/400x200?text=Car+Image";

  if (!make || !model || !year) {
    return alert("Please fill out make, model, and year.");
  }

  const newCar = {
    id: Date.now(),
    make,
    model,
    year,
    image
  };

  cars.push(newCar);
  saveCars();
  renderCars();
  form.reset();
});

searchInput.addEventListener("input", renderCars);
sortSelect.addEventListener("change", renderCars);

renderCars();
