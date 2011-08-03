/*

Todo :
- Include the scroll in the position of the viewer element
- Support IE7 and above
- Support links without images

*/

(function() {

  /*** Misc ***/
  
    // See this page for more informations on the one line code below : https://gist.github.com/1031421
    var transitionsSupported = (function(a,b){a=document.body.style;b='ransition';return't'+b in a||'webkitT'+b in a||'MozT'+b in a||'OT'+b in a})();
    
    function addEvent(el, type, func) {
    
      if(el.attachEvent) {
        el.attachEvent('on'+type, func);
      } else {
        el.addEventListener(type, func, false);
      }
    
    }

    function addTransitionEvent(el, func) {
      
      var engines = ['webkitTransitionEnd', 'OTransitionEnd', 'transitionend'];

      for(var i = 0, engine ; engine = engines[i++] ;) {
        el.addEventListener(engine, func, false);
      }

    }
  
  
  /*** Viewer object ***/
  
  /*
  
    Constructor :
      Viewer([Group grp1, ImageB img1, Group grp2, ImageB img2, ...])
    
    Public attributes :
      displayed
      currentImg
    
    Public methods :
      open(ImageB img)
      close()
      previous()
      next()
      changeImg(ImageB img)
      alterSize(Object style)
  
  */
  
    function Viewer(objs) {
      
      var objRef = this;
      
      // HTML
        this.boxifier = document.createElement('div');
        this.boxifier.className = 'boxifier';
        this.boxifier.innerHTML = '<div class="box_overlay"></div><div class="box_viewer"><div class="box_left_arrow"><div></div></div><div class="box_right_arrow"><div></div></div><div class="box_title"></div></div>';
        document.body.appendChild(this.boxifier);
        
        this.overlay = this.boxifier.firstChild;
        this.viewer = this.boxifier.lastChild;
        this.leftArrow = this.viewer.firstChild;
        this.rightArrow = this.viewer.childNodes[1];
        this.title = this.viewer.lastChild;
        
        this.viewerSize = document.getElementsByTagName('head')[0].appendChild(document.createElement('style'));

        this.loading = new Loading(this.viewer);
      
      // Core
        this.currentImg = {};
        this.onTransitionEnd = function(){};
      
        for(var i = 0, obj ; obj = objs[i++] ;) {
          obj.parentViewer = this;
        }
      
      // Events
        addEvent(this.overlay, 'click', function() {
          objRef.close();
        });

        addEvent(this.leftArrow, 'click', function() {
          objRef.previous();
        });

        addEvent(this.rightArrow, 'click', function() {
          objRef.next();
        });
        
        addEvent(window, 'keydown', function(e) {
          e.keyCode == 37 && objRef.previous();
          e.keyCode == 39 && objRef.next();
          e.keyCode == 27 && objRef.close();
        });

        addTransitionEvent(this.viewer, function() {
          objRef.onTransitionEnd();
          objRef.onTransitionEnd = function(){};
        });
    
    }
    
    var v = Viewer.prototype;
    
    v.open = function(img) {
      
      if(!this.displayed) { // If the viewer is displayed, we just have to change the image
      
        this.displayed = true;
        this.thumbnailMode = true;
        
        // Preparing Viewer
          var viewer = this.viewer,
              thumb = img.getThumbDetails();
          
          this.alterSize(
            thumb.top - 1,
            thumb.left - 1,
            thumb.width,
            thumb.height
          );

          this.manageControls(false, false, false);
          
          viewer.className = 'box_viewer';
          this.boxifier.style.display = 'block';

          /*
            Stupid Opera, this browser executes the animations even if the element is in display none.
            Must use a class to activate/deactive animations, see the three lines below :
          */
          
            setTimeout(function(){
              viewer.className = 'box_viewer box_viewer_anim';
            }, 0);

        
        // Checking image
          if(!img.loaded) {
            img.load(true);
            this.loading.style.display = 'block';
            return;
          }
      
      }
      
      // Displaying image
        this.changeImg(img);
    
    };
    
    v.close = function() {
    
      this.displayed = false;
      this.currentImg = -1;
      
      var viewer = this.viewer,
          imgs = viewer.getElementsByTagName('img');

      for(var i = 0, img ; img = imgs[i++] ;) {
        viewer.removeChild(img);
      }
      
      this.boxifier.style.display = 'none';
    
    };
    
    v.changeImg = function(img, delayApplied) {

      if(!delayApplied) { // Opera fix condition...

        var objRef = this;

        setTimeout(function() {
          objRef.changeImg(img, true);
        }, 0);

        return;

      }

      if(this.displayed && img) {
      
        var objRef = this,
            viewer = this.viewer,
            imgs = viewer.getElementsByTagName('img'),
            imgsLen = imgs.length,
            oldImg, newImg = document.createElement('img');


        this.loading.style.display = img.loaded ? 'none' : 'block';

        if(imgsLen) { // Step 1 : Hide the previous image.
          
          oldImg = imgs[imgs.length - 1];
          oldImg.style.opacity = 0;

          addTransitionEvent(oldImg, function() {
            viewer.removeChild(oldImg);
            objRef.changeImg(img);
          });

          this.manageControls(false, false, false);

        }

        else if(img.loaded && (this.thumbnailMode || img != this.currentImg)) { // Step 2 : Adapt viewer size.

          this.thumbnailMode = false;
          this.currentImg = img;
          img.parentGroup && img.parentGroup.replaceCursorOn(img);

          var viewerStyle = viewer.currentStyle || getComputedStyle(viewer, null),
              maxImgWidth = this.overlay.offsetWidth - 100,
              maxImgHeight = this.overlay.offsetHeight - 100,
              imgWidth = img.imgObj.width,
              imgHeight = img.imgObj.height,
              viewerWidth, viewerHeight;

          // Calculating viewer size
            if(imgWidth > maxImgWidth || imgHeight > maxImgHeight) {
              if(maxImgWidth < maxImgHeight || imgWidth < imgHeight) {
                viewerWidth = maxImgWidth;
                viewerHeight = imgHeight / (imgWidth / maxImgWidth);
              } else {
                viewerWidth = imgWidth / (imgHeight / maxImgHeight);
                viewerHeight = maxImgHeight;
              }
            } else {
              viewerWidth = imgWidth;
              viewerHeight = imgHeight;
            }

            viewerWidth = Math.floor(viewerWidth);
            viewerHeight = Math.floor(viewerHeight);

          // Applying event
            if(Math.floor(parseInt(viewerStyle.width)) != viewerWidth || Math.floor(parseInt(viewerStyle.height)) != viewerHeight) {
              this.onTransitionEnd = function() {
                objRef.changeImg(img);
              };
            } else {
              this.changeImg(img);
            }

          // Applying size
            viewerHeight && this.alterSize(
              (this.overlay.offsetHeight - viewerHeight + 2) / 2,
              (this.overlay.offsetWidth - viewerWidth + 2) / 2,
              viewerWidth,
              viewerHeight
            );
        
        }

        else if(img.loaded) { // Step 3 : Display the actual image.

          newImg.src = img.src;
          viewer.appendChild(newImg);
          
          setTimeout(function() {
            newImg.style.opacity = 1;
          }, 10);

          this.title.innerHTML = img.title;

          var group = img.parentGroup || {};
          this.manageControls(group.prevImgExists, group.nextImgExists, img.title);

        }

        !img.loaded && img.load(true);
      
      }

    };
    
    v.alterSize = function(top, left, width, height) { // Using a CSS class increases performances for the CSS 3 transitions (ya rly !)
    
      var el = this.viewerSize,
          s = document.createTextNode([
            '.box_viewer{',
              'top:'+ top +'px;',
              'left:'+ left +'px;',
              'width:'+ width +'px;',
              'height:'+ height +'px;',
            '}'
          ].join(''));

      if(el.styleSheet) { // IE
        el.styleSheet.cssText = s.nodeValue;
      } else { // Other browsers
        var child1 = el.firstChild;
        child1 && el.removeChild(child1);
        el.appendChild(s);
      }
    
    };

    v.manageControls = function(left, right, title) {
      
      this.leftArrow.style.display = left ? 'block' : 'none';
      this.rightArrow.style.display = right ? 'block' : 'none';
      this.title.style.display = title ? 'block' : 'none';

    };
    
    v.previous = function() {
    
      var group = this.currentImg.parentGroup;
      this.displayed && group && this.changeImg(group.previous());
    
    };
    
    v.next = function() {
    
      var group = this.currentImg.parentGroup;
      this.displayed && group && this.changeImg(group.next());
    
    };
  
  
  /*** Group object ***/
  
  /*
  
    Constructor :
      Group([ImageB img1, ImageB img2, ...])
    
    Public attributes :
      parentViewer
      nextImgExists
      prevImgExists
    
    Public methods :
      addImage(ImageB img)
      previous()
      next()
      replaceCursorOn(ImageB img)
      loadNextImgs()
  
  */
  
    function Group(imgs) {
    
      this.imgs = [];
      this.cursor = 0;
      
      //for(var i = 0, img ; img = imgs[i++] ;) {
      //  this.addImage(img);
      //}
    
    }
    
    var g = Group.prototype;
    
    g.addImage = function(img) {
    
      img.parentGroup = this;
      this.imgs.push(img);
      this.imgs.length > 1 && (this.nextImgExists = true);
    
    };
    
    g.previous = function() {
    
      var img = false;
      
      this.prevImgExists && (img = this.imgs[this.cursor - 1]);
      this.loadNextImgs();
      
      return img;
    
    };
    
    g.next = function() {
    
      var img = false;
      
      this.nextImgExists && (img = this.imgs[this.cursor + 1]);
      this.loadNextImgs();
      
      return img;
    
    };
    
    g.replaceCursorOn = function(img) {
    
      var tmpCursor = this.imgs.indexOf(img);
      ~tmpCursor && (this.cursor = tmpCursor);
      
      this.prevImgExists = !!this.imgs[this.cursor - 1];
      this.nextImgExists = !!this.imgs[this.cursor + 1];
      
      this.loadNextImgs();
    
    };
    
    g.loadNextImgs = function() {
    
      this.prevImgExists && this.imgs[this.cursor - 1].load(false);
      this.nextImgExists && this.imgs[this.cursor + 1].load(false);
    
    };
  
  
  /*** ImageB object ***/
  
  /*
    
    Constructor :
      ImageB(HTMLLinkElement linkEL)
    
    Public attributes :
      src
      imgObj
      loaded
      parentGroup
      parentViewer
      thumb : top, left, width, height
    
    Public methods :
      load(Boolean openOnLoad)
  
  */
  
    function ImageB(linkEL) {
    
      var objRef = this;
      
      // Initialization
        this.id = this.getID();
        this.imgEL = linkEL.getElementsByTagName('img')[0];
        this.imgObj = new Image();
        this.src = linkEL.href;
        this.title = linkEL.title;
      
      // Events
        addEvent(this.imgObj, 'load', function() {
          var viewer = objRef.parentViewer || objRef.parentGroup.parentViewer;
          
          objRef.loaded = true;
          objRef.openOnLoad && viewer.changeImg(objRef);
        });
        
        addEvent(linkEL, 'click', function(e) {
          e.preventDefault();
          (objRef.parentViewer || objRef.parentGroup.parentViewer).open(objRef);
        });
    
    }
    
    var i = ImageB.prototype;
    
    i.load = function(openOnLoad) {
      this.openOnLoad = openOnLoad;
      this.imgObj.src = this.src;
    };

    i.getThumbDetails = function() {
      
      var imgEL = this.imgEL,
          pos = this.getThumbnailPos();
      
      return {
        top: pos[0],
        left: pos[1],
        width: imgEL.offsetWidth,
        height: imgEL.offsetHeight
      };
    
    };

    i.getThumbnailPos = function() {
    
      var el = this.imgEL,
          top = 0, left = 0;
      
      do {
        top += el.offsetTop;
        left += el.offsetLeft;
      } while(el = el.offsetParent);
      
      return [top, left];
    
    };

    i.getID = (function() {
      
      var id = 0;
      
      return function() {
        return id++;
      };
      
    })();
    
    i.toString = function() {
      return this.id;
    };
  

  /*** Loading object ***/
  
  /*
    
    Constructor :
      Loading(HTMLElement parent)
  
  */

    function Loading(parent) {

      var el = document.createElement('div');
      el.className = 'box_load';
      parent.appendChild(el);

      setInterval((function() {

        var state = 3,
            states = [
              [1, 'Left', 'Top'],
              [2, 'Top', 'Right'],
              [3, 'Right', 'Bottom'],
              [0, 'Bottom', 'Left']
            ];

        return function() {

          el.className = 'box_load';

          state = states[state][0];
          el.style['border'+ states[state][1] +'Color'] = 'rgba(204,204,204,0.2)';
          el.style['border'+ states[state][2] +'Color'] = 'rgba(204,204,204,0.6)';

          setTimeout(function() {
            el.className = 'box_load box_anim box_rotate';
          }, 20);

        };

      })(), 250);

      return el;

    }
  
  
  /*** Initialization ***/
  
    addEvent(window, 'load', function() {
      
      var imgs = [],
          groups = [],
          links = document.getElementsByTagName('a');
      
      for(var i = 0, link ; link = links[i++] ;) {
        if(/^(boxifier|lightbox)(\[([a-z0-9]+)\])?$/i.test(link.rel)) {
      
          if(RegExp.$3) {
            groups[RegExp.$3] || (groups[RegExp.$3] = new Group());
            groups[RegExp.$3].addImage(new ImageB(link));
          } else {
            imgs.push(new ImageB(link));
          }
      
        }
      }
      
      var objs = imgs;
      
      for(i in groups) {
        objs.push(groups[i]);
      }
      
      new Viewer(objs);
      
    });
  
  
})();