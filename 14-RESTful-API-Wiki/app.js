//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const port = 3000;




const articleSchema = {
    title: String,
    content: String,
}

const Article = mongoose.model('Article', articleSchema);


// requests targeting all articles

app.route('/articles')
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        });

        newArticle.save((err) => {
            if (!err) {
                res.send('Successfully added a new article.');
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send('Successfully deleted all articles');
            } else {
                res.send(err);
            }
        });
    });


// requests targeting a specific article

app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send('No articles matching that title was found.');
            }
        });
    })
    .put((req, res) => {
        Article.update({
            title: req.params.articleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, {
            overwrite: true
        }, (err) => {
            if (!err) {
                res.send('Successfully updated article.');
            }
        })
    })
    .patch((req, res) => {
        Article.update({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            (err) => {
                if (!err) {
                    res.send('Successfully updated article.');
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete((req, res) => {
        Article.deleteOne({
            title: req.params.articleTitle
        }, (err) => {
            if (!err) {
                res.send('Successfully deleted the corresponding article.');
            } else {
                res.send(err);
            }
        })
    });


app.listen(port, () => {
    console.log(`The server has started on port ${port}`);
});