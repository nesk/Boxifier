# Boxifier

## Presentation

A lightweight HTML5 Lightbox using CSS3 animations and supporting old web browsers.

The project _is currently in development_ ! The goal is to obtain a JS file smaller than 6Ko (and less if possible).

Currently, the main functions are finished, but some parts of the script are bugged so please _be careful_ if you want to use Boxifier! Remember to check this page (https://github.com/Nesk/Boxifier/issues) to know the current issues.

## Installation and usage

To use this project on a web page, just add those five lines in your `<head>` tag :

```html
<!--[if lt IE 9]>
  <style>@import url('boxifier_ie.css');</style>
<![endif]-->
<style>@import url('boxifier.css');</style>
<script src="boxifier.js"></script>
```

And specify the links you want to associate to Boxifier (Lightbox2 syntax is also supported) :

```html
<a href="fullsize.jpg" rel="boxifier">
    <img src="thumbnail.jpg" alt="Thumbnail">
</a>
```

You can also create groups of images :

```html
<a href="fullsize1.jpg" rel="boxifier[group1]">
    <img src="thumbnail1.jpg" alt="Thumbnail 1">
</a>

<a href="fullsize2.jpg" rel="boxifier[group2]">
    <img src="thumbnail2.jpg" alt="Thumbnail 2">
</a>
```

If you add a title attribute to a link, it will be displayed at the bottom of the image.