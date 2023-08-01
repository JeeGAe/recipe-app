let cardCount = 0;
let foodRecipes = [];
// api fetch
// function fetchAPI(url){
//   fetch(url)
//   .then(res => res.json())
//   .then(res => foodRecipes = res)
// }

// fetchAPI('https://www.themealdb.com/api/json/v1/1/search.php?s=egg');
// console.log(foodRecipe);


// 다크 모드
const navBar = document.querySelector('.nav-bar');
navBar.addEventListener('click', event => {
  if(event.target.className.includes('dark-mode-toggle')){
    document.body.classList.toggle('dark');
    navBar.classList.toggle('dark');
    document.querySelector('input').classList.toggle('dark');
    if(event.target.innerText.includes('off')){
      event.target.innerText = 'toggle_on';
    }else{
      event.target.innerText = 'toggle_off';
    }
  }
})

// 모달 창
const resultsContainer = document.querySelector('.results-container');
resultsContainer.addEventListener('click', event => {
  if(event.target.className === 'modal-open-btn'){
    const blurContainer = document.querySelector('.blur-container');
    blurContainer.style.display = 'block';
    document.body.style.overflow = 'hidden';
    const cardId = event.target.parentElement.parentElement.id;
    const findRecipeById = foodRecipes.meals.filter(foodRecipe => foodRecipe.idMeal === cardId);
    const modalContainer = document.querySelector('.modal-container');
    // modalContainer.innerHTML = '';
    modalContainer.classList.add('show');
    modalContainer.innerHTML = `
        <div class="modal-close-btn-container">
          <span class="material-symbols-outlined">
              close
          </span>
        </div>
        <h3>${findRecipeById[0].strMeal}</h3>
        <button>${findRecipeById[0].strCategory}</button>
        <h4>Instructions:</h4>
        <p>${findRecipeById[0].strInstructions}</p>
        <div class="modal-img-container">
            <img src="${findRecipeById[0].strMealThumb}" alt="">
        </div>
        <a href="${findRecipeById[0].strYoutube}">Watch Video</a>
    `;
    return modalContainer.querySelector('.modal-close-btn-container').addEventListener('click', () => {
      modalContainer.classList.remove('show');
      document.body.style.overflow = '';
      blurContainer.style.display = 'none';
    })
  }
})


// 무한 스크롤
function calculateScrollHeight(){
  return Math.max(
  document.body.scrollHeight, document.documentElement.scrollHeight,
  document.body.offsetHeight, document.documentElement.offsetHeight,
  document.body.clientHeight, document.documentElement.clientHeight
  );
}
// 카드 생성
function createRecipeCard(foodRecipe){
  console.log(foodRecipe);
  const resultCard = document.createElement('article');
  resultCard.classList.add('result-card');
  resultCard.classList.add('bottom');
  resultCard.id = foodRecipe.idMeal;
  resultCard.innerHTML = `
      <div class="food-img-container">
        <img src="${foodRecipe.strMealThumb}" alt="">
      </div>
      <div class="food-content-container">
      <h3>${foodRecipe.strMeal}</h3>
      <button class="modal-open-btn">Get Recipe</button>
      </div>
  `
  setTimeout(() => resultCard.classList.remove('bottom'), 100);
  resultsContainer.appendChild(resultCard);
}

const searchInput = document.querySelector('input');
searchInput.addEventListener('keyup', event =>{
  let keyword = event.target.value;
  if(event.key === 'Enter'){
    if(keyword !== ''){
      resultsContainer.innerHTML = '';
      cardCount = 0;
      foodRecipes = [];
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`)
      .then(res => res.json())
      .then(res => foodRecipes = res)
      .then(res => {
        // 스크롤 바가 생길때까지 카드 생성
        let scrollHeight = calculateScrollHeight();
        let clientHeight = document.documentElement.clientHeight;
        while(scrollHeight <= clientHeight && cardCount < foodRecipes.meals.length){
          createRecipeCard(foodRecipes.meals[cardCount]);
          scrollHeight = calculateScrollHeight();
          cardCount++;
        }
        if(foodRecipes.meals.length - cardCount > 0 && cardCount === 4){
          for(let i = 0; i < 2; i++){
            if(foodRecipes.meals.length <= cardCount){
              break;
            }else{
              createRecipeCard(foodRecipes.meals[cardCount]);
              cardCount++;
            }
          }
        }else if(foodRecipes.meals.length - cardCount > 0 && cardCount === 3){
          createRecipeCard(foodRecipes.meals[cardCount]);
          cardCount++;
        }
      })
    }
  }
})

const SearchBtn = document.querySelector('.search-container button span');
SearchBtn.addEventListener('click', event =>{
  let keyword = event.target.parentElement.previousElementSibling.value;
  if(keyword !== ''){
    resultsContainer.innerHTML = '';
    cardCount = 0;
    foodRecipes = [];
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`)
    .then(res => res.json())
    .then(res => foodRecipes = res)
    .then(res => {
      // 스크롤 바가 생길때까지 카드 생성
      let scrollHeight = calculateScrollHeight();
      let clientHeight = document.documentElement.clientHeight;
      while(scrollHeight === clientHeight && cardCount < foodRecipes.meals.length){
        createRecipeCard(foodRecipes.meals[cardCount]);
        scrollHeight = calculateScrollHeight();
        cardCount++;
      }
      if(foodRecipes.meals.length - cardCount > 0 && cardCount === 4){
        for(let i = 0; i < 2; i++){
          if(foodRecipes.meals.length <= cardCount){
            break;
          }else{
            createRecipeCard(foodRecipes.meals[cardCount]);
            cardCount++;
          }
        }
      }else if(foodRecipes.meals.length - cardCount > 0 && cardCount === 3){
        createRecipeCard(foodRecipes.meals[cardCount]);
        cardCount++;
      }
    })
  }
})

window.addEventListener('scroll', event => {
  let scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
    );
  if((window.pageYOffset + document.documentElement.clientHeight) > (scrollHeight - 10)){
    if(cardCount < foodRecipes.meals.length){
      if(document.documentElement.clientWidth >= 820){
        for(let i = 0; i < 3; i++){
          if(foodRecipes.meals.length <= cardCount){
            break;
          }else{
            createRecipeCard(foodRecipes.meals[cardCount]);
            cardCount++;
          }
        }
      }else if(document.documentElement.clientWidth < 820 && document.documentElement.clientWidth > 420){
        for(let i = 0; i < 2; i++){
          if(foodRecipes.meals.length <= cardCount){
            break;
          }else{
            createRecipeCard(foodRecipes.meals[cardCount]);
            cardCount++;
          }
        }
      }else{
        createRecipeCard(foodRecipes.meals[cardCount]);
            cardCount++;
      }
      
    }
  }
})
