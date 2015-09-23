$(document).ready(function() {
	
	// intial setup
	
	$('#container-pg2').hide();
	$('#container-pg3').hide();
	
	
	// api function call 
	
	function apiCall(topic, classClick, classB, outputDiv) {
		baseUrl = 'http://www.khanacademy.org/api/v1/topic/' + topic
		$.get(baseUrl, function(data) {
			var htmlOutput = '';
			for(var obj in data["children"]) {
			    currentObj = data["children"][obj];
				htmlOutput = htmlOutput + "<div class=" + classClick + ' id=' + currentObj["id"] + ">";
				htmlOutput = htmlOutput + "<h4 class= " + classB + ">" + currentObj["title"] +"</h4></div>";  
			}
			
			$(outputDiv).append(htmlOutput);
		})
	}
	
	// function to handle button calls
	
	function buttonCalls(id, classAttribute, clickDiv) {
		
		if(ranAlready.indexOf(id) !== -1){ 
			$('#' + id + ' .' + classAttribute).toggle();
			console.log($('.' + classAttribute).css('display'))
			if(classAttribute === 'btn-success' && $('.' + classAttribute).css('display') === 'none' ) {
				$('#' + id + ' .btn-info').hide();
			}
			
		}
		else {
			ranAlready.push(id);
			apiCall(id,clickDiv ,classAttribute,'#' + id);
		}
	}
	
	// pause all playing videos when going from one page to another
	function pauseVideos(){
		var $allVideos = $('.videosAll');
		for(x in $allVideos){
			if(typeof $allVideos[x] === 'object' ) {
				$allVideos[x].pause()
				console.log($allVideos[x], typeof $allVideos)
			}
		}
	}
	
	// call the api function for the different categories
	
	apiCall('science', 'clickDiv1', 'btn-primary', '#cont-science');
	apiCall('math', 'clickDiv1', 'btn-primary', '#cont-math');
	apiCall('humanities', 'clickDiv1', 'btn-primary', '#cont-huma');
	var ranAlready = [];
	
	// even handlers for the different buttons
	

	$(document).on('click', '.btn-primary', function() {
		var $idOfElememt = $(this).parent().attr('id');
		buttonCalls($idOfElememt,'btn-success', 'clickDiv2');
	})
	
	$(document).on('click', '.btn-success', function() {
		var $idOfElememt = $(this).parent().attr('id');
		buttonCalls($idOfElememt,'btn-info', 'clickDiv3');
	})
	

	$(document).on('click', '.btn-info',function() {
		var $idOfElememt = $(this).parent().attr('id');
		var $heading = $(this).html();
		urlVideo = 'http://www.khanacademy.org/api/v1/topic/' + $idOfElememt + '/videos';
		$.get(urlVideo, function(data) {
		var videoOutput = '';
		if(data.length === 0) {
			videoOutput = '<h2 style="text-align:center;">No videos avaliable</h2>';		
		}
		else {
			
			videoOutput = "<h2 class='page-header'>" + $heading + "</h2>";
			for(var obj in data) {
				var classObj = '';
			 if(data[obj]["translated_title"] in localStorage) {
				 classObj = 'unSave';
			 }
			 else {
				classObj = 'saveMe';
			 }
			videoOutput = videoOutput + "<div class='videos'>";
			videoOutput = videoOutput + "<h3>" + data[obj]["translated_title"] +"</h3> <div class='" + classObj + "'></div>";  
			videoOutput = videoOutput + "<video class='videosAll' controls><source src=" + data[obj]["download_urls"]["mp4"] + " type='video/mp4' ></video></div>" ;
			}
		}
		$('#page1').hide();
		$('#page2').html(videoOutput);
		$('#container-pg2').show();
		$('.backButton').addClass('buttonAnimation');
	})
	.fail(function() {
		$('#page1').hide();
		$('#page2').html('<h2 style="text-align:center;">No videos avaliable</h2>');
		$('#container-pg2').show();
		$('.backButton').addClass('buttonAnimation');	
	})
	
	
	})
	
	$(document).on('click', '.saveMe',function() {
		localStorage.setItem($(this).prev().html(), $(this).next().children().attr('src')) 
		$(this).removeClass('saveMe').addClass('unSave');	
	}) 
	
	$(document).on('click', '.unSave',function() {
		localStorage.removeItem($(this).prev().html()) 
		$(this).removeClass('unSave').addClass('saveMe');	
	}) 
	
	$(document).on('click', '.remove',function() {
		localStorage.removeItem($(this).prev().html())
		$(this).parent().remove()
		if($('#page3').html() === '') {
			$('#page3').html("<h2 style='text-align:center'>Playlist is Empty</h2>")
		}
	}) 
	
	
	
	
	$('#playlist-btn').click(function() {
		$('#page1').hide();
		$('#container-pg2').hide();
		$('#container-pg3').show();
		$('.backButton').addClass('buttonAnimation');	
		var outVideo = '';
		var counter = 0;
		if(localStorage.length === 0) {
			outVideo = "<h2 style='text-align:center'>Playlist is Empty</h2>";
		}
		else {
			for(var objVideo in localStorage) {
				counter = counter + 1
				if(counter <= localStorage.length ) {
					outVideo = outVideo + "<div class='videos'><h2>" + objVideo + "</h2> <div class='remove'>Remove</div>"
					outVideo = outVideo + "<video class='videosAll' controls><source src=" + localStorage[objVideo] + " type='video/mp4' ></video></div>";
				}
			}
		}

		$('#page3').html(outVideo);
		pauseVideos();
	})
			
	$('.backButton').click(function(){
		$('#container-pg2').hide();
		$('#container-pg3').hide();
		$('#page1').show();
		$(this).removeClass('buttonAnimation');
		pauseVideos();
	})
	
	
})
