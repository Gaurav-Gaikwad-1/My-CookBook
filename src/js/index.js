import Search from '../../dist/js/models/Search';
import { elements,renderLoader,clearLoader } from '../../dist/js/views/base';
import * as searchView from '../../dist/js/views/searchView';
import * as recipeView from '../../dist/js/views/recipeView';
import Recipe from '../../dist/js/models/Recipe';

/** global state of app
 * -Search object
 * -liked items
 * -current recipe object
 * -Shopping list objects
 * 
 */

 const state={};                                                                  //we keep this empty so that when we reload the page the state should be empty

 const controlSearch = async()=>{
     //1.Get query from view
     const query=searchView.getInput();
    
    

     if(query){
         //2.New Search object and to the state
         state.search = new Search(query);                                       //search is now instance of class Search .here call is given to Search class and data is fetched 
                                                                                 //and result is stored in search
         //3.prepare UI TO RESULTS
         searchView.clearInput();                                               //to clear search field after getting Results
         searchView.clearResults();
         renderLoader(elements.searchRes);                                             //to clear results of previous search Result for new Search
        try{
            //4.search for recipes
            await state.search.getResults();                                        //using search instance now we can call getResults() method

            //5.render it on UI
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch(err){
            alert('something went wrong');
            clearLoader();
        }
     }
 
}
elements.searchForm.addEventListener('submit',e =>{
    e.preventDefault();
    controlSearch();
});

window.addEventListener('load',e =>{
    e.preventDefault();
    controlSearch();
});
    
elements.searchResPages.addEventListener('click',e => {
    const btn = e.target.closest('.btn-inline');
    
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);  
        searchView.clearResults();                    //we convert it into Int bcoz btn.dataset.goto gives string and 10 is for base for decimal no if we us 2 then it will be binary 0 & 1
        searchView.renderResults(state.search.results, goToPage);
        //console.log(goToPage);
        // searchView.clearResults();
    }
});
  
     
 /**
  * RECIPE CONTROLLER
  */
  
const controlRecipe = async() => {
    //window.location gives url from which .hash returns hash id;
    const id = window.location.hash.replace('#','');                 //we dont want hash symbol so replaces it with nothing
    console.log(id);

    if(id){
        //prepare UI for changes 
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        //highlight selected search item
        if(state.search)
             searchView.highlightSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);
      
         try{
            //get recipe data & parse ingredients 
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServing();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        }catch(err){
            alert('something went wrong');
        }
      
             
    }
}
// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load',controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));


