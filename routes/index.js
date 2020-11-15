const express = require('express');
const router = express.Router();
const { ensureAuthenticated} = require('../config/auth');
const Article = require('../models/article');

//main page
router.get('/', (req, res) => res.render('welcome'));

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Article.find().then(
    (articles) => {
      console.log(res);
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
    if (article == null) res.redirect('/')
    res.render('show', { article: article })
  })
  
  router.post('/', async (req, res, next) => {
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
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
      } catch (e) {
        res.render(`${path}`, { article: article })
      }
    }
  }

module.exports = router;