document.write('<nav class="navbar navbar-default" role="navigation">');

//Brand and toggle get grouped for better mobile display
document.write('<div class="navbar-header">');
document.write('<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">');
document.write('<span class="sr-only">Toggle navigation</span>');
document.write('<span class="icon-bar"></span>');
document.write('<span class="icon-bar"></span>');
document.write('<span class="icon-bar"></span>');
document.write('</button>');
//document.write('<a class="navbar-brand" href="#">DIRG</a>');
document.write('</div>');

document.write('<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">');
document.write('<ul class="nav navbar-nav">');

//The buttons in the navigation bar
document.write('<li><a href="/">Home</a></li>');
document.write('<li><a href="test_idp">Test idp</a></li>');
document.write('<li><a href="/idp_config">Configure idp </a></li>');

document.write('</ul>');
document.write('</div>');
document.write('</nav>');
