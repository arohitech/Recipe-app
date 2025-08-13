let search = document.getElementById("search");
let searchBtn = document.getElementById("searchButton");
let recipeContainer = document.querySelector(".recipe-container");
let recipedetailscontent = document.querySelector(".recipe-details-content");
let closeBtn = document.querySelector(".close-button");

function openrecipepopup(meal){
    recipedetailscontent.innerHTML = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <h3>ingredients:</h3>
    <ul class="recipe-ingredients">${fetchingredients(meal)}</ul>
    <div class="recipe-instructions">
    <h3>instructions:</h3>
    <p>${meal.strInstructions}</p>
    </div>`

    recipedetailscontent.parentElement.style.display = "block";
}

function fetchingredients(meal){
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        
        if (ingredient) {
            let measure = meal[`strMeasure${i}`];
            ingredients += `<li>${ingredient} - ${measure}</li>`;
        }else{
            break; // Stop if no more ingredients
        }
    }
    return ingredients;
}


searchBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!search.value.trim()) {
        alert("Please enter a search term.");
        return;
    }
    console.log("Button clicked");
    await fetchRecipe(search.value.trim());

});

async function fetchRecipe(searchValue) {
    recipeContainer.innerHTML = "<p>Loading...</p>"; // Show loading message
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
    try {
        let response =  await axios.get(url);
        let data = response.data;
        console.log(data);

        recipeContainer.innerHTML = ""; // Clear previous results

        if (data.meals) {
        data.meals.forEach(meal => {
        let recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> dish</p>
            <p>belongs to <span>${meal.strCategory}</span> category</p>
        
        `
        const Button = document.createElement("button");
        Button.textContent = "View Recipe";
        recipeDiv.appendChild(Button);
        
        Button.addEventListener("click", () => {
            openrecipepopup(meal);
        });

        recipeContainer.appendChild(recipeDiv);
        closeBtn.addEventListener("click", () => {
            recipedetailscontent.parentElement.style.display = "none";

    });
        });
        }else{
          recipeContainer.innerHTML = "<p>No recipes found.</p>";
     }
       }catch (error) {
    console.error("Error fetching recipes:", error);
    recipeContainer.innerHTML = "<p>Error fetching recipes. Please try again later.</p>";
    }

}
