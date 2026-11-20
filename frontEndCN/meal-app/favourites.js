// Select the elements from the page
const mealContainer = document.getElementById("meal-container");
const message = document.getElementById("message");


// Get favourite meals from local storage
function getFavourites() {
    const savedMeals = localStorage.getItem("favouriteMeals");

    if (savedMeals) {
        return JSON.parse(savedMeals);
    }

    return [];
}


// Remove a meal from favourites
function removeFavourite(mealId) {
    const favouriteMeals = getFavourites();

    // Keep all meals except the selected meal
    const remainingMeals = favouriteMeals.filter(function (meal) {
        return meal.idMeal !== mealId;
    });

    // Save the updated list
    localStorage.setItem(
        "favouriteMeals",
        JSON.stringify(remainingMeals)
    );

    // Show the updated list
    displayFavourites();
}


// Display all favourite meals
function displayFavourites() {
    const favouriteMeals = getFavourites();

    // Clear the existing meals
    mealContainer.innerHTML = "";

    // Show a message if there are no favourite meals
    if (favouriteMeals.length === 0) {
        message.textContent =
            "You haven't added any favourite meals yet. Search for a meal to get started.";

        return;
    }

    // Clear the message when favourite meals are available
    message.textContent = "";

    // Create a card for each favourite meal
    favouriteMeals.forEach(function (meal) {

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

        // Create the remove button
        const button = document.createElement("button");
        button.className = "button button-remove";
        button.type = "button";
        button.textContent = "Remove from Favourites";

        // Remove the meal when the button is clicked
        button.addEventListener("click", function () {
            removeFavourite(meal.idMeal);
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


// Display favourite meals when the page opens
displayFavourites();