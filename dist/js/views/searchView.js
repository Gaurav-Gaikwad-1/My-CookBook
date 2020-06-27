import { elements } from './base';

export const getInput= () => elements.searchInput.value;

export const clearInput= () => {
    elements.searchInput.value="";
}

export const clearResults = () => {
    elements.searchResList.innerHTML="";
    elements.searchResPages.innerHTML='';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })

    document.querySelector(`a[href*="#${id}"]`).classList.add('results__link--active');
}
/*  eg title= 'Pasta with Tomato and spinach'

acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta','with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta','with','Tomato']
acc: 15 / acc + cur.length = 18  / newTitle = ['Pasta','with','Tomato']
acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta','with','Tomato']

*/
export const limitRecipeTitle = (title,limit=17) => {
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc,cur) =>{                            //The reduce() method executes a reducer function (that you provide) on each element of the array, resulting in single output value.
            if(acc + cur.length <= limit){                                  //it takes 2 param 1)accumulator 2)current value  Your reducer function's returned value is assigned to the accumulator, whose value is remembered across each iteration throughout the array, and ultimately becomes the final, single resulting value.
                newTitle.push(cur);
            }
            return acc+cur.length;
        }, 0);
        //return the result
        return `${newTitle.join(' ')}...`;                                 //join method joins the array elements into 1 statement
    }
    return title;
}

const renderRecipe = (recipe) => {                                                      //here recipe_id,title,publisher is the keywords of the Api we r fetching data from
    const markup = `                                                                   
    <li>
        <a class="results__link " href="#${recipe.recipe_id} ">                          
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend',markup);                       //insertAdjHTML is used to parse html to render into DOM

}

//type = 'prev' or 'next'
const createButton = (page, type) => `                                                                                               
    <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev'? page - 1 : page + 1}>
        <span>Page ${ type === 'prev' ? page - 1 : page + 1 }</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${ type === 'prev' ? 'left' : 'right' }"></use>
        </svg>
        
    </button>
`;
 /*
                <button class="btn-inline results__btn--prev">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-left"></use>
                    </svg>
                    <span>Page 1</span>
                </button>
                <button class="btn-inline results__btn--next">
                    <span>Page 3</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>
                </button>
        */        

   

const renderButtons = (page, numResults,resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if(page === 1 && pages > 1){
        //only next button should be displayed
        button = createButton(page, 'next');
    }else if( page < pages){
        //both prev and next button to be displayed
        button = `
                 ${createButton(page, 'prev')}
                 ${createButton(page, 'next')}
                 `;
    }else if( page === pages && pages > 1){
        //only prev button should be displayed
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults = (recipes,page=1,resPerPage=10) => {
    //rendering results of current page
    const start = (page-1)*resPerPage;
    const end = page * resPerPage;
    //console.log(recipes);
    recipes.slice(start,end).forEach(renderRecipe);

    //render pagination
    renderButtons(page,recipes.length,resPerPage);
};