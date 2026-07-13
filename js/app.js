console.log("App.js loaded");
console.log("App Loaded");
console.log(tools);
const compareBtn = document.getElementById("compare-btn");
const compareModal = document.getElementById("compare-modal");
const closeModal = document.getElementById("close-modal");
const comparisonContent = document.getElementById("comparison-content");
const toolsContainer = document.getElementById("tools-container");
const searchInput = document.getElementById("search-input");
const categoryCards = document.querySelectorAll(".category-card");
const sortSelect = document.getElementById("sort-select");
const themeBtn = document.getElementById("theme-btn");

let currentSearch = "";
let currentCategory = "All";
let currentSort = "default";
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
let compareList = [];

themeBtn.addEventListener("click", function(){
    document.body.classList.toggle("dark");
});

function displayTools(toolArray){
    toolsContainer.innerHTML = "";
    toolArray.forEach(function(tool){
        const card = `
        <div class="tool-card">
        <div class="card-top">
            
        <button class="favourite-btn" data-id="${tool.id}"> ${favourites.includes(tool.id) ? "❤️" :"🤍"}</button>
        </div>
        <label class="compare-label">
        <input
        type="checkbox"
        class="compare-checkbox"
        data-id="${tool.id}">Compare </label>
        <img src="${tool.logo}" alt="${tool.name}" class="tool-logo">
        <h3>${tool.name}</h3>
        <p class="rating">⭐${tool.rating}</p>
        <p>${tool.description}</p>
        <span class="category-tag">${tool.category}</span>
        <br><br>
        <a href="${tool.website}" target= "_blank" class="visit-btn">Visit Website</a>
        </div>
        `;
        toolsContainer.innerHTML += card;
    });
}
displayTools(tools);

function updateDisplay(){
    let filteredTools = [...tools];
    if(currentSearch !== ""){
        filteredTools = filteredTools.filter(function(tool){
            return tool.name.toLowerCase().includes(currentSearch);
        });
    }
}


searchInput.addEventListener("input", function(){
   currentSearch = searchInput.value.toLowerCase();
   updateDisplay();
});
if(currentCategory !== "All"){
    filteredTools = filteredTools.filter(function(tool){
        return tool.category ===currentCategory;
    });
}
if(currentSort === "rating"){
    filteredTools.sort(function(a, b){
        return b.rating - a.rating;
    });
}
if(currentSort==="name"){
    filteredTools.sort(function(a,b){
        return a.name.localeCompare(b.name);
    });
}
categoryCards.forEach(function(card){
    card.addEventListener("click", function(){
        categoryCards.forEach(function(category){
            category.classList.remove("active");
        });

       
        card.classList.add("active");
       currentCategory = card.dataset.category;
        updateDisplay();
    
    });
});

toolsContainer.addEventListener("click", function(event){
    if (event.target.classList.contains("favourite-btn")){
        const toolId = Number(event.target.dataset.id);
        if(favourites.includes(toolId)){
            favourites = favourites.filter(function(id){
                return id !== toolId;
            });
        event.target.textContent = "🤍";
        }
        else {
            favourites.push(toolId);
            event.target.textContent = "❤️";
        }
        console.log(favourites);
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }

    if(event.target.classList.contains("compare-checkbox")){
        const toolId = Number(event.target.dataset.id);
        if(event.target.checked){
            compareList.push(toolId);
        }
        else{
            compareList = compareList.filter(function(id){
                return id !== toolId;
            });
        }
        console.log(compareList);
    }
});

sortSelect.addEventListener("change", function(){
            let sortedTools = [...tools];

           currentSort=sortSelect.value;
            updateDisplay();
});



       compareBtn.addEventListener("click", function(){
        if(compareList.length ==0){
            comparisonContent.innerHTML = "<p>Please select at least one tool.</p>";
        }
       
        else{
             const selectedTools = compareList.map(function(id){
            return tools.find(function(tool){
                return tool.id ===id;
            });
        });
            let html = `
            <table class="compare-table">
                <tr>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Rating</th>
                    <th>category</th>
                    <th>Website</th>
                </tr>
                `;
    
    selectedTools.forEach(function(tool){
        html += `
        <tr>
            <td><img src ="${tool.logo}" class="compare-logo"></td>
            <td>${tool.name}</td>
            <td>⭐ ${tool.rating}</td>
            <td>${tool.category}</td>
            <td>
                <a href ="${tool.website}"
            target="_blank">
            Visit
                </a>
                    </td>
            </tr>
            `;
    });
           html += "</table>";
           comparisonContent.innerHTML = html;
        }
       
    compareModal.style.display = "flex";
});

closeModal.addEventListener("click", function(){
    compareModal.style.display = "none";
});

window.addEventListener("scroll", function(){
    const nav = document.querySelector("nav");
    if(window.scrollY>20){
        nav.classList.add("nav-scrolled");
    }
    else{
        nav.classList.remove("nav-scrolled");
    }
});