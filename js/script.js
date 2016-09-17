var websites = [];

//Api call for fetchcing list of prfiles 
function fetchAPICall(){
	$.ajax({
		url:' https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites',
		type:'GET',
		dataType:'json',
		success:function(data){
			console.log(data);
			for(var i=0;i<data.websites.length;i++){
				websites.push(data.websites[i]);	
			}
			populateList(websites); //function for populate the html list
		},
		error:function(error){
			console.log(error);
		}
	});
}

//Api call for posting data
function postAPICall(title,tag,url){
	$.ajax({
		url:"https://hackerearth.0x10.info/api/one-push?type=json&query=push&title="+title+"&url="+url+"&tag="+tag,
		type:'POST',
		success:function(data,textStatus){
		     alert(textStatus+": "+data.message);
		    console.log(textStatus);	
		},
		error:function(error){
			console.log(error);
		}
	});
}

//Function for search using tag or  title or url 
function searchFun(){
	var searchQuery=$("#search-box").val();
	/*call populate list using matched string*/
	populateList(websites.filter(function(website){
		var tag = website.tag;
		var url = website.url_address;
		var title = website.title;
		return (tag.indexOf(searchQuery) !== -1  || title.indexOf(searchQuery) !== -1 
			|| url.indexOf(searchQuery) !== -1) ;
	}));
}

function populateList(listData) {
	
	//Clear all entries before population
	$("#all-entries").empty();

	for(var i=0; i<listData.length; i++){
		addListElement(listData[i]);
	}
}

function addListElement(data){
	
   var clone=$("#single-entry").clone().appendTo("#all-entries");
   //Put data for each list element returned from api call
   clone.find(".icon img").attr("src",data.favicon_image);
   clone.find(".detail h4").text(data.title);
   clone.find(".detail .tag").text(data.tag);
   clone.find(".detail a").attr("href",data.url_address);
   clone.find(".detail .url-address").text(data.url_address);
   clone.find(".likes button").attr("id","like-button-"+data.id);
   clone.find("#likes-count").text(localStorage[data.url_address]);
   clone.removeAttr("id");
   clone.attr("id",data.id);
   $("#like-button-" + data.id).click(function(e){
   	likeButtonOnClick(data.url_address, clone)}
   	);
}


//function for saving number of likes using local storage 
function likeButtonOnClick(key, websiteEl){
	if(typeof(Storage) !== "undefined") {
        if (localStorage[key]) {
            localStorage[key] = Number(localStorage[key])+1;
        } else {
            localStorage[key] = 1;
        }
        console.log(websiteEl);
        $(websiteEl).find("#likes-count").text(localStorage[key]);
    } else {
        console.log("Browser does not support local storage");
        alert("This action is not supported");
    }
}

$(document).ready(function(){
	
	//get data
	fetchAPICall();
	$("#search-box").on('input', function(){
		searchFun($(this).val());	
	});
	//fab button click event
	$("#post-button").on('click',function(){
		var title=$("input[name='title']").val();
		var tag=$("input[name='tag']").val();
		var url=$("input[name='url']").val();
		if(title==null || title==""|| tag==null || tag=="" || url==null || url=="")
		{
			alert("Please fill all the fields!");
		}
		else{
		postAPICall(title,tag,url);
		}
	});
	
});