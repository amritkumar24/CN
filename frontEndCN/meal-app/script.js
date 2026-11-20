// Select the elements from the page
const searchInput = document.getElementById("search-input");
const mealContainer = document.getElementById("meal-container");
const message = document.getElementById("message");

// Keep track of the search timer and latest search
let searchTimer;
let latestSearch = 0;


// Get favourite meals from local storage
function getFavourites() {
    const savedMeals = localStorage.getItem("favouriteMeals");

    if (savedMeals) {
        return JSON.parse(savedMeals);
    }

    return [];
}


// Add a meal to favourites
function addToFavourites(meal, button) {
    const favouriteMeals = getFavourites();

    // Check if the meal is already saved
    const alreadySaved = favouriteMeals.some(function (item) {
        return item.idMeal === meal.idMeal;
    });

    if (!alreadySaved) {
        // Save the details needed for the favourites page
        const favouriteMeal = {
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb
        };

        favouriteMeals.push(favouriteMeal);

        localStorage.setItem(
            "favouriteMeals",
            JSON.stringify(favouriteMeals)
        );
    }

    // Update the button
    button.textContent = "Added to Favourites";
    button.disabled = true;
}


// Display meals returned by the API
function displayMeals(meals) {
    // Clear the previous results
    mealContainer.innerHTML = "";

    const favouriteMeals = getFavourites();

    // Create a card for each meal
    meals.forEach(function (meal) {

        // Create the card
        const card = document.createElement("article");
        card.className = "meal-card";

        // Create a link to the meal details page
        const link = document.createElement("a");
        link.className = "meal-link";
        link.href = "meal.html?id=" + encodeURIComponent(meal.idMeal);

        // Create the meal image
        const image = document.createElement("img");
        image.src = meal.strMealThumb;
        image.alt = meal.strMeal;

        // Create the meal name
        const name = document.createElement("h3");
        name.textContent = meal.strMeal;

        // Add the image and name to the link
        link.appendChild(image);
        link.appendChild(name);

        // Create a container for the button
        const actions = document.createElement("div");
        actions.className = "card-actions";

        // Create the favourite button
        const button = document.createElement("button");
        button.className = "button";
        button.type = "button";

        // Check if this meal is already in favourites
        const alreadySaved = favouriteMeals.some(function (item) {
            return item.idMeal === meal.idMeal;
        });

        if (alreadySaved) {
            button.textContent = "Added to Favourites";
            button.disabled = true;
        } else {
            button.textContent = "Add to Favourites";
        }

        // Add the meal when the button is clicked
        button.addEventListener("click", function () {
            addToFavourites(meal, button);
        });

        // Add the button to its container
        actions.appendChild(button);

        // Add the link and button container to the card
        card.appendChild(link);
        card.appendChild(actions);

        // Add the card to the page
        mealContainer.appendChild(card);
    });
}


// Search for meals using the API
async function searchMeals(searchText, searchNumber) {
    try {
        const apiUrl =
            "https://www.themealdb.com/api/json/v1/1/search.php?s=" +
            encodeURIComponent(searchText);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Request failed");
        }

        const data = await response.json();

        // Ignore results from an older search
        if (searchNumber !== latestSearch) {
            return;
        }

        // Show a message if no meals were found
        if (!data.meals) {
            message.textContent = "No meals found. Try another search.";
            return;
        }

        // Display the matching meals
        message.textContent = "";
        displayMeals(data.meals);

    } catch (error) {
        // Ignore errors from an older search
        if (searchNumber !== latestSearch) {
            return;
        }

        message.textContent =
            "Could not load meals. Please check your connection and try again.";
    }
}


// Search when the user types
searchInput.addEventListener("input", function () {
    // Cancel the previous timer
    clearTimeout(searchTimer);

    latestSearch++;

    const searchNumber = latestSearch;
    const searchText = searchInput.value.trim();

    // Clear the previous results
    mealContainer.innerHTML = "";

    // Show a message if the search box is empty
    if (!searchText) {
        message.textContent = "Start typing to discover meals.";
        return;
    }

    message.textContent = "Searching for meals...";

    // Wait briefly before searching
    searchTimer = setTimeout(function () {
        searchMeals(searchText, searchNumber);
    }, 300);
});