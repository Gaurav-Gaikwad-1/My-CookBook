export default class Likes{
    constructor(){
        this.likes=[];
    }

    addLike(id,title,author,img){
        const like={ id,title,author,img };
        this.likes.push(like);

        //persist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id){
        const index=this.likes.findIndex(el => el.id === id);
        this.likes.splice(index,1);

        //persist data in localStorage
        this.persistData();
    }

    isLiked(id){                                                            //when we load the recipe to see if its already liked or not
        return this.likes.findIndex(el => el.id === id) != -1;             // if we find the id [ this.likes.findIndex(el => el.id === id) ] will return value which is not equal to -1 so it will return true
    }                                                                      // if we cannot find that id it will return -1 which is qual to -1 so it will return false

    getNumLikes(){
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        //restoring likes from localStorage
        if(storage)  this.likes = storage;
    }
}