const express      = require('express');
const reviewRouter = express.Router();
const Book         = require('../models/book');


reviewRouter.get('/books/:id/reviews/new', (req, res, next)=>{
    Book.findById(req.params.id)
    .then((theBook)=>{
        res.render('addReview', {book: theBook})
    })
    .catch((daError)=>{
        next(daError)
     })
});


reviewRouter.post('/books/:id/reviews/create', (req, res, next)=>{
    // const theReview = {reviewer: req.body.reviewer, content: req.body.content};
    // const theReview = req.body;
                            //first argument is ID of thing you want to find
     //                        |           second argument is the update you want to run
     //                        |                            |
    Book.findByIdAndUpdate(req.params.id,       {$push: {reviews: req.body}})
    .then((response)=>{

        res.redirect(`/books/${req.params.id}`)
    })
    .catch((err)=>{
        next(err);
    })
});


reviewRouter.post('/books/:id/reviews/delete/:reviewIndex', (req, res, next)=>{
    const bookID = req.params.id;
    const reviewIndex = req.params.reviewIndex;
    Book.findById(bookID)
    .then((theBookThatImEditing)=>{
        theBookThatImEditing.reviews.splice(reviewIndex, 1);
        // theBookThatImEditing.review[reviewIndex] = {reviewer: "me", content: "waaaahhhhh"}
        //this ^ would be one way to edit a particular review
        theBookThatImEditing.save()
            .then((x)=>{
                res.redirect('/books/'+bookID)
            })
            .catch((err)=>{
                next(err)
            })
        })
    .catch((err)=>{
        next(err);
    })

})











module.exports = reviewRouter;