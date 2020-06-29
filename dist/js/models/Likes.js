export default class Likes{
    constructor(){
        this.likes=[];
    }

    addLike(id,title,author,img){
        const like={ id,title,author,img };
        this.likes.push(like);
        return like;
    }

    deleteLike(id){
        const index=this.likes.findIndex(el => el.id === id);
        this.likes.splice(index,1);
    }

    isLiked(id){                                                            //when we load the recipe to see if its already liked or not
        return this.likes.findIndex(el => el.id === id) != -1;             // if we find the id [ this.likes.findIndex(el => el.id === id) ] will return value which is not equal to -1 so it will return true
    }                                                                      // if we cannot find that id it will return -1 which is qual to -1 so it will return false

    getNumLikes(){
        return this.likes.length;
    }
}