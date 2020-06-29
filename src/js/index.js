import Search from '../../dist/js/models/Search';
import { elements,renderLoader,clearLoader } from '../../dist/js/views/base';
import * as searchView from '../../dist/js/views/searchView';
import * as recipeView from '../../dist/js/views/recipeView';
import * as listView from '../../dist/js/views/listView';
import * as likesView from '../../dist/js/views/likesView';
import Recipe from '../../dist/js/models/Recipe';
import List from '../../dist/js/models/List';
import Likes from '../../dist/js/models/Likes';


/** global state of app
 * -Search object
 * -liked items
 * -current recipe object
 * -Shopping list objects
 * 
 */

 const state={}; 
 window.state=state;                                                                //we keep this empty so that when we reload the page the state should be empty

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
            searchView.renderResults(state.search.result);               //results -> result
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
        searchView.renderResults(state.search.result, goToPage);             //results -> result
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
                
            state.recipe.parseIngredients();

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServing();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        }catch(err){
            console.log(err);
            alert('something went wrong');
        }
      
             
    }
}
// window.addEventListener('hashchange',controlRecipe);
// window.addEventListener('load',controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));


/**
  * List Controller
*/

const controlList = () => {
    //create a new list if there is none yet
    if(!state.list) state.list = new List();

    //add each ingredient to list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    });
}

//handle delete and update list item events

elements.shopping.addEventListener('click',e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete,.shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);

        //delete from UI
        listView.deleteItem(id);

        //handles the count update on recipes ingredients 
    } else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10);            //e.target.value fetches the clicked count & changes

        state.list.updateCount(id,val);
    }
});


/**
  * Like Controller
*/
//testing
state.likes = new Likes();
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;

    //user has NOT liked current recipe yet
    if(!state.likes.isLiked(currentId)){
        //Add like to state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        
        //toggle the like button
        likesView.toggleLikeBtn(true);

        //add like to UI list
        likesView.renderLike(newLike);
    // user has liked current recipe 
    } else{
        //remove like from state
        state.likes.deleteLike(currentId);

        //toggle like button
        likesView.toggleLikeBtn(false);

        //remove like itemn from UI
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//handling recipe button clicks
elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
          //decrease btn is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        //decrease btn is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        //add ingredients to shopping list
        controlList();
    } else if(e.target.matches('.recipe__love','.recipe__love *')){
        //like controller
        controlLike();
    }
    
});

window.l = new List();


