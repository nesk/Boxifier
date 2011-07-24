Boxifier
===

Presentation
---

A lightweight HTML5 Lightbox using CSS3 animations and supporting old web browsers.

The project _is currently in development_ ! The goal is to obtain a JS file smaller than 6Ko (and less if possible).

Installation and usage
---

To use this project on a web page, just add those two lines in your `<head>` tag :

    <style>@import url('boxifier.css');</style>
    <script src="boxifier.js"></script>

And specify the links you want to associate to Boxifier :

    <a href="fullsize.jpg" rel="boxifier">
        <img src="thumbnail.jpg" alt="Thumbnail">
    </a>

You can also create group of images :

    <a href="fullsize1.jpg" rel="boxifier[group1]">
        <img src="thumbnail1.jpg" alt="Thumbnail 1">
    </a>

    <a href="fullsize2.jpg" rel="boxifier[group2]">
        <img src="thumbnail2.jpg" alt="Thumbnail 2">
    </a>

If you add a title attribute to a link, it will be display with the image.