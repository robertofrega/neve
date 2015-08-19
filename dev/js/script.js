var View = {
	Nav: {
		scrollTo: function(element){
			$(window).scrollTo(element,{
			  axis: 'y',
			  duration: 800
			});
		}
	}
}




$("nav.navbar-fixed-top").autoHidingNavbar();
