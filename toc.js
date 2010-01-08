(function($){
     var toc, // generated toc elements
     toc_cursor, // keeps our position in the toc
     toc_cursor_level=0, // tracks our current heading level
     heading_cursor; // keeps our position as we look for headings

     /**
      * Check whether heading has an id attribute, and generate one if not
      */
     function ensureHeadingHasId(heading) {
         if (!heading.attr('id')) {
             heading.attr({id: heading.text().replace(/\W/g, '')});
         }
     }

     /**
      * Create a new line element for the heading
      */
     function createTocLine(heading) {
         ensureHeadingHasId(heading);
         return $(['<li><a href="#', heading_cursor.attr('id') + '">',
                   heading_cursor.text(), '</a></li>'].join(''));
     }

     /**
      * Tell what kind of heading this is
      */
     function headingLevel(elm) {
         return (elm[0].nodeName.match(/^h(\d)/i) || [null, 0])[1] * 1;
     }

     /**
      * Attempt to add a line to the TOC. Returns false on failure.
      */
     function addToToc(elm) {
         var level = headingLevel(elm);

         // not a heading
         if (!level) { return false; }

         var line = createTocLine(elm);

         // sibling heading
         if (level == toc_cursor_level) {
             toc_cursor.after(line);
         }
         // sub heading
         else if (level > toc_cursor_level) {
             toc_cursor.append($('<ul/>').append(line));
         }
         // super heading
         else if (level < toc_cursor_level) {
             toc_cursor.parents('ul:eq(1)').append(line);
         }

         // update the cursor
         toc_cursor = line;
         toc_cursor_level = level;
         return true;
     }

     /**
      * Tell if there are any headings nested inside an element
      */
     function hasInnerHeadings(elm) {
         return elm.html().match(/\<h\d/i);
     }

     // ----

     // start with the first h1
     heading_cursor = $('h1:eq(0)');
     toc_cursor = toc = $('#toc');

     // walk the DOM
     while (heading_cursor.length) {
         // attempt to add to the toc
         if (addToToc(heading_cursor)) {
             // move to the next element
             heading_cursor = heading_cursor.next();
         }
         // subheadings found: move to the first child
         else if (hasInnerHeadings(heading_cursor)) {
             heading_cursor = heading_cursor.children(':first');
         }
         // end of this branch: step up one level
         else if (!heading_cursor.next().length) {
             heading_cursor = heading_cursor.parent().next();
         }
         // continue in this branch, moving to the next element
         else {
             heading_cursor = heading_cursor.next();
         }
     }
 })(jQuery);
