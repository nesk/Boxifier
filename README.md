## What is Boxifier?

A lightweight HTML5 Lightbox using CSS3 animations and supporting old web browsers. No jQuery needed.

The project _is currently in development_ ! The goal is to obtain a JS file smaller than 6Ko (and less if possible).

Currently, the main functions are finished, but some parts of the script are bugged so please _be careful_ if you want to use Boxifier! Remember to check this page (https://github.com/riespandi/Boxifier/issues) to know the current issues.

See the demo [here](http://arissh.com/collage/)


## Installation and usage

To use this project on a web page, just add those five lines in your `<head>` tag :

```html
<!--[if lt IE 9]><link rel="stylesheet" href="css/boxifier_ie.css"><![endif]-->
<link rel="stylesheet" href="css/boxifier.css">
<script src="js/boxifier.js"></script>
```

And specify the links you want to associate to Boxifier (Lightbox2 syntax is also supported) :

```html
<a href="fullsize.jpg" rel="boxifier"><img src="thumbnail.jpg" alt="Thumbnail"></a>
```

You can also create groups of images :

```html
<a href="fullsize1.jpg" rel="boxifier[group1]"><img src="thumbnail1.jpg" alt="Thumbnail 1"></a>

<a href="fullsize2.jpg" rel="boxifier[group2]"><img src="thumbnail2.jpg" alt="Thumbnail 2"></a>
```

If you add a title attribute to a link, it will be displayed at the bottom of the image.

## Changelog

__06/06/2013__
- fix: fixed image size, auto resizing when image size > screen size
- mod: create rounded for viewer
- fix: image_viewer position fixed by set z-index: 999;
