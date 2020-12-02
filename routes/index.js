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
  
  router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/dashboard')
    res.render('show', { article: article, comment: req.body.comment, username: req.body.username })
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
  db.collection("articles").update({"_id":ObjectId(req.body.article_id)}, {
    $push: {
      "comments": {username: req.body.username, comment: req.body.comment}
    }
  }, function (error) {
    if(error) {
      console.log(error);
      return;
    } else {
      res.redirect(`/dashboard`);
    }
  });
});
  
module.exports = router;