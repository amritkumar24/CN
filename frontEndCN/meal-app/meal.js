// Select the elements from the page
const mealDetails = document.getElementById("meal-details");
const message = document.getElementById("message");


// Get the meal ID from the page URL
const parameters = new URLSearchParams(window.location.search);
const mealId = parameters.get("id");


// Load the selected meal
async function loadMeal() {

    // Check if the meal ID is valid
    if (!mealId || !/^\d+$/.test(mealId)) {
        message.textContent =
            "This meal ID is invalid. Please return to the home page.";

        return;
    }

    try {
        // Get meal data from the API
        const apiUrl =
            "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" +
            encodeURIComponent(mealId);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Request failed");
        }

        const data = await response.json();

        // Check if the meal was found
        if (!data.meals || data.meals.length === 0) {
            message.textContent =
                "Meal not found. Please return to the home page.";

            return;
        }

        const meal = data.meals[0];

        // Create the main layout
        const layout = document.createElement("div");
        layout.className = "detail-layout";

        // Create the meal image
        const image = document.createElement("img");
        image.className = "detail-image";
        image.src = meal.strMealThumb;
        image.alt = meal.strMeal;

        // Create a container for the meal information
        const content = document.createElement("div");

        // Create the label
        const label = document.createElement("p");
        label.className = "eyebrow";
        label.textContent = "MEAL DETAILS";

        // Create the meal name
        const title = document.createElement("h1");
        title.className = "detail-title";
        title.textContent = meal.strMeal;

        // Create the category and area
        const meta = document.createElement("p");
        meta.className = "detail-meta";
        meta.textContent = [meal.strCategory, meal.strArea]
            .filter(Boolean)
            .join(" · ");

        // Create the instructions heading
        const heading = document.createElement("h2");
        heading.textContent = "Instructions";

        // Create the instructions
        const instructions = document.createElement("p");
        instructions.className = "instructions";
        instructions.textContent =
            meal.strInstructions || "No instructions available.";

        // Add the information to the content container
        content.appendChild(label);
        content.appendChild(title);
        content.appendChild(meta);
        content.appendChild(heading);
        content.appendChild(instructions);

        // Add the image and content to the layout
        layout.appendChild(image);
        layout.appendChild(content);

        // Show the layout on the page
        mealDetails.appendChild(layout);

        // Clear the loading message
        message.textContent = "";

        // Update the browser tab title
        document.title = meal.strMeal + " | Meal App";

    } catch (error) {
        message.textContent =
            "Could not load meal details. Please check your connection and try again.";
    }
}


// Load the meal when the page opens
loadMeal();