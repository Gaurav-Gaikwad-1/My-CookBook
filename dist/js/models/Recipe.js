import axios from 'axios';

export default class Recipe {
    constructor(id){
        this.id=id;
    }
    
    async getRecipe(){
        try{
            const res= await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url= res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }catch(error){
            console.log(error);
            alert('something went wrong');
        }      
    }
    
    calcTime(){                                                      //to display cooking time
        // assuming that we need 15 min for each 3 ingredients
        const numOfIng = this.ingredients.length;      //here ingredients is array
        const periods = numOfIng / 3;
        this.time = periods;
    }

    calcServing(){
        this.servings=4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];   //to change this names by
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];                                     // by this names
        const units = [...unitsShort,'kg','g'];
        
        const newIngredients = this.ingredients.map(el => {
            //1. Uniform Units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2. Remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3.parse ingredients into cpont,unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;
            if(unitIndex > -1){
                //there is a unit
                //ex. 4 1/2 cups, arrCount is [4, 1/2]
                //ex. 4 cups, arrcount is [4]
                const arrCount = arrIng.slice(0, unitIndex);  

                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-','+'));
                }else {
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
                  
            } else if (parseInt(arrIng[0], 10)) {
                //There is No unit ,but 1st element is number
                objIng = {
                    count:parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            } else if (unitIndex === -1) {
                //there is no iunit, and no number in 1st position
                objIng = {
                    count:1,
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }
}         
