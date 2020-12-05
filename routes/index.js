const express = require('express');
const router = express.Router();
const { ensureAuthenticated} = require('../config/auth');
const { db } = require('./../models/article');
const Comment = require('./../models/comment');
const Article = require('./../models/article');
const ObjectId = require('mongodb').ObjectID;

//main page
router.get('/', (req, res) => res.render('welcome'));

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Article.find().then(
    (articles) => {
      // console.log(res);
      res.render('dashboard', {
        name: req.user.name,
        articles: articles
    })
    }).catch(()=>{})
})

//articles
router.get('/new', (req, res) => {
    res.render('new', { article: new Article() })
  })
  
  router.get('/:slug',  (req, res) => {
     Article.findOne({ slug: req.params.slug }).then( (article)=>{
    	if(article == null){ return res.redirect('/dashboard') }else{
	return res.render('show',{ article: article})    }
    
    }).catch((err)=>{
    	console.log(err)
    })
  })
  
  router.post('/dashboard', async (req, res, next) => {
    req.article = new Article()
    next()
  }, saveArticleAndRedirect('new'))
  
  
  function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save(function(err) {
        if(err) {
          console.log(err);
          return;
        } else {
          res.redirect(`/dashboard`)
        }
      })
        
      } catch (e) {
        res.render(`${path}`, { article: article })
      }
    }
  }

//Comments 

router.post("/:slug", function (req, res) {
  console.log(req.body.article_id)
  console.log(req.body.username)
  console.log(req.body.comment)

   db.collection("articles").updateOne({"_id":ObjectId(req.body.article_id)}, {
    $push: {
      "comments": {username: req.body.username, comment: req.body.comment}
    }
  }, function (error) {
    if(error) {
      console.log(error);
      return;
    } else {
       return res.redirect(`/`+req.params.slug);
    }
  });
});
  
module.exports = router;
