//------------------------------- load category -----------------------------------
const loadCategory = () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data.categories);
      displayAllCategory(data.categories);
    });
};

const displayAllCategory = (categories) => {
  const categoryContainer = document.getElementById("category-container");

  categories.forEach((category) => {
    // console.log(category.id);
    const categoryDiv = document.createElement("div");
    categoryDiv.innerHTML = `
            <button id="category-${category.id}" onclick="loadPlantsById(${category.id})"
              class="text-start text-xl px-2 py-1 rounded w-full mt-2 hover:bg-[#15803D] hover:text-white category-btn" 
            >
              ${category.category_name}
            </button>
    `;
    categoryContainer.appendChild(categoryDiv);
  });
};

loadCategory();

// ----- spinner -----
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("skeleton-container").classList.remove("hidden");
    document.getElementById("card-container").classList.add("hidden");
  } else {
    document.getElementById("card-container").classList.remove("hidden");
    document.getElementById("skeleton-container").classList.add("hidden");
  }
};

// ----- remove active -----
const removeActive = () => {
  const activeElements = document.getElementsByClassName("active");
  console.log(activeElements);
  for (const active of activeElements) {
    active.classList.remove("active");
  }
};

//---------------------------- load All plants by all tress btn -----------------------------
const allTrees = document.getElementById("all-trees");
allTrees.addEventListener("click", () => {
  manageSpinner(true);
  removeActive();
  allTrees.classList.add("active");
  loadAllPlants();
});

const loadAllPlants = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data.plants);
      displayAllPlants(data.plants);
    });
};

loadAllPlants();

//------------------------------- load plants by category ID -----------------------------------
const loadPlantsById = (id) => {
  manageSpinner(true);

  removeActive();
  const clickBtn = document.getElementById(`category-${id}`);
  clickBtn.classList.add("active");

  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.plants);
      displayAllPlants(data.plants);
    });
};

const displayAllPlants = (plants) => {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  plants.forEach((plant) => {
    // console.log(plant);
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("shadow-2xl");
    cardDiv.innerHTML = `
                <div>
                  <img
                    class="w-full h-56 object-cover"
                    src="${plant.image}"
                    alt="Shoes"
                  />
                </div>

                <div class="flex flex-col gap-4 p-4">
                  <h2 id="plant-${plant.id}" class="font-semibold text-lg cursor-pointer">${plant.name}</h2>
                  <p class="h-30">
                    ${plant.description}
                  </p>
                  <div class="flex items-center justify-between">
                    <button
                      class="border font-semibold px-4 rounded-full text-[#15803D] bg-[#dcfce77d] "
                    >
                     ${plant.category}
                    </button>
                    <span class="text-lg font-bold text-[#15803D]"> ৳${plant.price} </span>
                  </div>

                   <button
                      class="w-full rounded-full py-2 font-semibold text-white bg-[#15803D] hover:bg-[#166534] card-add-btn"
                      data-id="${plant.id}" data-plant-name="${plant.name}" data-plant-price="${plant.price}"
                    >
                      Add to Cart
                    </button>
                </div>
            `;
    cardContainer.appendChild(cardDiv);
    manageSpinner(false);
    // btn sara onno kuthau onclick use kora jabena
    // const h2 = document.getElementById(`plant-${plant.id}`);
    cardDiv.addEventListener("click", () => {
      loadPlantsDetail(plant.id);
    });
  });

  //----------- button disable -----------
  const cardAddbtn = document.getElementsByClassName("card-add-btn");
  for (const element of cardAddbtn) {
    // console.log(element);
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      // console.log(event.target);
      // console.log(element.textContent.trim());
      element.setAttribute("disabled", "true");
      element.classList.add("bg-[#5f9d76ca]");
      element.textContent = "Added";
      element.classList.remove("bg-[#15803D]", "hover:bg-[#166534]");

      addToCart(event);
    });
  }
};

