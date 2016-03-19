$(document).ready(function(){

  var url, searchterm, title, imagename;
  var titleArr = [];

  $("#searchbar").keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == "13") {
      getSearchResults();
    }
  }); // close key press

  $("#searchbutton").on("click", function() {
    getSearchResults();
  });  // close button click

  function getSearchResults() {
    searchterm = $("#searchbar").val();
    $("[class*=article-]").remove();

    $.ajax({
      url: "//en.wikipedia.org/w/api.php",
      type: "GET",
      data: {action: 'query', list: 'search', srsearch: searchterm, format: 'json'},
      contentType: "application/json",
      dataType: 'jsonp',
      success: function(data) {
        // console.log(data);
        $(".search-container").append("<div class=article-total-hits>")
        $(".article-total-hits").html("Total hits: "+data.query.searchinfo.totalhits);
        for (var i=0; i < data.query.search.length; i++ ) {
          titleArr[i] = data.query.search[i].title
          title = data.query.search[i].title
          $(".search-container").append("<div class=article-box-"+i+">");
          $(".article-box-"+i).append("<div class=article-name-"+i+">");
          $(".article-box-"+i).append("<img src='#' class=article-image-"+i+">");
          $(".article-box-"+i).append("<div class=article-snippet-"+i+">");
          $(".article-box-"+i).append("<div class=article-date-"+i+">");
          $(".article-box-"+i).append("<div class=article-wordcount-"+i+">");
          $(".article-name-"+i).html(title);
          $(".article-snippet-"+i).html(data.query.search[i].snippet);
          $(".article-date-"+i).html("Last Modified Date: "+new Date(data.query.search[i].timestamp).toLocaleString());
          $(".article-wordcount-"+i).html("Wordcount: "+data.query.search[i].wordcount);
          // $(".article-name-"+i).attr("href", "http://en.wikipedia.org/wiki/"+title);
          (function(title){ // make the entire article-box-x div a link to the article page.
            $(".article-box-"+i).on("click", (function(){
              // location.href="http://en.wikipedia.org/wiki/"+title;
              window.open("http://en.wikipedia.org/wiki/"+title, 'mywindow')
            }));
          })(title); // use a closure to pass title variable correctly
        } // close for loop(i)

        //loop through the titles and get the image URL
        for (var x = 0; x <= titleArr.length; x++) {
          (function(x){
            $.ajax({
              url: "//en.wikipedia.org/w/api.php",
              type: "GET",
              data: {action: 'query', titles: titleArr[x], prop: "pageimages", pithumbsize: 500, format: 'json'},
              contentType: "application/json",
              dataType: 'jsonp',
              success: function(dataImage) {
                // console.log(dataImage);
                // console.log("after: "+titleArr[x]);
                var imagekey = Object.keys(dataImage.query.pages)
                imagekey = imagekey[0]; // always retreive the first image
                if (dataImage.query.pages[imagekey].thumbnail === undefined) {
                  $(".article-image-"+x).attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png");
                } else {
                  imagename = (dataImage.query.pages[imagekey].thumbnail.source);
                  $(".article-image-"+x).attr("src", imagename);
                }
              }, // close success
              error: function(e) {
                console.log(e.message);
              }
            }); // close second API call
          })(x);// close the 'closure'
        } // close for loop(x)
      }, // close success
      error: function(e) {
        console.log(e.message);
      }
    }); // first API call
  } // close function

  $("#randomsearch").on("click", function() {
    window.open("http://en.wikipedia.org/wiki/Special:Random", 'mywindow')
  });  // close button click

}); // close document ready

// data: {action: 'query', titles: "title", prop: "pageimages", format: 'json'},
//url = "https://en.wikipedia.org/w/api.php?action=query&list=prefixsearch&pssearch="+searchterm+"&format=json";
