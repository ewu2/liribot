require("dotenv").config();

var fs = require("fs");
var request = require('request');
var keys = require("./keys.js");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var chalk = require('chalk');
var command = process.argv[2];
var parameter = process.argv[3];


function switchCase() {

  switch (command) {

    case 'concert-this':
      concertThis(parameter);                   
      break;                          

    case 'spotify-this-song':
      spotifyThis(parameter);
      break;

    case 'movie-this':
      movieThis(parameter);
      break;

    case 'do-what-it-says':
      readRandom();
      break;

      default:                            
      display("Unknown request. Try again later.");
      break;
  }
};


//BANDSINTOWN
function concertThis(parameter){

if ('concert-this')
{
	var artist="";
	for (var i = 3; i < process.argv.length; i++)
	{
		artist+=process.argv[i];
    }  
}
else
{
	artist = parameter;
}

var queryUrl = "https://rest.bandsintown.com/artists/"+ artist +"/events?app_id=codingbootcamp";

request(queryUrl, function(error, response, body) {

  if (!error && response.statusCode === 200) {

    var bandsObject = JSON.parse(body);
    for (i = 0; i < bandsObject.length; i++)
    {
      var date = moment(bandsObject[i].venue.datetime).format('MM/DD/YYYY');
      var time = moment(bandsObject[i].venue.datetime).format('hh:mm a');
  
      console.log(chalk.blue("\n---------------------------------------------------\n"));
      console.log(chalk.grey("Name: " + bandsObject[i].venue.name));
      console.log(chalk.grey("City: " + bandsObject[i].venue.city));
      if (bandsObject[i].venue.region !== "")
      {
        console.log(chalk.grey("Country: " + bandsObject[i].venue.region));
      }
      console.log(chalk.grey("Country: " + bandsObject[i].venue.country));
      console.log(chalk.grey("Date: " + date));
      console.log(chalk.grey("Time: " + time));
      console.log(chalk.blue("\n---------------------------------------------------\n"));
    }
  }
});
}


//SPOTIFY
function spotifyThis(parameter) {

  var serachSong;
  if (parameter === undefined) {
    serachSong = "Ace of Base The Sign";
  } else {
    serachSong = parameter;
  }

  spotify.search({
    type: 'track',
    query: serachSong
  }, function(error, data) {
    if (error) {
      console.log('Error recorded: ' + error);
      return;
    } else {
      console.log(chalk.blue("\n---------------------------------------------------\n"));
      console.log(chalk.grey("Artist: " + data.tracks.items[0].artists[0].name));
      console.log(chalk.grey("Song: " + data.tracks.items[0].name));
      console.log(chalk.grey("Preview: " + data.tracks.items[3].preview_url));
      console.log(chalk.grey("Album: " + data.tracks.items[0].album.name));
      console.log(chalk.blue("\n---------------------------------------------------\n")); 
    } 
  });
};


//OMDB
function movieThis(parameter) {

  var searchMovie;
  if (parameter === undefined) {
    searchMovie = "Mr. Nobody";
  } else {
    searchMovie = parameter;
  };

  var queryUrl = "http://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=short&apikey=trilogy";
  
  request(queryUrl, function(err, res, body) {
  	var bodyOf = JSON.parse(body);
    if (!err && res.statusCode === 200) {
      console.log(chalk.blue("\n---------------------------------------------------\n"));
      console.log(chalk.grey("Title: " + bodyOf.Title));
      console.log(chalk.grey("Release Year: " + bodyOf.Year));
      console.log(chalk.grey("IMDB Rating: " + bodyOf.imdbRating));
      console.log(chalk.grey("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value)); 
      console.log(chalk.grey("Country: " + bodyOf.Country));
      console.log(chalk.grey("Language: " + bodyOf.Language));
      console.log(chalk.grey("Plot: " + bodyOf.Plot));
      console.log(chalk.grey("Actors: " + bodyOf.Actors));
      console.log(chalk.blue("\n---------------------------------------------------\n"));
    }
  });
};


//DO WHAT RANDOM.TXT SAYS
function readRandom() {

 fs.readFile('random.txt', "utf8", function(error, data){

    if (error) {
        return display(error);
      }

  
    var dataArray = data.split(",");
    
    if (dataArray[0] === "spotify-this-song") {
        
      var checkSong = dataArray[1].trim().slice(1, -1);
      spotifyThis(checkSong);
    } 
   
    });

};

//LOG.TXT
function display(logData) {

	console.log(logData);

	fs.appendFile('log.txt', logData + '\n', function(err) {
		
		if (err) return display('Error logging data to file: ' + err);	
	});
}

switchCase();