const addToCart = (event) => {
  // for crossbtn & dynamic plantName plantPrice
  const btnId = event.target.dataset.id;
  const plantName = event.target.dataset.plantName;
  const plantPrice = event.target.dataset.plantPrice;

  //------------------------------- your card section -------------------------------
  const yourCardcontainer = document.getElementById("your-card-container");
  // console.log(yourCardcontainer);
  const yourCardDiv = document.createElement("div");
  yourCardDiv.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "p-4",
    "mt-4",
    "bg-[#dcfce77d]",
  );
  yourCardDiv.innerHTML = `
                <div class="price-container">
                  <h2>${plantName}</h2>
                  <p >৳<span class="item-price">${plantPrice}</span> x 1</p>
                </div>
                <i class="fa-solid fa-xmark cross-mark" data-id="${btnId}"></i>
              `;
  yourCardcontainer.appendChild(yourCardDiv);

  // No items added yet!
  const priceContainer = document.getElementsByClassName("price-container");
  const cartPlaceholder = document.getElementById("cart-placeholder");
  if (priceContainer.length > 0) {
    cartPlaceholder.classList.add("hidden");
  }

  //------- price added in total amount --------
  const prices = document.getElementsByClassName("item-price");
  // console.log(prices);
  let sum = 0;
  for (const price of prices) {
    // console.log(price.textContent);
    const itemPrice = Number(price.textContent);
    sum = sum + itemPrice;
  }
  const totalAmound = document.getElementById("total-amound");
  // console.log(totalAmound);
  totalAmound.textContent = sum;

  //------- addEvenListener added in cross mark --------
  yourCardDiv.querySelector(".cross-mark").addEventListener("click", (e) => {
    // console.log(e.target.dataset.id);
    const crossId = e.target.dataset.id;

    //-------- price removed from total amount ---------
    const priceElement = yourCardDiv.querySelector(".item-price");
    const itemPrice = Number(priceElement.textContent);
    totalAmound.textContent = Number(totalAmound.textContent) - itemPrice;

    //------- Find the corresponding button --------
    const button = document.querySelector(
      `.card-add-btn[data-id="${crossId}"]`,
    );

    //-------- Enable it again --------
    button.disabled = false;
    button.textContent = "Add to Cart";
    button.classList.remove("bg-[#5f9d76ca]");
    button.classList.add("bg-[#15803D]", "hover:bg-[#166534]");

    //------- Remove the cart item --------
    yourCardDiv.remove();
    if (priceContainer.length === 0) {
      cartPlaceholder.classList.remove("hidden");
    }
  });
};

//--------------------------- load plants details by plant ID ----------------------------
const loadPlantsDetail = (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data.plants);
      //   displayPlantDetails(data.plants);
      //   console.log(data.plants.id);
      const plantDetails = data.plants;
      displayPlantDetails(plantDetails);
    });
};

const displayPlantDetails = (details) => {
  const modal = document.getElementById("modal");
  modal.innerHTML = "";
  const modalDiv = document.createElement("div");
  modalDiv.classList.add(
    "p-8",
    "w-[30%]",
    "bg-white",
    "rounded-2xl",
    "shadow-2xl",
  );
  modalDiv.innerHTML = `
        <div class="flex flex-col gap-2">
          <h1 class="text-xl font-bold">${details.name}</h1>
          <div>
            <img
              class="w-full h-72 object-cover"
              src="${details.image}"
              alt="Shoes"
            />
          </div>
          <p><span class="font-bold">category: </span>${details.category}</p>
          <p><span class="font-bold">price: </span>৳${details.price}</p>
          <p class="h-30">
            <span class="font-bold">description: </span>${details.description}
          </p>
        </div>

        <button
          id="close-modal"
          class="outline-none cursor-pointer font-semibold px-4 py-1 rounded-md float-right bg-gray-100 hover:bg-gray-200"
        >
          Close
        </button>
    `;
  modal.appendChild(modalDiv);
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");

  const closeBtn = document.getElementById("close-modal");
  closeBtn.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  });
};
